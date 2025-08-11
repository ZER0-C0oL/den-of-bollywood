import React from "react";
import ShareModal from "../../ShareModal";
import { ConnectionsGameData } from "../../../types/gameTypes";
import { ConnectionsGameService } from "./ConnectionsGameService";
import { GameStorageManager } from "../../../utils/gameStorage";
import { getTodaysConnectionsGame } from "../../../data/connectionsData";
import {
  generateConnectionsShareText,
  ConnectionsShareData,
} from "../../../utils/shareUtils";
import ConnectionsControls from "./ConnectionsControls";

interface ConnectionsCooldownViewProps {
  formattedTime: string;
  onShare: () => void;
  onReplay?: () => void;
  onArchive?: () => void;
  showShareModal: boolean;
  onCloseShareModal: () => void;
}

const ConnectionsCooldownView: React.FC<ConnectionsCooldownViewProps> = ({
  formattedTime,
  onShare,
  onReplay,
  onArchive,
  showShareModal,
  onCloseShareModal,
}) => {
  const todaysGame = getTodaysConnectionsGame();
  const gameProgress = todaysGame
    ? GameStorageManager.getGameProgress(todaysGame.id)
    : null;

  const generateShareData = (): ConnectionsShareData => {
    if (!todaysGame || !gameProgress) {
      return {
        gameId: "unknown",
        gameWon: false,
        totalAttempts: 0,
        maxAttempts: 4,
        solvedGroups: [],
        attemptResults: [],
      };
    }

    return {
      gameId: todaysGame.id,
      gameWon: (gameProgress.gameState?.solvedGroups?.length || 0) === 4,
      totalAttempts: gameProgress.attempts || 0,
      maxAttempts: 4,
      solvedGroups: gameProgress.gameState?.solvedGroups || [],
      attemptResults: gameProgress.attemptResults || [],
    };
  };

  const renderSolutionGroups = (gameData: ConnectionsGameData) => {
    return (
      <div className="space-y-3 mb-6">
        {gameData.groups.map((group, groupIndex) => {
          const isSolved = gameProgress?.gameState?.solvedGroups?.includes(
            group.id
          );
          const styling = ConnectionsGameService.getGroupStyling(groupIndex);

          return (
            <div
              key={groupIndex}
              className={`p-4 rounded-lg ${isSolved ? "" : "opacity-60"}`}
              style={{
                backgroundColor: styling.backgroundColor,
                borderLeft: `4px solid ${styling.borderColor}`,
              }}
            >
              <h3 className="font-bold text-gray-800 mb-2">
                {group.category} {isSolved ? "✓" : "✗"}
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
      {/* Header with Archive Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1"></div>
        <button
          onClick={onArchive}
          className="flex items-center gap-2 px-4 py-2  bg-blue-600 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
          title="View past games"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Archive
        </button>
      </div>
      {/* Countdown Header */}
      <div className="bg-bollywood-teal text-white p-4 rounded-lg mb-6 text-center">
        <h2 className="text-xl font-bold">
          Next Challenge in: {formattedTime}
        </h2>
      </div>

      {/* Show game state based on progress */}
      {gameProgress && todaysGame && (
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6">
            {gameProgress.completed &&
              (gameProgress.gameState?.solvedGroups?.length === 4 ? (
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  🎉 Challenge Completed!
                </h3>
              ) : (
                <h3 className="text-2xl font-bold text-red-800 mb-2">
                  😔 Challenge Not Solved
                </h3>
              ))}
          </div>

          {/* Show all groups if game is completed */}
          {gameProgress.completed && renderSolutionGroups(todaysGame)}

          {/* Controls for completed games */}
          {gameProgress.completed && (
            <ConnectionsControls
              selectedItems={[]}
              onClearSelection={() => {}}
              onSubmit={() => {}}
              onShuffle={() => {}}
              disabled={false}
              gameCompleted={true}
              onShare={onShare}
              onReplay={onReplay}
            />
          )}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={onCloseShareModal}
        shareText={generateConnectionsShareText(generateShareData())}
        gameTitle="Connections Result"
      />
    </>
  );
};

export default ConnectionsCooldownView;
