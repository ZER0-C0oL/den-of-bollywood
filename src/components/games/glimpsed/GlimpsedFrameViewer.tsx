import React from 'react';
import { GlimpsedGameData } from '../../../types/gameTypes';
import { GlimpsedGameState, GlimpsedGameService } from './GlimpsedGameService';
import { getMovieById } from '../../../data/moviesData';

interface GlimpsedFrameViewerProps {
  gameData: GlimpsedGameData;
  gameState: GlimpsedGameState;
}

const GlimpsedFrameViewer: React.FC<GlimpsedFrameViewerProps> = ({
  gameData,
  gameState
}) => {
  const movieData = getMovieById(gameData.movieId);

  // Show movie poster if game is completed
  if (gameState.showAnswer) {
    const movieImagePath = GlimpsedGameService.getMovieImagePath(gameData);
    
    return (
      <div className="mb-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {gameState.movieFound ? '🎉 Congratulations!' : '🎬 Movie Revealed'}
          </h2>
          <p className="text-lg text-gray-600">
            The movie was: <span className="font-semibold text-bollywood-red">{movieData?.name || gameData.movieName}</span>
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <img
              src={movieImagePath}
              alt={`${movieData?.name || gameData.movieName} poster`}
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
                        <div class="text-lg font-semibold">${movieData?.name || gameData.movieName}</div>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show current frame during the game
  const currentFramePath = GlimpsedGameService.getFrameImagePath(gameData, gameState.currentFrame);

  return (
    <div className="mb-8">
      {/* Current Frame */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <img
            src={currentFramePath}
            alt={`Movie frame ${gameState.currentFrame}`}
            className="max-w-2xl max-h-96 object-contain rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="w-96 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-4xl mb-2">🎬</div>
                      <div class="text-lg">Frame ${gameState.currentFrame}</div>
                    </div>
                  </div>
                `;
              }
            }}
          />
        </div>
      </div>

      {/* Previous Frames Thumbnails */}
      {gameState.currentFrame > 1 && (
        <div className="flex justify-center">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">
              Previously shown frames:
            </h3>
            <div className="flex gap-2 flex-wrap justify-center">
              {Array.from({ length: gameState.currentFrame - 1 }, (_, i) => {
                const frameNumber = i + 1;
                const framePath = GlimpsedGameService.getFrameImagePath(gameData, frameNumber);
                
                return (
                  <div key={frameNumber} className="relative">
                    <img
                      src={framePath}
                      alt={`Frame ${frameNumber}`}
                      className="w-16 h-12 object-cover rounded border-2 border-gray-300 hover:border-bollywood-red transition-colors cursor-pointer"
                      title={`Frame ${frameNumber}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-16 h-12 bg-gray-300 rounded border-2 border-gray-300 flex items-center justify-center text-xs">
                              ${frameNumber}
                            </div>
                          `;
                        }
                      }}
                    />
                    <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 rounded-tl">
                      {frameNumber}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlimpsedFrameViewer;
