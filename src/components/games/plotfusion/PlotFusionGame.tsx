import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import GameLayout from '../../GameLayout';
import ShareModal from '../../ShareModal';
import Toast from '../../Toast';
import { PlotFusionGameService, PlotFusionGameState } from './PlotFusionGameService';
import { PlotFusionGameData } from '../../../types/gameTypes';
import { getTodaysPlotFusionGame, getPlotFusionGameById } from '../../../data/plotFusionData';
import { generatePlotFusionShareText, PlotFusionShareData } from '../../../utils/shareUtils';
import { CooldownService } from '../../../services/cooldownService';
import { GameStorageManager } from '../../../utils/gameStorage';
import PlotFusionControls from './PlotFusionControls';
import PlotFusionCooldownView from './PlotFusionCooldownView';
import PlotFusionMovieFrame from './PlotFusionMovieFrame';
import PlotFusionHints from './PlotFusionHints';
import PlotFusionGuessHistory from './PlotFusionGuessHistory';

const PlotFusionGame: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<PlotFusionGameData | null>(null);
  const [gameState, setGameState] = useState<PlotFusionGameState>({
    movie1State: PlotFusionGameService.initializeMovieState(),
    movie2State: PlotFusionGameService.initializeMovieState(),
    attempts: 0,
    gameCompleted: false,
    gameWon: false,
    showAnswers: false,
    currentTarget: null
  });
  const [cooldownTime, setCooldownTime] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleArchiveClick = () => {
    navigate('/plot-fusion/archive');
  };

  useEffect(() => {
    const gameId = searchParams.get('gameId');
    let game: PlotFusionGameData | null = null;
    
    if (gameId) {
      // Archive game
      game = getPlotFusionGameById(gameId);
    } else {
      // Today's game
      game = getTodaysPlotFusionGame();
    }
    
    if (game) {
      setGameData(game);
      
      // Only check cooldown for today's game
      if (!gameId) {
        const cooldownState = CooldownService.getCooldownState('plot-fusion');
        if (cooldownState.isOnCooldown) {
          setCooldownTime(cooldownState.remainingTime);
          startCooldownTimer();
          
          // Load game progress even during cooldown for share functionality
          const progress = PlotFusionGameService.loadGameProgress(game.id);
          setGameState(prevState => ({
            ...prevState,
            ...progress
          }));
          return;
        }
      }
      
      // Load game progress (works for both today's game and archive games)
      const progress = PlotFusionGameService.loadGameProgress(game.id);
      setGameState(prevState => ({
        ...prevState,
        ...progress
      }));
    }
  }, [searchParams]);

  const startCooldownTimer = () => {
    const cleanup = CooldownService.startCooldownTimer('plot-fusion', (cooldownState) => {
      setCooldownTime(cooldownState.remainingTime);
    });
    
    // Store cleanup function to call on component unmount
    return cleanup;
  };

  const handleFrameClick = (target: 'movie1' | 'movie2') => {
    setGameState(prev => ({ ...prev, currentTarget: target }));
  };

  const handleSubmitGuess = (guess: string) => {
    if (!gameData || gameState.gameCompleted || cooldownTime > 0) return;
    
    // Check for duplicate guess before processing
    const guessLower = guess.toLowerCase().trim();
    const allGuesses = [
      ...gameState.movie1State.guesses,
      ...gameState.movie2State.guesses
    ];
    const isDuplicateGuess = allGuesses.some(prevGuess => 
      prevGuess.toLowerCase().trim() === guessLower
    );
    
    if (isDuplicateGuess) {
      setToastMessage('Already Guessed');
      setShowToast(true);
      return;
    }
    
    const { newState, isCorrect, target } = PlotFusionGameService.processGuess(guess, gameData, gameState);
    
    // Set current target for visual feedback
    if (target) {
      newState.currentTarget = target;
      // Clear target after visual feedback
      setTimeout(() => {
        setGameState(prev => ({ ...prev, currentTarget: null }));
      }, isCorrect ? 1500 : 1000);
    }
    
    setGameState(newState);
    
    // Save progress
    const hintsUsed = newState.movie1State.hintsRevealed + newState.movie2State.hintsRevealed;
    const score = PlotFusionGameService.calculateScore(newState.attempts, newState.gameWon, hintsUsed);
    PlotFusionGameService.saveGameProgress(gameData.id, newState, newState.gameWon, score);
  };

  const generateShareData = (): PlotFusionShareData => {
    if (!gameData) {
      return {
        gameId: 'unknown',
        gameWon: false,
        totalAttempts: 0,
        maxAttempts: 10,
        movie1Found: false,
        movie2Found: false,
        movie1Attempts: 0,
        movie2Attempts: 0
      };
    }

    return {
      gameId: gameData.id,
      gameWon: gameState.gameWon,
      totalAttempts: gameState.attempts,
      maxAttempts: 10,
      movie1Found: gameState.movie1State.found,
      movie2Found: gameState.movie2State.found,
      movie1Attempts: gameState.movie1State.guesses.length,
      movie2Attempts: gameState.movie2State.guesses.length
    };
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleReplay = () => {
    if (!gameData) return;
    
    // Clear game progress from storage
    PlotFusionGameService.clearGameProgress(gameData.id);
    
    // Clear cooldown state to allow immediate replay
    GameStorageManager.clearGameCooldown('plot-fusion');
    setCooldownTime(0);
    CooldownService.clearTimer('plot-fusion');
    
    // Reset game state to initial values
    setGameState({
      movie1State: PlotFusionGameService.initializeMovieState(),
      movie2State: PlotFusionGameService.initializeMovieState(),
      attempts: 0,
      gameCompleted: false,
      gameWon: false,
      showAnswers: false,
      currentTarget: null
    });
    
    // Close share modal if open
    setShowShareModal(false);
  };

  if (cooldownTime > 0) {
    return (
      <>
        <PlotFusionCooldownView
          formattedTime={CooldownService.getCooldownState('plot-fusion').formattedTime}
          onShare={handleShare}
          onReplay={handleReplay}
        />
        
        {/* Share Modal for cooldown view */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareText={generatePlotFusionShareText(generateShareData())}
          gameTitle="Plot Fusion Result"
        />
      </>
    );
  }

  if (!gameData) {
    return (
      <GameLayout title="Plot Fusion">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p>Loading today's Plot Fusion challenge...</p>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title={gameData.title}>
      {/* Archive Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleArchiveClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Archive
        </button>
      </div>

      {/* Game Completed Section */}
      {gameState.gameCompleted && (
        <div className="text-center">
          <div className={`p-6 rounded-lg ${gameState.gameWon ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className={`text-2xl font-bold mb-4 ${gameState.gameWon ? 'text-green-800' : 'text-red-800'}`}>
              {gameState.gameWon ? '🎉 Congratulations!' : '😔 Game Over'}
            </h3>
          </div>
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Fused Plot Display */}
        <div className="mb-8">
          <blockquote className="text-2xl font-serif font-medium leading-relaxed text-gray-800 border-l-4 border-blue-500 pl-6 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-r-lg shadow-sm">
            <span className="text-blue-600 text-3xl leading-none">"</span>
            {gameData.fusedPlot}
            <span className="text-blue-600 text-3xl leading-none">"</span>
          </blockquote>
        </div>

        {/* Movie Frames */}
        <div className="flex justify-center items-center gap-96 mb-8">
          {/* Movie 1 Frame */}
          <PlotFusionMovieFrame
            movieKey="movie1"
            gameData={gameData}
            movieState={gameState.movie1State}
            isSelected={gameState.currentTarget === 'movie1'}
            showAnswers={gameState.showAnswers}
            onFrameClick={handleFrameClick}
          />
          
          {/* Movie 2 Frame */}
          <PlotFusionMovieFrame
            movieKey="movie2"
            gameData={gameData}
            movieState={gameState.movie2State}
            isSelected={gameState.currentTarget === 'movie2'}
            showAnswers={gameState.showAnswers}
            onFrameClick={handleFrameClick}
          />
        </div>

        {/* Hints Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-start-1">
            <PlotFusionHints
              movieKey="movie1"
              gameData={gameData}
              movieState={gameState.movie1State}
              showAnswers={gameState.showAnswers}
            />
          </div>
          <div className="md:col-start-2">
            <PlotFusionHints
              movieKey="movie2"
              gameData={gameData}
              movieState={gameState.movie2State}
              showAnswers={gameState.showAnswers}
            />
          </div>
        </div>

        {/* Controls Section */}
        <PlotFusionControls
          gameCompleted={gameState.gameCompleted}
          onSubmitGuess={handleSubmitGuess}
          onShare={handleShare}
          onReplay={handleReplay}
        />

        {/* Guess History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <PlotFusionGuessHistory
            movieKey="movie1"
            gameData={gameData}
            movieState={gameState.movie1State}
          />
          <PlotFusionGuessHistory
            movieKey="movie2"
            gameData={gameData}
            movieState={gameState.movie2State}
          />
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareText={generatePlotFusionShareText(generateShareData())}
        gameTitle="Plot Fusion Result"
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        type="info"
        duration={2500}
      />
    </GameLayout>
  );
};

export default PlotFusionGame;
