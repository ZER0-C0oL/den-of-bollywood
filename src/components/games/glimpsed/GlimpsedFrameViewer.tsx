import React, { useState, useEffect } from 'react';
import { GlimpsedGameData } from '../../../types/gameTypes';
import { GlimpsedGameState, GlimpsedGameService } from './GlimpsedGameService';
import { getMovieById } from '../../../data/moviesData';

interface GlimpsedFrameViewerProps {
  gameData: GlimpsedGameData;
  gameState: GlimpsedGameState;
}

const GlimpsedFrameViewer: React.FC<GlimpsedFrameViewerProps> = ({ gameData, gameState }) => {
  const movieData = getMovieById(gameData.movieId);
  const [selectedFrame, setSelectedFrame] = useState(gameState.currentFrame);

  const minFrame = 1;
  // If game is completed (correct guess or max attempts reached), allow navigation through all frames and the poster (frame 7)
  const isCompleted = gameState.gameCompleted || gameState.showAnswer;
  const maxFrame = isCompleted ? 7 : gameState.currentFrame;

  // When game completes, default to showing the poster (frame 7). Otherwise follow currentFrame.
  useEffect(() => {
    setSelectedFrame(isCompleted ? 7 : gameState.currentFrame);
  }, [gameState.currentFrame, isCompleted]);

  // Ensure selectedFrame stays within allowed range
  useEffect(() => {
    setSelectedFrame(prev => Math.min(Math.max(prev, minFrame), maxFrame));
  }, [maxFrame]);

  const framePath = selectedFrame === 7
    ? GlimpsedGameService.getMovieImagePath(gameData)
    : GlimpsedGameService.getFrameImagePath(gameData, selectedFrame);
  // Use movieData for accessible labels when showing poster
  const movieTitle = movieData?.name || gameData.movieName;

  const handlePrev = () => {
    if (selectedFrame > minFrame) setSelectedFrame(selectedFrame - 1);
  };
  const handleNext = () => {
    if (selectedFrame < maxFrame) setSelectedFrame(selectedFrame + 1);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-center items-center mb-6 gap-4">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={selectedFrame === minFrame}
          className={`p-2 rounded-full border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors ${selectedFrame === minFrame ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Previous frame"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Frame Image */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <img
            src={framePath}
            alt={selectedFrame === 7 ? `${movieTitle} poster` : `Movie frame ${selectedFrame}`}
            className="max-w-2xl max-h-96 object-contain rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                if (selectedFrame === 7) {
                  parent.innerHTML = '<div class="w-96 h-96 bg-gray-200 rounded-lg flex items-center justify-center">' +
                    '<div class="text-center">' +
                      '<div class="text-4xl mb-2">🎬</div>' +
                      '<div class="text-lg font-semibold">' + movieTitle + '</div>' +
                    '</div>' +
                  '</div>';
                } else {
                  parent.innerHTML = '<div class="w-96 h-64 bg-gray-200 rounded-lg flex items-center justify-center">' +
                    '<div class="text-center">' +
                      '<div class="text-4xl mb-2">🎬</div>' +
                      '<div class="text-lg">Frame ' + selectedFrame + '</div>' +
                    '</div>' +
                  '</div>';
                }
              }
            }}
          />
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={selectedFrame === maxFrame}
          className={`p-2 rounded-full border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors ${selectedFrame === maxFrame ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Next frame"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {!isCompleted && (
        <div className="text-center text-gray-600 text-sm">Frame {selectedFrame} of 6</div>
      )}
    </div>
  );
};

export default GlimpsedFrameViewer;