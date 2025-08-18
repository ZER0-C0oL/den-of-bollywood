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
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-sm text-gray-600 text-center">
              {gameCompleted ? (
                guesses.some(guess => 
                  guess.toLowerCase().trim() === correctMovie.toLowerCase().trim()
                ) ? (
                  `🎉 Found the movie in ${guesses.length} guess${guesses.length !== 1 ? 'es' : ''}!`
                ) : (
                  `😔 Movie not found after ${guesses.length} guesses`
                )
              ) : (
                `${guesses.length} incorrect guess${guesses.length !== 1 ? 'es' : ''} so far...`
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlimpsedGuessHistory;
