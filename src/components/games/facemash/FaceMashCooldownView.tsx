import React from 'react';
import GameLayout from '../../GameLayout';
import { GameStorageManager } from '../../../utils/gameStorage';
import { getTodaysFaceMashGame } from '../../../data/faceMashData';
import FaceMashGuessHistory from './FaceMashGuessHistory';
import FaceMashActorFrame from './FaceMashActorFrame';
import FaceMashImage from './FaceMashImage';
import FaceMashControls from './FaceMashControls';

interface FaceMashCooldownViewProps {
  cooldownTime: number;
  formattedTime: string;
  onShare: () => void;
  onReplay?: () => void;
}

const FaceMashCooldownView: React.FC<FaceMashCooldownViewProps> = ({
  cooldownTime,
  formattedTime,
  onShare,
  onReplay
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
      {gameProgress && todaysGame && (
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
            {/* Left Actor Frame */}
            {gameProgress.gameState?.actor1State && (
              <FaceMashActorFrame
                actorKey="actor1"
                gameData={todaysGame}
                actorState={gameProgress.gameState.actor1State}
                isSelected={false}
                showAnswers={gameProgress.completed}
                onFrameClick={() => {}} // No interaction needed in cooldown view
              />
            )}
            
            {/* Mashed Image */}
            <FaceMashImage src={todaysGame.mashedImage} />
            
            {/* Right Actor Frame */}
            {gameProgress.gameState?.actor2State && (
              <FaceMashActorFrame
                actorKey="actor2"
                gameData={todaysGame}
                actorState={gameProgress.gameState.actor2State}
                isSelected={false}
                showAnswers={gameProgress.completed}
                onFrameClick={() => {}} // No interaction needed in cooldown view
              />
            )}
          </div>

          {/* Show guesses if available */}
          {(gameProgress.gameState?.actor1State?.guesses?.length || gameProgress.gameState?.actor2State?.guesses?.length) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Actor 1 Guesses */}
              {gameProgress.gameState?.actor1State && (
                <FaceMashGuessHistory
                  actorKey="actor1"
                  gameData={todaysGame}
                  actorState={gameProgress.gameState.actor1State}
                />
              )}
              
              {/* Actor 2 Guesses */}
              {gameProgress.gameState?.actor2State && (
                <FaceMashGuessHistory
                  actorKey="actor2"
                  gameData={todaysGame}
                  actorState={gameProgress.gameState.actor2State}
                />
              )}
            </div>
          )}

          {/* Share button for completed games */}
          {gameProgress.completed && (
            <FaceMashControls
              gameCompleted={true}
              onSubmitGuess={() => {}} // No guessing needed in cooldown view
              onShare={onShare}
              onReplay={onReplay}
            />
          )}
        </div>
      )
    }
    </GameLayout>
  );
};

export default FaceMashCooldownView;
