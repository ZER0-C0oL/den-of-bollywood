import React, { useState, useEffect } from 'react';
import GameLayout from '../components/GameLayout';
import ShareModal from '../components/ShareModal';
import { FaceMashGameData, FaceMashHint } from '../types/gameTypes';
import { getTodaysFaceMashGame } from '../data/faceMashData';
import { getActorSuggestions } from '../data/actorsData';
import { GameStorageManager, formatTimeRemaining } from '../utils/gameStorage';
import { generateFaceMashShareText, FaceMashShareData } from '../utils/shareUtils';
import { GAME_CONFIG } from '../constants/gameConfig';

// Interface for tracking guesses and hints per actor
interface ActorState {
  found: boolean;
  guesses: string[];
  hintsRevealed: number;
}

const FaceMashGame: React.FC = () => {
  const [gameData, setGameData] = useState<FaceMashGameData | null>(null);
  const [actorGuess, setActorGuess] = useState('');
  const [actorSuggestions, setActorSuggestions] = useState<any[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<'actor1' | 'actor2' | null>(null);
  
  // New state for improved actor tracking
  const [actor1State, setActor1State] = useState<ActorState>({
    found: false,
    guesses: [],
    hintsRevealed: 0
  });
  const [actor2State, setActor2State] = useState<ActorState>({
    found: false,
    guesses: [],
    hintsRevealed: 0
  });
  
  // Share feature state
  const [showShareModal, setShowShareModal] = useState(false);

  // Helper function to get ordered hints (Gender, Birthdate, Movies, Initials)
  const getOrderedHints = (hints: FaceMashHint[]): FaceMashHint[] => {
    const order = ['gender', 'birth_date', 'famous_movies', 'initials'];
    return order.map(type => hints.find(hint => hint.type === type)).filter(Boolean) as FaceMashHint[];
  };

  // Helper function to determine target based on gender and current target
  const determineTarget = (guess: string): 'actor1' | 'actor2' | null => {
    if (!gameData) return null;
    
    // If user clicked on a frame, use that target
    if (currentTarget) return currentTarget;
    
    // If one actor is already found, target the other one
    if (actor1State.found && !actor2State.found) {
      return 'actor2';
    } else if (!actor1State.found && actor2State.found) {
      return 'actor1';
    }
    
    // Auto-target based on gender differences (only if both actors are not found yet)
    if (!actor1State.found && !actor2State.found) {
      const actor1Gender = gameData.actor1.hints.find(h => h.type === 'gender')?.content.toLowerCase();
      const actor2Gender = gameData.actor2.hints.find(h => h.type === 'gender')?.content.toLowerCase();
      
      if (actor1Gender !== actor2Gender) {
        // Different genders - find the guessed actor's gender from bollywoodActors data
        const guessLower = guess.toLowerCase().trim();
        const foundActor = getActorSuggestions(guess, 1)[0]; // Get the best match
        
        if (foundActor && foundActor.name.toLowerCase() === guessLower) {
          // Exact match found - use the actor's gender
          if (foundActor.gender === 'male' && actor1Gender === 'male') return 'actor1';
          if (foundActor.gender === 'male' && actor2Gender === 'male') return 'actor2';
          if (foundActor.gender === 'female' && actor1Gender === 'female') return 'actor1';
          if (foundActor.gender === 'female' && actor2Gender === 'female') return 'actor2';
        }
      }
      
      // Default: target the one with fewer hints revealed
      return actor1State.hintsRevealed <= actor2State.hintsRevealed ? 'actor1' : 'actor2';
    }
    
    return null;
  };

  useEffect(() => {
    const game = getTodaysFaceMashGame();
    if (game) {
      setGameData(game);
      
      // Check if game is on cooldown
      if (GameStorageManager.isGameOnCooldown('face-mash')) {
        setCooldownTime(GameStorageManager.getRemainingCooldownTime('face-mash'));
        startCooldownTimer();
      } else {
        // Load game progress
        const progress = GameStorageManager.getGameProgress(game.id);
        if (progress) {
          setAttempts(progress.attempts);
          setGameCompleted(progress.completed);
          if (progress.completed) {
            setShowAnswers(true);
          }
          // Restore actor states from progress
          if (progress.gameState?.actor1State) {
            setActor1State(progress.gameState.actor1State);
          }
          if (progress.gameState?.actor2State) {
            setActor2State(progress.gameState.actor2State);
          }
        }
      }
    }
  }, []);

  const startCooldownTimer = () => {
    const timer = setInterval(() => {
      const remaining = GameStorageManager.getRemainingCooldownTime('face-mash');
      setCooldownTime(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  };

  const handleInputChange = (value: string) => {
    setActorGuess(value);
    const suggestions = getActorSuggestions(value);
    setActorSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0 && value.length > 0);
  };

  const selectActorSuggestion = (actorName: string) => {
    setActorGuess(actorName);
    setShowSuggestions(false);
  };

  const handleFrameClick = (target: 'actor1' | 'actor2') => {
    setCurrentTarget(target);
  };

  const revealNextHint = (target: 'actor1' | 'actor2') => {
    const targetState = target === 'actor1' ? actor1State : actor2State;
    const setTargetState = target === 'actor1' ? setActor1State : setActor2State;
    const targetHints = target === 'actor1' ? getOrderedHints(gameData!.actor1.hints) : getOrderedHints(gameData!.actor2.hints);
    
    if (targetState.hintsRevealed < targetHints.length) {
      setTargetState(prev => ({
        ...prev,
        hintsRevealed: prev.hintsRevealed + 1
      }));
    }
  };

  const handleSubmit = () => {
    if (!actorGuess.trim() || gameCompleted || cooldownTime > 0) return;
    
    const guessLower = actorGuess.toLowerCase().trim();
    const actor1Correct = guessLower === gameData!.actor1.name.toLowerCase();
    const actor2Correct = guessLower === gameData!.actor2.name.toLowerCase();
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (actor1Correct || actor2Correct) {
      // Correct guess
      const correctTarget = actor1Correct ? 'actor1' : 'actor2';
      const setTargetState = correctTarget === 'actor1' ? setActor1State : setActor2State;
      const targetHints = correctTarget === 'actor1' ? getOrderedHints(gameData!.actor1.hints) : getOrderedHints(gameData!.actor2.hints);
      
      // Temporarily highlight the correct target frame
      setCurrentTarget(correctTarget);
      setTimeout(() => setCurrentTarget(null), 1500); // Clear highlight after 1.5 seconds
      
      setTargetState(prev => ({
        ...prev,
        found: true,
        guesses: [...prev.guesses, actorGuess],
        hintsRevealed: targetHints.length // Show all hints when actor is found
      }));
      
      // Check if both actors found
      const bothFound = (correctTarget === 'actor1' ? true : actor1State.found) && 
                      (correctTarget === 'actor2' ? true : actor2State.found);
      
      if (bothFound) {
        setGameCompleted(true);
        setGameWon(true);
        setShowAnswers(true);
        GameStorageManager.updateLastPlayed('face-mash');
        GameStorageManager.updateUserStats('face-mash', true, newAttempts, 100 - (newAttempts * 15));
        GameStorageManager.saveGameProgress(gameData!.id, {
          gameId: gameData!.id,
          status: 'completed',
          attempts: newAttempts,
          hintsUsed: actor1State.hintsRevealed + actor2State.hintsRevealed,
          startTime: Date.now() - (newAttempts * 60000),
          endTime: Date.now(),
          score: 100 - (newAttempts * 15),
          completed: true,
          gameState: {
            actor1State: correctTarget === 'actor1' ? { found: true, guesses: [...actor1State.guesses, actorGuess], hintsRevealed: targetHints.length } : actor1State,
            actor2State: correctTarget === 'actor2' ? { found: true, guesses: [...actor2State.guesses, actorGuess], hintsRevealed: targetHints.length } : actor2State
          }
        });
      }
    } else {
      // Wrong guess - determine target and add to their guesses
      const target = determineTarget(actorGuess);
      if (target) {
        const targetState = target === 'actor1' ? actor1State : actor2State;
        const setTargetState = target === 'actor1' ? setActor1State : setActor2State;
        
        // Temporarily highlight the target frame
        setCurrentTarget(target);
        setTimeout(() => setCurrentTarget(null), 1000); // Clear highlight after 1 second
        
        setTargetState(prev => ({
          ...prev,
          guesses: [...prev.guesses, actorGuess]
        }));
        
        // Reveal hint for the target
        revealNextHint(target);
        
        // Save progress after each attempt
        GameStorageManager.saveGameProgress(gameData!.id, {
          gameId: gameData!.id,
          status: 'in_progress',
          attempts: newAttempts,
          hintsUsed: actor1State.hintsRevealed + actor2State.hintsRevealed,
          startTime: Date.now() - (newAttempts * 60000),
          completed: false,
          gameState: {
            actor1State: target === 'actor1' ? { ...actor1State, guesses: [...actor1State.guesses, actorGuess] } : actor1State,
            actor2State: target === 'actor2' ? { ...actor2State, guesses: [...actor2State.guesses, actorGuess] } : actor2State
          }
        });
        
        // Check if this actor has reached 5 wrong attempts
        if (targetState.guesses.length + 1 >= 5) {
          // Check if both actors have reached max attempts or are found
          const actor1Done = actor1State.found || (target === 'actor1' ? targetState.guesses.length + 1 >= 5 : actor1State.guesses.length >= 5);
          const actor2Done = actor2State.found || (target === 'actor2' ? targetState.guesses.length + 1 >= 5 : actor2State.guesses.length >= 5);
          
          if (actor1Done && actor2Done) {
            // Game over
            setGameCompleted(true);
            setShowAnswers(true);
            GameStorageManager.updateLastPlayed('face-mash');
            GameStorageManager.updateUserStats('face-mash', false, newAttempts);
            GameStorageManager.saveGameProgress(gameData!.id, {
              gameId: gameData!.id,
              status: 'completed',
              attempts: newAttempts,
              hintsUsed: actor1State.hintsRevealed + actor2State.hintsRevealed,
              startTime: Date.now() - (newAttempts * 60000),
              endTime: Date.now(),
              completed: false,
              gameState: {
                actor1State: actor1State,
                actor2State: actor2State
              }
            });
          }
        }
      }
    }
    
    setActorGuess('');
    // Don't reset currentTarget here - let the timeout handle it for visual feedback
  };

  const generateShareData = (): FaceMashShareData => {
    return {
      gameId: gameData!.id,
      gameWon: gameWon,
      totalAttempts: attempts,
      maxAttempts: GAME_CONFIG.MAX_ATTEMPTS,
      actor1Found: actor1State.found,
      actor2Found: actor2State.found,
      actor1Attempts: actor1State.guesses.length,
      actor2Attempts: actor2State.guesses.length
    };
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const renderActorFrame = (actorKey: 'actor1' | 'actor2') => {
    if (!gameData) return null;
    
    const actor = actorKey === 'actor1' ? gameData.actor1 : gameData.actor2;
    const state = actorKey === 'actor1' ? actor1State : actor2State;
    const isSelected = currentTarget === actorKey;
    
    return (
      <div 
        className={`relative cursor-pointer transition-all duration-300 ${
          isSelected ? 'ring-4 ring-blue-500' : ''
        }`}
        onClick={() => handleFrameClick(actorKey)}
      >
        <div className="w-48 h-64 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
          {state.found || showAnswers ? (
            <img 
              src={actor.image} 
              alt={actor.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-300 relative">
              <svg className="w-20 h-20 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <div className="absolute bottom-4 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">?</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Actor name (shown when found or game completed) */}
        {(state.found || showAnswers) && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-center">
            <p className="font-semibold">{actor.name}</p>
          </div>
        )}
        
        {/* Target indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
            ✓
          </div>
        )}
      </div>
    );
  };

  const renderHints = (actorKey: 'actor1' | 'actor2') => {
    if (!gameData) return null;
    
    const actor = actorKey === 'actor1' ? gameData.actor1 : gameData.actor2;
    const state = actorKey === 'actor1' ? actor1State : actor2State;
    const orderedHints = getOrderedHints(actor.hints);
    
    if (state.hintsRevealed === 0) return null;
    
    const isLeftActor = actorKey === 'actor1';
    
    return (
      <div className={`bg-gray-50 p-4 rounded-lg ${isLeftActor ? 'text-left' : 'text-right'}`}>
        <ul className="space-y-1">
          {orderedHints.slice(0, state.hintsRevealed).map((hint, index) => (
            <li key={index} className="text-sm">
              <span className="font-medium capitalize">{hint.type.replace('_', ' ')}:</span> {hint.content}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderGuessHistory = (actorKey: 'actor1' | 'actor2') => {
    const state = actorKey === 'actor1' ? actor1State : actor2State;
    const actor = actorKey === 'actor1' ? gameData!.actor1 : gameData!.actor2;
    
    if (state.guesses.length === 0) return null;
    
    const isLeftActor = actorKey === 'actor1';
    
    return (
      <div className={'bg-gray-50 p-3 rounded-lg ' + (isLeftActor ? 'text-left' : 'text-right')}>
        <h5 className="font-medium text-gray-800 mb-2">
          Your Guesses:
        </h5>
        <div className="flex flex-wrap gap-1">
          {state.guesses.map((guess, index) => {
            const isCorrect = guess.toLowerCase() === actor.name.toLowerCase();
            return (
              <span 
                key={index}
                className={`px-2 py-1 rounded text-xs ${
                  isCorrect 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {guess}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  if (cooldownTime > 0) {
    // Check if game was completed to show progress
    const todaysGame = getTodaysFaceMashGame();
    const gameProgress = todaysGame ? GameStorageManager.getGameProgress(todaysGame.id) : null;
    
    return (
      <GameLayout title="Face Mash">
        {/* Countdown Header */}
        <div className="bg-bollywood-teal text-white p-4 rounded-lg mb-6 text-center">
          <h2 className="text-xl font-bold">Next Challenge in: {formatTimeRemaining(cooldownTime)} </h2>
        </div>

        {/* Show game state based on progress */}
        {gameProgress && todaysGame ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-center mb-6">
              {gameProgress.completed && (
                (gameProgress.gameState?.actor1State?.found && gameProgress.gameState?.actor2State?.found) ? (
                  <>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      🎉 Challenge Completed!
                    </h3>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-red-800 mb-2">
                      😔 Challenge Not Solved
                    </h3>
                  </>
                )
              ) }
            </div>

            {/* Show the game state */}
            <div className="flex justify-center items-center gap-8 mb-6">
              {/* Left Actor */}
              <div className="relative">
                <div className="w-48 h-64 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  {(gameProgress.gameState?.actor1State?.found || gameProgress.completed) ? (
                    <img 
                      src={todaysGame.actor1.image} 
                      alt={todaysGame.actor1.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-300 relative">
                      <svg className="w-20 h-20 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <div className="absolute bottom-4 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">?</span>
                      </div>
                    </div>
                  )}
                </div>
                {(gameProgress.gameState?.actor1State?.found || gameProgress.completed) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-center">
                    <p className="font-semibold">{todaysGame.actor1.name}</p>
                  </div>
                )}
              </div>
              
              {/* Mashed Image */}
              <div className="flex-shrink-0">
                <img 
                  src={todaysGame.mashedImage} 
                  alt="Mashed face"
                  className="w-64 h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
              
              {/* Right Actor */}
              <div className="relative">
                <div className="w-48 h-64 bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                  {(gameProgress.gameState?.actor2State?.found || gameProgress.completed) ? (
                    <img 
                      src={todaysGame.actor2.image} 
                      alt={todaysGame.actor2.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-300 relative">
                      <svg className="w-20 h-20 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <div className="absolute bottom-4 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">?</span>
                      </div>
                    </div>
                  )}
                </div>
                {(gameProgress.gameState?.actor2State?.found || gameProgress.completed) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-center">
                    <p className="font-semibold">{todaysGame.actor2.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Show guesses if available */}
            {(gameProgress.gameState?.actor1State?.guesses?.length || gameProgress.gameState?.actor2State?.guesses?.length) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Actor 1 Guesses */}
                {gameProgress.gameState?.actor1State?.guesses?.length && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">Guesses:</h5>
                    <div className="flex flex-wrap gap-1">
                      {gameProgress.gameState.actor1State.guesses.map((guess, index) => {
                        const isCorrect = guess.toLowerCase() === todaysGame.actor1.name.toLowerCase();
                        return (
                          <span 
                            key={index}
                            className={`px-2 py-1 rounded text-xs ${
                              isCorrect 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-red-200 text-red-800'
                            }`}
                          >
                            {guess}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Actor 2 Guesses */}
                {gameProgress.gameState?.actor2State?.guesses?.length && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">Guesses:</h5>
                    <div className="flex flex-wrap gap-1">
                      {gameProgress.gameState.actor2State.guesses.map((guess, index) => {
                        const isCorrect = guess.toLowerCase() === todaysGame.actor2.name.toLowerCase();
                        return (
                          <span 
                            key={index}
                            className={`px-2 py-1 rounded text-xs ${
                              isCorrect 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-red-200 text-red-800'
                            }`}
                          >
                            {guess}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Share button for completed games */}
            {gameProgress.completed && (
              <div className="text-center">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="bg-bollywood-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500"
                >
                  📤 Share Result
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Game is on cooldown</h2>
            <p className="text-gray-600">
              Come back later for the next Face Mash challenge!
            </p>
          </div>
        )}
      </GameLayout>
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
        {gameCompleted && (
          <div className="text-center">
            <div className={`p-6 rounded-lg ${gameWon ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className={`text-2xl font-bold mb-4 ${gameWon ? 'text-green-800' : 'text-red-800'}`}>
                {gameWon ? '🎉 Congratulations!' : '😔 Game Over'}
              </h3>
            </div>
          </div>
        )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Main Game Area */}
        <div className="flex justify-center items-center gap-8 mb-8">
          {/* Left Actor Frame */}
          {renderActorFrame('actor1')}
          
          {/* Mashed Image */}
          <div className="flex-shrink-0">
            <img 
              src={gameData.mashedImage} 
              alt="Mashed face"
              className="w-64 h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {/* Right Actor Frame */}
          {renderActorFrame('actor2')}
        </div>

        {/* Hints Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-start-1">
            {renderHints('actor1')}
          </div>
          <div className="md:col-start-2">
            {renderHints('actor2')}
          </div>
        </div>

        {/* Guess History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {renderGuessHistory('actor1')}
          {renderGuessHistory('actor2')}
        </div>

        {/* Input Section */}
        {!gameCompleted && (
          <div className="relative mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={actorGuess}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Guess an actor's name..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bollywood-teal focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button
                onClick={handleSubmit}
                disabled={!actorGuess.trim()}
                className="bg-bollywood-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guess
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && actorSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-12 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
                {actorSuggestions.slice(0, 5).map((actor, index) => (
                  <button
                    key={index}
                    onClick={() => selectActorSuggestion(actor.name)}
                    className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    {actor.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {gameCompleted && (
          <div className="flex justify-center gap-4">
            <button
              onClick={handleShare}
              className="bg-bollywood-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500"
            >
              📤 Share Result
            </button>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {(gameCompleted || cooldownTime > 0) && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareText={generateFaceMashShareText(generateShareData())}
          gameTitle="Face Mash Result"
        />
      )}
    </GameLayout>
  );
};

export default FaceMashGame;
