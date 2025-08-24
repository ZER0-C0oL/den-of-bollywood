import React from 'react';

interface GlimpsedGuessHistoryProps {
  guesses: string[];
  correctMovie: string;
  gameCompleted: boolean;
}

const GlimpsedGuessHistory: React.FC<GlimpsedGuessHistoryProps> = ({
  guesses,
  correctMovie,
  gameCompleted
}) => {
  if (guesses.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Your Guesses
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            {guesses.map((guess, index) => {
              const isCorrect = gameCompleted && 
                guess.toLowerCase().trim() === correctMovie.toLowerCase().trim();
              
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isCorrect
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className={`font-medium ${
                      isCorrect ? 'text-green-800' : 'text-gray-800'
                    }`}>
                      {guess}
                    </span>
                  </div>
                  
                  <div className="text-lg">
                    {isCorrect ? '✅' : '❌'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlimpsedGuessHistory;
