import React from 'react';
import { PlotFusionGameData } from '../../../types/gameTypes';
import { PlotFusionMovieState } from './PlotFusionGameService';

interface PlotFusionGuessHistoryProps {
  movieKey: 'movie1' | 'movie2';
  gameData: PlotFusionGameData;
  movieState: PlotFusionMovieState;
}

const PlotFusionGuessHistory: React.FC<PlotFusionGuessHistoryProps> = ({
  movieKey,
  gameData,
  movieState
}) => {
  const movie = gameData.movies[movieKey];
  const correctAnswer = movie.name;

  if (movieState.guesses.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="text-lg">📝</span>
          Guesses
        </h4>
        <p className="text-gray-500 text-sm italic">No guesses yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <span className="text-lg">📝</span>
        Guesses
      </h4>
      
      <div className="space-y-2 max-h-32">
        {movieState.guesses.map((guess, index) => {
          const isCorrect = guess.toLowerCase() === correctAnswer.toLowerCase();
          
          return (
            <div
              key={index}
              className={`flex items-center justify-between p-2 rounded border ${
                isCorrect
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : 'bg-red-100 border-red-300 text-red-800'
              }`}
            >
              <span className="font-medium">{guess}</span>
              <span className="text-lg">
                {isCorrect ? '✅' : '❌'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlotFusionGuessHistory;
