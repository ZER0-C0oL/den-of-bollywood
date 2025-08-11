import React from 'react';
import { PlotFusionGameData } from '../../../types/gameTypes';
import { PlotFusionMovieState } from './PlotFusionGameService';

interface PlotFusionMovieFrameProps {
  movieKey: 'movie1' | 'movie2';
  gameData: PlotFusionGameData;
  movieState: PlotFusionMovieState;
  isSelected: boolean;
  showAnswers: boolean;
  onFrameClick: (target: 'movie1' | 'movie2') => void;
}

const PlotFusionMovieFrame: React.FC<PlotFusionMovieFrameProps> = ({
  movieKey,
  gameData,
  movieState,
  isSelected,
  showAnswers,
  onFrameClick
}) => {
  const movie = gameData.movies[movieKey];
  const isFound = movieState.found;
  
  const handleClick = () => {
    if (!isFound && !showAnswers) {
      onFrameClick(movieKey);
    }
  };

  const getFrameStyle = () => {
    if (isFound) {
      return 'border-green-500 bg-green-50';
    } else if (isSelected) {
      return 'border-blue-500 bg-blue-50';
    } else if (showAnswers) {
      return 'border-red-500 bg-red-50';
    } else {
      return 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50';
    }
  };

  const getCursorStyle = () => {
    if (isFound || showAnswers) {
      return 'cursor-default';
    } else {
      return 'cursor-pointer';
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative w-48 h-32 border-4 rounded-lg transition-all duration-300 flex flex-col items-center justify-center text-center p-4
        ${getFrameStyle()}
        ${getCursorStyle()}
      `}
    >
      {/* Status Icon */}
      <div className="absolute top-2 right-2">
        {isFound ? (
          <span className="text-green-600 text-xl">✓</span>
        ) : showAnswers ? (
          <span className="text-red-600 text-xl">✗</span>
        ) : isSelected ? (
          <span className="text-blue-600 text-xl">🎯</span>
        ) : null}
      </div>

      {/* Movie Name */}
      <div className="flex-1 flex items-center justify-center">
        {showAnswers || isFound ? (
          <h3 className="font-bold text-lg text-gray-800">{movie.name}</h3>
        ) : (
          <div className="text-gray-500">
            <div className="text-4xl mb-2">🎬</div>
            <p className="text-sm">
              {movieKey === 'movie1' ? 'Movie 1' : 'Movie 2'}
            </p>
          </div>
        )}
      </div>

      {/* Attempt Counter */}
      {movieState.guesses.length > 0 && (
        <div className="absolute bottom-2 left-2 text-xs text-gray-600">
          {movieState.guesses.length} {movieState.guesses.length === 1 ? 'attempt' : 'attempts'}
        </div>
      )}
    </div>
  );
};

export default PlotFusionMovieFrame;
