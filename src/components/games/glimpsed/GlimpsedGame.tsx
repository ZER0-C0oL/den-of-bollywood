import React, { useState, useEffect } from 'react';
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
import GlimpsedCooldownView from './GlimpsedCooldownView';
import ShareModal from '../../ShareModal';
import Toast from '../../Toast';

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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [cooldownTime, setCooldownTime] = useState(0);

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

    const movieData = getMovieById(gameData.movieId);
    if (!movieData) return;

    const result = GlimpsedGameService.processGuess(guess, movieData.name, gameState);
    
    // Update state immediately
    setGameState(result.newState);
    
    // Save progress
    const score = result.gameWon ? GlimpsedGameService.calculateScore(result.newState) : undefined;
    GlimpsedGameService.saveGameProgress(gameData.id, result.newState, result.gameWon, score);
    
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

    // Show feedback toast
    if (result.isCorrect) {
      setToast({ message: `🎉 Correct! You found the movie!`, type: 'success' });
    } else if (result.newState.gameCompleted) {
      setToast({ message: `😔 Game over! The movie was "${movieData.name}"`, type: 'error' });
    } else {
      setToast({ message: `Not quite! Here's the next frame...`, type: 'error' });
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleReplay = () => {
    if (!gameData) return;
    
    GlimpsedGameService.clearGameProgress(gameData.id);
    setGameState(GlimpsedGameService.initializeGameState());
    setToast({ message: 'Game reset! Good luck!', type: 'success' });
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

  // Show cooldown view for today's game if on cooldown
  if (cooldownTime > 0 && !isArchiveGame) {
    return (
      <>
        <GlimpsedCooldownView
          formattedTime={CooldownService.getCooldownState('glimpsed').formattedTime}
          onShare={handleShare}
          onReplay={handleReplay}
          onArchive={handleArchiveClick}
          showShareModal={showShareModal}
          onCloseShareModal={() => setShowShareModal(false)}
        />
        
        {/* Share Modal for cooldown view */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareText={generateGlimpsedShareText(generateShareData())}
          gameTitle="Glimpsed Result"
        />
      </>
    );
  }

  const movieData = getMovieById(gameData.movieId);

  return (
    <GameLayout title="Glimpsed" description="Guess the Bollywood movie from frames">
      <div className="max-w-4xl mx-auto">
        {/* Header with Archive Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1"></div>
          <button
            onClick={handleArchiveClick}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm"
            title="View past games"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Archive
          </button>
        </div>

        {/* Game Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {gameData.title}
          </h1>
          <p className="text-gray-600">
            Guess the Bollywood movie from the frames shown
          </p>
        </div>

        {/* Frame Viewer */}
        <GlimpsedFrameViewer
          gameData={gameData}
          gameState={gameState}
        />

        {/* Controls */}
        <GlimpsedControls
          onGuess={handleGuess}
          gameCompleted={gameState.gameCompleted}
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
      </div>
    </GameLayout>
  );
};

export default GlimpsedGame;
