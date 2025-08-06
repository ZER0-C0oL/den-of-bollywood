import React from 'react';
import GameLayout from '../../GameLayout';
import { GameStorageManager } from '../../../utils/gameStorage';
import { getTodaysFaceMashGame } from '../../../data/faceMashData';

interface FaceMashCooldownViewProps {
  cooldownTime: number;
  formattedTime: string;
  onShare: () => void;
}

const FaceMashCooldownView: React.FC<FaceMashCooldownViewProps> = ({
  cooldownTime,
  formattedTime,
  onShare
}) => {
  // Get today's game data and progress
  const todaysGame = getTodaysFaceMashGame();
  const gameProgress = todaysGame ? GameStorageManager.getGameProgress(todaysGame.id) : null;

  return (
    <GameLayout title="Face Mash">
      {/* Countdown Header */}
      <div className="bg-bollywood-teal text-white p-4 rounded-lg mb-6 text-center">
        <h2 className="text-xl font-bold">Next Challenge in: {formattedTime}</h2>
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
            )}
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
                onClick={onShare}
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
};

export default FaceMashCooldownView;
