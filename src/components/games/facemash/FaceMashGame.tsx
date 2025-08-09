import React, { useState, useEffect } from 'react';
import GameLayout from '../../GameLayout';
import ShareModal from '../../ShareModal';
import FaceMashActorFrame from './FaceMashActorFrame';
import FaceMashImage from './FaceMashImage';
import FaceMashHints from './FaceMashHints';
import FaceMashGuessHistory from './FaceMashGuessHistory';
import FaceMashControls from './FaceMashControls';
import FaceMashCooldownView from './FaceMashCooldownView';
import { FaceMashGameService, FaceMashGameState } from './FaceMashGameService';
import { FaceMashGameData } from '../../../types/gameTypes';
import { getTodaysFaceMashGame } from '../../../data/faceMashData';
import { generateFaceMashShareText, FaceMashShareData } from '../../../utils/shareUtils';
import { CooldownService } from '../../../services/cooldownService';
import { GameStorageManager } from '../../../utils/gameStorage';

const FaceMashGame: React.FC = () => {
  const [gameData, setGameData] = useState<FaceMashGameData | null>(null);
  const [gameState, setGameState] = useState<FaceMashGameState>({
    actor1State: FaceMashGameService.initializeActorState(),
    actor2State: FaceMashGameService.initializeActorState(),
    attempts: 0,
    gameCompleted: false,
    gameWon: false,
    showAnswers: false,
    currentTarget: null
  });
  const [cooldownTime, setCooldownTime] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const game = getTodaysFaceMashGame();
    if (game) {
      setGameData(game);
      
      // Check if game is on cooldown
      const cooldownState = CooldownService.getCooldownState('face-mash');
      if (cooldownState.isOnCooldown) {
        setCooldownTime(cooldownState.remainingTime);
        startCooldownTimer();
        
        // Load game progress even during cooldown for share functionality
        const progress = FaceMashGameService.loadGameProgress(game.id);
        setGameState(prevState => ({
          ...prevState,
          ...progress
        }));
      } else {
        // Load game progress
        const progress = FaceMashGameService.loadGameProgress(game.id);
        setGameState(prevState => ({
          ...prevState,
          ...progress
        }));
      }
    }
  }, []);

  const startCooldownTimer = () => {
    const cleanup = CooldownService.startCooldownTimer('face-mash', (cooldownState) => {
      setCooldownTime(cooldownState.remainingTime);
    });
    
    // Store cleanup function to call on component unmount
    return cleanup;
  };

  const handleFrameClick = (target: 'actor1' | 'actor2') => {
    setGameState(prev => ({ ...prev, currentTarget: target }));
  };

  const handleSubmitGuess = (guess: string) => {
    if (!gameData || gameState.gameCompleted || cooldownTime > 0) return;
    
    // Check for duplicate guess before processing
    const guessLower = guess.toLowerCase().trim();
    const allGuesses = [
      ...gameState.actor1State.guesses,
      ...gameState.actor2State.guesses
    ];
    const isDuplicateGuess = allGuesses.some(prevGuess => 
      prevGuess.toLowerCase().trim() === guessLower
    );
    
    if (isDuplicateGuess) {
      // Could add toast notification or visual feedback here
      console.log('Duplicate guess detected:', guess);
      return;
    }
    
    const { newState, isCorrect, target } = FaceMashGameService.processGuess(guess, gameData, gameState);
    
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
    const hintsUsed = newState.actor1State.hintsRevealed + newState.actor2State.hintsRevealed;
    const score = FaceMashGameService.calculateScore(newState.attempts, newState.gameWon, hintsUsed);
    FaceMashGameService.saveGameProgress(gameData.id, newState, newState.gameWon, score);
  };

  const generateShareData = (): FaceMashShareData => {
    if (!gameData) {
      // Fallback data if gameData is not available
      return {
        gameId: 'unknown',
        gameWon: false,
        totalAttempts: 0,
        maxAttempts: 10,
        actor1Found: false,
        actor2Found: false,
        actor1Attempts: 0,
        actor2Attempts: 0
      };
    }

    return {
      gameId: gameData.id,
      gameWon: gameState.gameWon,
      totalAttempts: gameState.attempts,
      maxAttempts: 10, // This should come from GAME_CONFIG.MAX_ATTEMPTS
      actor1Found: gameState.actor1State.found,
      actor2Found: gameState.actor2State.found,
      actor1Attempts: gameState.actor1State.guesses.length,
      actor2Attempts: gameState.actor2State.guesses.length
    };
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleReplay = () => {
    if (!gameData) return;
    
    // Clear game progress from storage
    FaceMashGameService.clearGameProgress(gameData.id);
    
    // Clear cooldown state to allow immediate replay
    GameStorageManager.clearGameCooldown('face-mash');
    setCooldownTime(0);
    CooldownService.clearTimer('face-mash');
    
    // Reset game state to initial values
    setGameState({
      actor1State: FaceMashGameService.initializeActorState(),
      actor2State: FaceMashGameService.initializeActorState(),
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
        <FaceMashCooldownView
          formattedTime={CooldownService.getCooldownState('face-mash').formattedTime}
          onShare={handleShare}
          onReplay={handleReplay}
        />
        
        {/* Share Modal for cooldown view */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareText={generateFaceMashShareText(generateShareData())}
          gameTitle="Face Mash Result"
        />
      </>
    );
  }

  if (!gameData) {
    return (
      <GameLayout title="Face Mash">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p>Loading today's Face Mash challenge...</p>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title={gameData.title}>
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
        {/* Main Game Area */}
        <div className="flex justify-center items-center gap-8 mb-8">
          {/* Left Actor Frame */}
          <FaceMashActorFrame
            actorKey="actor1"
            gameData={gameData}
            actorState={gameState.actor1State}
            isSelected={gameState.currentTarget === 'actor1'}
            showAnswers={gameState.showAnswers}
            onFrameClick={handleFrameClick}
          />
          
          {/* Mashed Image */}
          <FaceMashImage src={gameData.mashedImage} />
          
          {/* Right Actor Frame */}
          <FaceMashActorFrame
            actorKey="actor2"
            gameData={gameData}
            actorState={gameState.actor2State}
            isSelected={gameState.currentTarget === 'actor2'}
            showAnswers={gameState.showAnswers}
            onFrameClick={handleFrameClick}
          />
        </div>

        {/* Hints Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-start-1">
            <FaceMashHints
              actorKey="actor1"
              gameData={gameData}
              actorState={gameState.actor1State}
            />
          </div>
          <div className="md:col-start-2">
            <FaceMashHints
              actorKey="actor2"
              gameData={gameData}
              actorState={gameState.actor2State}
            />
          </div>
        </div>

        {/* Guess History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FaceMashGuessHistory
            actorKey="actor1"
            gameData={gameData}
            actorState={gameState.actor1State}
          />
          <FaceMashGuessHistory
            actorKey="actor2"
            gameData={gameData}
            actorState={gameState.actor2State}
          />
        </div>

        {/* Controls Section */}
        <FaceMashControls
          gameCompleted={gameState.gameCompleted}
          onSubmitGuess={handleSubmitGuess}
          onShare={handleShare}
          onReplay={handleReplay}
        />
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareText={generateFaceMashShareText(generateShareData())}
        gameTitle="Face Mash Result"
      />
    </GameLayout>
  );
};

export default FaceMashGame;
