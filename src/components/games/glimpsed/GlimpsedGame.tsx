import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameLayout from '../../GameLayout';
import { GlimpsedGameService, GlimpsedGameState } from './GlimpsedGameService';
import { getTodaysGlimpsedGame, getGlimpsedGameById } from '../../../data/glimpsedData';
import { getMovieById } from '../../../data/moviesData';
import { GameStorageManager } from '../../../utils/gameStorage';
import { CooldownService } from '../../../services/cooldownService';
import { generateGlimpsedShareText, GlimpsedShareData } from '../../../utils/shareUtils';
import GlimpsedControls from './GlimpsedControls';
import GlimpsedGuessHistory from './GlimpsedGuessHistory';
import GlimpsedFrameViewer from './GlimpsedFrameViewer';
import type { GlimpsedFrameViewerHandle } from './GlimpsedFrameViewer';
import ShareModal from '../../ShareModal';
import Toast from '../../Toast';
import Fireworks from '../../Fireworks';

const GlimpsedGame: React.FC = () => {
  const { gameId: paramGameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  
  // Game state
  const [gameData, setGameData] = useState(getTodaysGlimpsedGame());
  const [gameState, setGameState] = useState<GlimpsedGameState>(
    GlimpsedGameService.initializeGameState()
  );
  const [isArchiveGame, setIsArchiveGame] = useState(false);
  
  // UI state
  const [showShareModal, setShowShareModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [cooldownTime, setCooldownTime] = useState(0);
  const viewerRef = useRef<GlimpsedFrameViewerHandle | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  // Handle archive click
  const handleArchiveClick = () => {
    navigate('/glimpsed/archive');
  };

  useEffect(() => {
    if (paramGameId) {
      // Archive game
      const archiveGame = getGlimpsedGameById(`glimpsed-${paramGameId}`);
      setGameData(archiveGame);
      setIsArchiveGame(true);
    } else {
      // Today's game
      setGameData(getTodaysGlimpsedGame());
      setIsArchiveGame(false);
    }
  }, [paramGameId]);

  useEffect(() => {
    if (!gameData) return;

    // Load game progress
    const progress = GlimpsedGameService.loadGameProgress(gameData.id);
    setGameState(progress);

    // Check cooldown for today's game only
    if (!isArchiveGame) {
      const cooldownState = CooldownService.getCooldownState('glimpsed');
      setCooldownTime(cooldownState.remainingTime);
      
      if (cooldownState.isOnCooldown) {
        CooldownService.startCooldownTimer('glimpsed', (newState) => {
          setCooldownTime(newState.remainingTime);
        });
      }
    }
  }, [gameData, isArchiveGame]);

  const handleGuess = (guess: string) => {
    if (!gameData || gameState.gameCompleted) return;

    // Prevent duplicate guesses (case-insensitive)
    const normalizedGuess = guess.toLowerCase().trim();
    const previousLower = gameState.guesses.map(g => g.toLowerCase().trim());
    if (previousLower.includes(normalizedGuess)) {
      setToast({ message: 'Already Guessed', type: 'info' });
      return;
    }

  const movieData = getMovieById(gameData.movieId);
    if (!movieData) return;

    const result = GlimpsedGameService.processGuess(guess, movieData.name, gameState);
    
    // Update state immediately
    setGameState(result.newState);
    
    // Save progress
    const score = result.gameWon ? GlimpsedGameService.calculateScore(result.newState) : undefined;
    GlimpsedGameService.saveGameProgress(gameData.id, result.newState, result.gameWon, score);

    // If guess was correct, trigger the frame autoplay in the viewer immediately
    if (result.isCorrect) {
  // show fireworks briefly at center
  setShowFireworks(true);
  viewerRef.current?.playRemaining?.();
  // hide after duration (component also calls onComplete) as a fallback
  setTimeout(() => setShowFireworks(false), 3800);
    }
    
    // Update last played and stats if game completed and it's today's game
    if (result.newState.gameCompleted && !isArchiveGame) {
      GameStorageManager.updateLastPlayed('glimpsed');
      GameStorageManager.updateUserStats('glimpsed', result.gameWon, result.newState.attempts, score || 0);
      
      // Set cooldown
      const newCooldownTime = CooldownService.getCooldownState('glimpsed').remainingTime;
      setCooldownTime(newCooldownTime);
      
      if (newCooldownTime > 0) {
        CooldownService.startCooldownTimer('glimpsed', (newState) => {
          setCooldownTime(newState.remainingTime);
        });
      }
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleReplay = () => {
    if (!gameData) return;
    GlimpsedGameService.clearGameProgress(gameData.id);
    setGameState(GlimpsedGameService.initializeGameState());
    // Clear persisted cooldown and any running timer
    GameStorageManager.clearGameCooldown('glimpsed' as any);
    // Stop cooldown timer
    (CooldownService as any).clearTimer('glimpsed');
    setCooldownTime(0);
    setToast({ message: 'Game reset! Cooldown cleared.', type: 'success' });
  };

  const generateShareData = (): GlimpsedShareData => {
    if (!gameData) {
      return {
        gameId: 'unknown',
        gameWon: false,
        totalAttempts: 0,
        framesShown: 1,
        guesses: []
      };
    }

    return {
      gameId: gameData.id,
      gameWon: gameState.movieFound,
      totalAttempts: gameState.attempts,
      framesShown: gameState.currentFrame,
      guesses: gameState.guesses
    };
  };

  // Show loading if no game data
  if (!gameData) {
    return (
      <GameLayout title="Glimpsed" description="Guess the Bollywood movie from frames">
        <div className="text-center py-8">Loading...</div>
      </GameLayout>
    );
  }

  // We'll render cooldown UI inline inside the normal GameLayout return instead of an early return

  const movieData = getMovieById(gameData.movieId);

  return (
    <GameLayout title="Glimpsed" description="Guess the Bollywood movie from frames">
      <div className="max-w-4xl mx-auto relative">
        {/* Header with Archive Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1"></div>
          <button
            onClick={handleArchiveClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
            title="View past games"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Archive
          </button>
        </div>

        {/* Cooldown square overlay (left side) */}
          {cooldownTime > 0 && !isArchiveGame && (
            <div className="absolute left-4 top-2">
              <div className="w-32 h-10 bg-bollywood-teal text-white rounded-lg shadow-lg flex flex-col items-center justify-center p-2">
                <span className="text-sm font-semibold">Next: {CooldownService.getCooldownState('glimpsed').formattedTime}</span>
              </div>
            </div>
          )}

        {/* Game Completed Section */}
        {gameState.gameCompleted && (
          <div className="text-center mb-6">
            <div className={`p-2 rounded-lg ${gameState.movieFound ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className={`text-2xl font-bold ${gameState.movieFound ? 'text-green-800' : 'text-red-800'}`}>
                {gameState.movieFound ? '🎉 Congratulations!' : '😔 Game Over'}
              </h3>
            </div>
          </div>
        )}

        {/* Frame Viewer */}
        <GlimpsedFrameViewer
          ref={viewerRef}
          gameData={gameData}
          gameState={gameState}
        />

        {/* Controls */}
        <GlimpsedControls
          onGuess={handleGuess}
          // Treat cooldown as a completed/readonly state for controls
          gameCompleted={gameState.gameCompleted || (cooldownTime > 0 && !isArchiveGame)}
          onShare={handleShare}
          onReplay={handleReplay}
        />

        {/* Guess History */}
        {gameState.guesses.length > 0 && (
          <GlimpsedGuessHistory
            guesses={gameState.guesses}
            correctMovie={movieData?.name || ''}
            gameCompleted={gameState.gameCompleted}
          />
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            isVisible={!!toast}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareText={generateGlimpsedShareText(generateShareData())}
          gameTitle="Glimpsed Result"
        />
  {/* Fireworks on correct guess */}
  <Fireworks isActive={showFireworks} onComplete={() => setShowFireworks(false)} />
      </div>
    </GameLayout>
  );
};

export default GlimpsedGame;
