import React, { useState, useEffect } from 'react';
import GameLayout from '../components/GameLayout';
import { FaceMashGameData } from '../types/gameTypes';
import { getTodaysFaceMashGame } from '../data/faceMashData';
import { getActorSuggestions } from '../data/actorsData';
import { GameStorageManager, formatTimeRemaining } from '../utils/gameStorage';
import { GAME_CONFIG } from '../constants/gameConfig';

const FaceMashGame: React.FC = () => {
  const [gameData, setGameData] = useState<FaceMashGameData | null>(null);
  const [actorGuess, setActorGuess] = useState('');
  const [actorSuggestions, setActorSuggestions] = useState<any[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [revealedHints, setRevealedHints] = useState<any[]>([]);
  const [allHintsShuffled, setAllHintsShuffled] = useState<any[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [correctActors, setCorrectActors] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    const game = getTodaysFaceMashGame();
    if (game) {
      setGameData(game);
      
      // Initialize shuffled hints array once
      const allHints = [
        ...game.actor1.hints.map(hint => ({ ...hint, actor: game.actor1.name })),
        ...game.actor2.hints.map(hint => ({ ...hint, actor: game.actor2.name }))
      ];
      const shuffledHints = allHints.sort(() => Math.random() - 0.5);
      setAllHintsShuffled(shuffledHints);
      
      // Don't auto-generate morphed faces - let user enable it manually
      
      // Check if game is on cooldown
      if (GameStorageManager.isGameOnCooldown('face-mash')) {
        setCooldownTime(GameStorageManager.getRemainingCooldownTime('face-mash'));
        startCooldownTimer();
      } else {
        // Load game progress
        const progress = GameStorageManager.getGameProgress(game.id);
        if (progress) {
          setAttempts(progress.attempts);
          setHintsRevealed(progress.hintsUsed);
          // Load previously revealed hints
          const hintsToShow = shuffledHints.slice(0, progress.hintsUsed);
          setRevealedHints(hintsToShow);
          setGameCompleted(progress.completed);
          if (progress.completed) {
            setShowAnswers(true);
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

  const handleSubmit = () => {
    if (!actorGuess.trim() || gameCompleted || cooldownTime > 0) return;
    
    const guessLower = actorGuess.toLowerCase().trim();
    const actor1Correct = guessLower === gameData!.actor1.name.toLowerCase();
    const actor2Correct = guessLower === gameData!.actor2.name.toLowerCase();
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (actor1Correct || actor2Correct) {
      // Correct guess - add to found actors
      const foundActor = actor1Correct ? gameData!.actor1.name : gameData!.actor2.name;
      const newCorrectActors = [...correctActors, foundActor];
      setCorrectActors(newCorrectActors);
      setActorGuess('');
      
      if (newCorrectActors.length === 2) {
        // Both actors found - game won
        setGameCompleted(true);
        setGameWon(true);
        setShowAnswers(true);
        GameStorageManager.updateLastPlayed('face-mash');
        GameStorageManager.updateUserStats('face-mash', true, newAttempts, 100 - (newAttempts * 15));
        GameStorageManager.saveGameProgress(gameData!.id, {
          gameId: gameData!.id,
          status: 'completed',
          attempts: newAttempts,
          hintsUsed: hintsRevealed,
          startTime: Date.now() - (newAttempts * 60000),
          endTime: Date.now(),
          score: 100 - (newAttempts * 15),
          completed: true
        });
      }
    } else {
      // Wrong answer - reveal hint if available
      if (hintsRevealed < GAME_CONFIG.MAX_HINTS && hintsRevealed < allHintsShuffled.length) {
        const nextHint = allHintsShuffled[hintsRevealed];
        setRevealedHints(prev => [...prev, nextHint]);
        setHintsRevealed(hintsRevealed + 1);
      }
      
      if (newAttempts >= GAME_CONFIG.MAX_ATTEMPTS) {
        // Game over - reveal answers
        setGameCompleted(true);
        setShowAnswers(true);
        GameStorageManager.updateLastPlayed('face-mash');
        GameStorageManager.updateUserStats('face-mash', false, newAttempts);
        GameStorageManager.saveGameProgress(gameData!.id, {
          gameId: gameData!.id,
          status: 'completed',
          attempts: newAttempts,
          hintsUsed: hintsRevealed,
          startTime: Date.now() - (newAttempts * 60000),
          endTime: Date.now(),
          completed: false
        });
      }
    }
    
    setActorGuess('');
  };

  const renderHints = () => {
    if (revealedHints.length === 0) return null;
    
    // Filter out hints from actors that have already been correctly guessed
    const hintsToShow = revealedHints.filter(hint => !correctActors.includes(hint.actor));
    
    if (hintsToShow.length === 0) return null;
    
    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-blue-800 mb-3">Hints:</h4>
        <div className="space-y-2">
          {hintsToShow.map((hint, index) => (
            <p key={index} className="text-blue-700 text-sm">
              <span className="font-medium">{hint.type.replace('_', ' ').toUpperCase()}:</span> {hint.content}
            </p>
          ))}
        </div>
      </div>
    );
  };

  const renderSuggestions = () => {
    if (!showSuggestions || actorSuggestions.length === 0) return null;
    
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-lg shadow-lg z-10 max-h-40 overflow-y-auto">
        {actorSuggestions.map((actor, index) => (
          <button
            key={actor.id}
            onClick={() => selectActorSuggestion(actor.name)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm"
          >
            {actor.name}
          </button>
        ))}
      </div>
    );
  };

  const renderActorPhotos = () => {
    if (!showAnswers || !gameData) return null;
    
    return (
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="text-center">
          <img 
            src={gameData.actor1.image} 
            alt={gameData.actor1.name}
            className="w-48 h-48 mx-auto object-cover rounded-lg mb-2 border-2 border-gray-300"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="bg-gray-200 w-48 h-48 mx-auto rounded-lg flex items-center justify-center mb-2 hidden">
            <span className="text-gray-500 text-sm">Actor 1 Photo</span>
          </div>
          <p className="font-semibold text-lg">{gameData.actor1.name}</p>
          {correctActors.includes(gameData.actor1.name) && (
            <span className="text-green-600 text-sm">✓ Guessed correctly!</span>
          )}
          
          {/* Show all hints for Actor 1 if guessed correctly */}
          {correctActors.includes(gameData.actor1.name) && (
            <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-lg text-left">
              <h4 className="font-semibold text-green-800 mb-2 text-center">Hints:</h4>
              <div className="space-y-1">
                {gameData.actor1.hints.map((hint, index) => (
                  <p key={index} className="text-green-700 text-xs">
                    <span className="font-medium">{hint.type.replace('_', ' ').toUpperCase()}:</span> {hint.content}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <img 
            src={gameData.actor2.image} 
            alt={gameData.actor2.name}
            className="w-48 h-48 mx-auto object-cover rounded-lg mb-2 border-2 border-gray-300"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="bg-gray-200 w-48 h-48 mx-auto rounded-lg flex items-center justify-center mb-2 hidden">
            <span className="text-gray-500 text-sm">Actor 2 Photo</span>
          </div>
          <p className="font-semibold text-lg">{gameData.actor2.name}</p>
          {correctActors.includes(gameData.actor2.name) && (
            <span className="text-green-600 text-sm">✓ Guessed correctly!</span>
          )}
          
          {/* Show all hints for Actor 2 if guessed correctly */}
          {correctActors.includes(gameData.actor2.name) && (
            <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded-lg text-left">
              <h4 className="font-semibold text-green-800 mb-2 text-center">Hints:</h4>
              <div className="space-y-1">
                {gameData.actor2.hints.map((hint, index) => (
                  <p key={index} className="text-green-700 text-xs">
                    <span className="font-medium">{hint.type.replace('_', ' ').toUpperCase()}:</span> {hint.content}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!gameData) {
    return (
      <GameLayout title="Face Mash" description="Loading game...">
        <div className="text-center py-8">Loading...</div>
      </GameLayout>
    );
  }

  if (cooldownTime > 0) {
    return (
      <GameLayout title="Face Mash" description="Guess both actors from the merged face">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Game on Cooldown</h2>
          <p className="text-gray-600 mb-4">
            You can play again in: <span className="font-bold text-bollywood-red">
              {formatTimeRemaining(cooldownTime)}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Each game can be played once every 12 hours.
          </p>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Face Mash" description="Guess the actors from the merged face">
      <div className="max-w-4xl mx-auto">
        {/* Game Status */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Attempts: {attempts}/{GAME_CONFIG.MAX_ATTEMPTS}
          </div>
          <div className="text-sm text-gray-600">
            Actors found: {correctActors.length}/2
          </div>
          <div className="text-sm text-gray-600">
            Hints revealed: {hintsRevealed}/{GAME_CONFIG.MAX_HINTS}
          </div>
        </div>

        {/* Game Completed Message */}
        {gameCompleted && (
          <div className={`${gameWon ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded mb-4`}>
            {gameWon 
              ? `Congratulations! You found both actors in ${attempts} attempts!` 
              : `Game Over! The actors were: ${gameData.actor1.name} and ${gameData.actor2.name}`}
          </div>
        )}

        {/* Correct Actors Display */}
        {correctActors.length > 0 && !showAnswers && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-green-800 mb-4">Correct Answers Found:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {correctActors.map((actorName, index) => {
                const isActor1 = actorName === gameData.actor1.name;
                const actor = isActor1 ? gameData.actor1 : gameData.actor2;
                
                return (
                  <div key={index} className="bg-white p-3 rounded-lg border border-green-300">
                    <div className="text-center mb-3">
                      <h4 className="font-semibold text-green-800 text-lg">{actorName}</h4>
                      <span className="text-green-600 text-sm">✓ Guessed correctly!</span>
                    </div>
                    
                    {/* Show all hints for the correctly guessed actor */}
                    <div className="text-left">
                      <h5 className="font-medium text-green-700 mb-2 text-sm">All Hints:</h5>
                      <div className="space-y-1">
                        {actor.hints.map((hint, hintIndex) => (
                          <p key={hintIndex} className="text-green-600 text-xs">
                            <span className="font-medium">{hint.type.replace('_', ' ').toUpperCase()}:</span> {hint.content}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mashed Image */}
        <div className="text-center mb-8">
          {gameData?.mashedImage ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Mashed Face
              </h3>
              <img 
                src={gameData.mashedImage} 
                alt="Mashed faces of two actors"
                className="w-64 h-64 mx-auto object-cover rounded-lg shadow-lg border-2 border-bollywood-gold"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-200 w-64 h-64 mx-auto rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Loading mashed image...</span>
              </div>
            </div>
          )}
        </div>

        {/* Actor Photos (shown when game ends) */}
        {renderActorPhotos()}

        {/* Input Field - Hidden when game is completed */}
        {!gameCompleted && (
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Enter Actor Name
              </label>
              <input
                type="text"
                value={actorGuess}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(actorSuggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bollywood-gold focus:border-transparent text-center"
                placeholder="Type actor name..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
              {renderSuggestions()}
            </div>
          </div>
        )}

        {/* Hints */}
        {renderHints()}

        {/* Submit Button - Hidden when game is completed */}
        {!gameCompleted && (
          <div className="text-center mb-6">
            <button
              onClick={handleSubmit}
              disabled={!actorGuess.trim()}
              className="px-8 py-3 bg-bollywood-red text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors font-semibold"
            >
              Submit Guess
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="text-sm text-gray-600 text-center">
          <p>Enter the name of either actor whose face has been merged in the image above.</p>
          <p>You have {GAME_CONFIG.MAX_ATTEMPTS} attempts total. Find both actors to win!</p>
          <p>Hints will be revealed after each wrong guess.</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default FaceMashGame;
