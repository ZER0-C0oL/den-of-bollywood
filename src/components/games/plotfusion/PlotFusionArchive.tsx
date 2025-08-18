import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../../GameLayout';
import ArchiveGrid from '../ArchiveGrid';
import { getAllPlotFusionGames, getPlotFusionGameStats } from '../../../data/plotFusionData';

const PlotFusionArchive: React.FC = () => {
  const navigate = useNavigate();
  const games = getAllPlotFusionGames();
  const stats = getPlotFusionGameStats();

  const handleBackToToday = () => {
    navigate('/plot-fusion');
  };

  return (
    <GameLayout title="Plot Fusion Archive">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Plot Fusion Archive
            </h2>
            <p className="text-gray-600">
              Play past Plot Fusion puzzles • {stats.totalGames} games available
            </p>
          </div>
          <button
            onClick={handleBackToToday}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            Today's Game
          </button>
        </div>

        {/* Game Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎬</span>
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">
                How to Play Plot Fusion
              </h3>
              <p className="text-blue-700 text-sm">
                Each puzzle combines the plots of two different Bollywood movies. 
                Read the fused storyline and guess both movies to win. Wrong guesses 
                reveal hints about the year, director, and cast of each movie.
              </p>
            </div>
          </div>
        </div>

        {/* Archive Grid */}
        <ArchiveGrid
          games={games}
          gameType="plot-fusion"
        />
      </div>
    </GameLayout>
  );
};

export default PlotFusionArchive;
