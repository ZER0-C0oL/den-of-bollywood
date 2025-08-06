import React from 'react';
import { ConnectionsGameData } from '../../../types/gameTypes';
import { ConnectionsGameService } from './ConnectionsGameService';
import { GameStorageManager } from '../../../utils/gameStorage';
import { getTodaysConnectionsGame } from '../../../data/connectionsData';

interface ConnectionsCooldownViewProps {
  cooldownTime: number;
  formattedTime: string;
  onShare: () => void;
  onReplay?: () => void;
}

const ConnectionsCooldownView: React.FC<ConnectionsCooldownViewProps> = ({
  cooldownTime,
  formattedTime,
  onShare,
  onReplay
}) => {
  const todaysGame = getTodaysConnectionsGame();
  const gameProgress = todaysGame ? GameStorageManager.getGameProgress(todaysGame.id) : null;

  const renderSolutionGroups = (gameData: ConnectionsGameData) => {
    return (
      <div className="space-y-3 mb-6">
        {gameData.groups.map((group, groupIndex) => {
          const isSolved = gameProgress?.gameState?.solvedGroups?.includes(group.id);
          const styling = ConnectionsGameService.getGroupStyling(groupIndex);
          
          return (
            <div 
              key={groupIndex} 
              className={`p-4 rounded-lg ${isSolved ? '' : 'opacity-60'}`} 
              style={{ 
                backgroundColor: styling.backgroundColor,
                borderLeft: `4px solid ${styling.borderColor}`
              }}
            >
              <h3 className="font-bold text-gray-800 mb-2">
                {group.category} {isSolved ? '✓' : '✗'}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {group.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-white p-2 rounded text-center text-sm font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Countdown Header */}
            <div className="bg-bollywood-teal text-white p-4 rounded-lg mb-6 text-center">
        <h2 className="text-xl font-bold">
          Next Challenge in: {formattedTime}
        </h2>
      </div>

      {/* Show game state based on progress */}
      {gameProgress && todaysGame ? (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            {gameProgress.completed && (
              gameProgress.gameState?.solvedGroups?.length === 4 ? (
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  🎉 Challenge Completed!
                </h3>
              ) : (
                <h3 className="text-2xl font-bold text-red-800 mb-2">
                  😔 Challenge Not Solved
                </h3>
              )
            )}
          </div>

          {/* Show all groups if game is completed */}
          {gameProgress.completed && renderSolutionGroups(todaysGame)}

          {/* Share button for completed games */}
          {gameProgress.completed && (
            <div className="text-center flex justify-center gap-4">
              <button
                onClick={onShare}
                className="bg-bollywood-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500"
              >
                📤 Share Result
              </button>
              {onReplay && (
                <button
                  onClick={onReplay}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  ↺ Replay
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Game on Cooldown</h2>
          <p className="text-gray-600">
            Come back later for the next Connections challenge!
          </p>
        </div>
      )}
    </>
  );
};

export default ConnectionsCooldownView;
