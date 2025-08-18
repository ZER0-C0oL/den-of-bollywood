import React from 'react';
import ShareModal from '../../ShareModal';
import { GameStorageManager } from '../../../utils/gameStorage';
import { getTodaysGlimpsedGame } from '../../../data/glimpsedData';
import { generateGlimpsedShareText, GlimpsedShareData } from '../../../utils/shareUtils';
import { getMovieById } from '../../../data/moviesData';
import { GlimpsedGameService } from './GlimpsedGameService';
import GlimpsedControls from './GlimpsedControls';
import GlimpsedGuessHistory from './GlimpsedGuessHistory';

interface GlimpsedCooldownViewProps {
  formattedTime: string;
  onShare: () => void;
  onReplay?: () => void;
  onArchive?: () => void;
  showShareModal: boolean;
  onCloseShareModal: () => void;
}

const GlimpsedCooldownView: React.FC<GlimpsedCooldownViewProps> = ({
  formattedTime,
  onShare,
  onReplay,
  onArchive,
  showShareModal,
  onCloseShareModal
}) => {
  const todaysGame = getTodaysGlimpsedGame();
  const gameProgress = todaysGame ? GameStorageManager.getGameProgress(todaysGame.id) : null;
  const movieData = todaysGame ? getMovieById(todaysGame.movieId) : null;

  const generateShareData = (): GlimpsedShareData => {
    if (!todaysGame || !gameProgress) {
      return {
        gameId: 'unknown',
        gameWon: false,
        totalAttempts: 0,
        framesShown: 1,
        guesses: []
      };
    }

    return {
      gameId: todaysGame.id,
      gameWon: gameProgress.gameState?.movieFound || false,
      totalAttempts: gameProgress.attempts || 0,
      framesShown: gameProgress.gameState?.currentFrame || 1,
      guesses: gameProgress.gameState?.guesses || []
    };
  };

  return (
    <>
      {/* Countdown Header */}
      <div className="bg-bollywood-teal text-white p-4 rounded-lg mb-6 text-center">
        <h2 className="text-xl font-bold">
          Next Challenge in: {formattedTime}
        </h2>
      </div>

      {/* Archive Button */}
      {onArchive && (
        <div className="flex justify-center mb-6">
          <button
            onClick={onArchive}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            title="View past games"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Archive
          </button>
        </div>
      )}

      {/* Show game state based on progress */}
      {todaysGame && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            {gameProgress?.completed ? (
              gameProgress.gameState?.movieFound ? (
                <h3 className="text-2xl font-bold text-green-800 mb-2">
                  🎉 Challenge Completed!
                </h3>
              ) : (
                <h3 className="text-2xl font-bold text-red-800 mb-2">
                  😔 Challenge Not Solved
                </h3>
              )
            ) : (
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                Today's Challenge
              </h3>
            )}
          </div>

          {/* Show movie poster if game was played */}
          {gameProgress && movieData && (
            <div className="mb-6">
              <div className="text-center mb-4">
                <p className="text-lg text-gray-600">
                  The movie was: <span className="font-semibold text-bollywood-red">{movieData.name}</span>
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <img
                    src={GlimpsedGameService.getMovieImagePath(todaysGame)}
                    alt={`${movieData.name} poster`}
                    className="max-w-md max-h-96 object-contain rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-64 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                            <div class="text-center">
                              <div class="text-4xl mb-2">🎬</div>
                              <div class="text-lg font-semibold">${movieData.name}</div>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Show guess history if available */}
          {gameProgress?.gameState?.guesses && gameProgress.gameState.guesses.length > 0 && (
            <GlimpsedGuessHistory
              guesses={gameProgress.gameState.guesses}
              correctMovie={movieData?.name || ''}
              gameCompleted={gameProgress.completed || false}
            />
          )}

          {/* Controls for completed games */}
          {gameProgress?.completed && (
            <GlimpsedControls
              onGuess={() => {}}
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
        shareText={generateGlimpsedShareText(generateShareData())}
        gameTitle="Glimpsed Result"
      />
    </>
  );
};

export default GlimpsedCooldownView;
