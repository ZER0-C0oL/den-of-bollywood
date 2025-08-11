import React from 'react';
import GameLayout from '../../GameLayout';

interface PlotFusionCooldownViewProps {
  formattedTime: string;
  onShare: () => void;
  onReplay: () => void;
}

const PlotFusionCooldownView: React.FC<PlotFusionCooldownViewProps> = ({
  formattedTime,
  onShare,
  onReplay
}) => {
  return (
    <GameLayout title="Plot Fusion">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Come back later!
          </h2>
          <p className="text-gray-600 mb-2">
            You've already completed today's Plot Fusion challenge.
          </p>
          <p className="text-lg font-semibold text-blue-600 mb-6">
            Next puzzle in: {formattedTime}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onShare}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16,6 12,2 8,6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share Result
            </button>
            
            <button
              onClick={onReplay}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1,4 1,10 7,10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Play Again
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              🎬 Plot Fusion combines plots from two different movies. 
              Can you guess both films from the fused storyline?
            </p>
          </div>
        </div>
      </div>
    </GameLayout>
  );
};

export default PlotFusionCooldownView;
