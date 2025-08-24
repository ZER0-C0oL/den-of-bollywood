import React, { useState } from 'react';
import GameLayout from '../../GameLayout';
import { GameStorageManager } from '../../../utils/gameStorage';
import ShareModal from '../../ShareModal';
import { generateGlimpsedShareText, GlimpsedShareData } from '../../../utils/shareUtils';
import { getTodaysGlimpsedGame } from '../../../data/glimpsedData';
import GlimpsedGuessHistory from './GlimpsedGuessHistory';
import GlimpsedControls from './GlimpsedControls';
import { GlimpsedGameService } from './GlimpsedGameService';

interface GlimpsedCooldownViewProps {
  formattedTime: string;
  onShare: () => void;
  onReplay?: () => void;
  onArchive?: () => void;
  showShareModal?: boolean;
  onCloseShareModal?: () => void;
}

// Small frame viewer used in cooldown view: poster is considered the 7th item
const FrameViewerArea: React.FC<any> = ({ todaysGame, gameProgress }) => {
  const starting = gameProgress?.gameState?.currentFrame || 1;
  const [selectedFrame, setSelectedFrame] = useState<number>(starting);

  const isPoster = selectedFrame === 7;

  const maxAvailableFrame = Math.max(gameProgress?.gameState?.currentFrame || 1, 6);

  const prev = () => {
    if (isPoster) return setSelectedFrame(6);
    if (selectedFrame > 1) setSelectedFrame(s => s - 1);
  };

  const next = () => {
    if (selectedFrame < maxAvailableFrame) setSelectedFrame(s => s + 1);
    else if (selectedFrame === maxAvailableFrame && maxAvailableFrame < 7) setSelectedFrame(7);
  };

  const src = isPoster
    ? GlimpsedGameService.getMovieImagePath(todaysGame)
    : GlimpsedGameService.getFrameImagePath(todaysGame, selectedFrame);

  return (
    <>
      <button
        onClick={prev}
        disabled={selectedFrame === 1}
        className={`p-2 rounded-full border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors ${selectedFrame === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Previous frame"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <img
          src={src}
          alt={isPoster ? `${todaysGame.movieName} poster` : `Frame ${selectedFrame}`}
          className={isPoster ? 'max-w-md max-h-96 object-contain rounded-lg' : 'max-w-2xl max-h-96 object-contain rounded-lg'}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<div class="w-64 h-96 bg-gray-200 rounded-lg flex items-center justify-center">' +
                '<div class="text-center">' +
                '<div class="text-4xl mb-2">🎬</div>' +
                '<div class="text-lg font-semibold">' + (todaysGame?.movieName || 'Movie') + '</div>' +
                '</div>' +
                '</div>';
            }
          }}
        />
      </div>

      <button
        onClick={next}
        disabled={selectedFrame === 7}
        className={`p-2 rounded-full border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors ${selectedFrame === 7 ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Next frame"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="text-center text-gray-600 text-sm mt-2">{isPoster ? 'Poster' : `Frame ${selectedFrame} of 6`}</div>
    </>
  );
};

const GlimpsedCooldownView: React.FC<GlimpsedCooldownViewProps> = ({ formattedTime, onShare, onReplay, onArchive, showShareModal, onCloseShareModal }) => {
  const todaysGame = getTodaysGlimpsedGame();
  const gameProgress = todaysGame ? GameStorageManager.getGameProgress(todaysGame.id) : null;

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
    <GameLayout title="Glimpsed" description="Guess the Bollywood movie from frames">
      {/* Header with Archive Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1"></div>
        {onArchive && (
          <button
            onClick={onArchive}
            className="flex items-center gap-2 px-4 py-2  bg-blue-600 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
            title="View past games"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Archive
          </button>
        )}
      </div>

      {/* Countdown Header */}
      <div className="bg-bollywood-teal text-white p-4 rounded-lg mb-6 text-center">
        <h2 className="text-xl font-bold">Next Challenge in: {formattedTime}</h2>
      </div>

      {todaysGame && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center mb-6">
            {gameProgress?.completed ? (
              gameProgress.gameState?.movieFound ? (
                <h3 className="text-2xl font-bold text-green-800 mb-2">🎉 Challenge Completed!</h3>
              ) : (
                <h3 className="text-2xl font-bold text-red-800 mb-2">😔 Challenge Not Solved</h3>
              )
            ) : (
              <h3 className="text-2xl font-bold text-gray-600 mb-2">Today's Challenge</h3>
            )}
          </div>

          <div className="flex justify-center items-center gap-8 mb-6">
            <FrameViewerArea todaysGame={todaysGame} gameProgress={gameProgress} />
          </div>

          {/* Show guesses if available */}
          {gameProgress?.gameState?.guesses && gameProgress.gameState.guesses.length > 0 && (
            <GlimpsedGuessHistory
              guesses={gameProgress.gameState.guesses}
              correctMovie={todaysGame?.movieName || ''}
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
        isOpen={!!showShareModal}
        onClose={() => onCloseShareModal && onCloseShareModal()}
        shareText={generateGlimpsedShareText(generateShareData())}
        gameTitle="Glimpsed Result"
      />
    </GameLayout>
  );
};

export default GlimpsedCooldownView;
