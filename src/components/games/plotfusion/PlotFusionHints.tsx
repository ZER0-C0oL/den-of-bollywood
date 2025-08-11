import React from 'react';
import { PlotFusionGameData } from '../../../types/gameTypes';
import { PlotFusionMovieState, PlotFusionGameService } from './PlotFusionGameService';
import { getMovieHints } from '../../../data/moviesData';

interface PlotFusionHintsProps {
  movieKey: 'movie1' | 'movie2';
  gameData: PlotFusionGameData;
  movieState: PlotFusionMovieState;
  showAnswers?: boolean;
}

const PlotFusionHints: React.FC<PlotFusionHintsProps> = ({
  movieKey,
  gameData,
  movieState,
  showAnswers = false
}) => {
  const movie = gameData.movies[movieKey];
  const movieLabel = movieKey === 'movie1' ? 'Movie 1' : 'Movie 2';
  
  // Get hints from centralized movie data
  const hints = getMovieHints(movie.movieId);

  const getHintIcon = (hintType: string) => {
    switch (hintType) {
      case 'year':
        return '📅';
      case 'director':
        return '🎬';
      case 'cast':
        return '🎭';
      default:
        return '💡';
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-lg">💡</span>
        {movieLabel} Hints
      </h4>
      
      <div className="space-y-2">
        {hints.map((hint, index) => {
          const shouldReveal = showAnswers || PlotFusionGameService.shouldRevealHint(movieState, index);
          
          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-2 rounded transition-all duration-300 ${
                shouldReveal
                  ? 'bg-white shadow-sm border border-gray-200'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              <span className="text-lg" role="img" aria-label={hint.type}>
                {getHintIcon(hint.type)}
              </span>
              <span className={shouldReveal ? 'text-gray-800' : 'text-gray-500'}>
                {shouldReveal ? hint.text : '???'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlotFusionHints;
