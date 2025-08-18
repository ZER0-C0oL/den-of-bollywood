import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../../GameLayout';
import ArchiveGrid from '../ArchiveGrid';
import { getAllConnectionsGames } from '../../../data/connectionsData';

const ConnectionsArchive: React.FC = () => {
  const navigate = useNavigate();
  const allGames = getAllConnectionsGames();

  const handleBackToGame = () => {
    navigate('/connections');
  };

  return (
    <GameLayout title="Connections Archive" description="Play past Connections games">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Connections Archive</h1>
            <p className="text-gray-600">Select a past game to play</p>
          </div>
          <button
            onClick={handleBackToGame}
            className="bg-bollywood-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            ← Back to Today's Game
          </button>
        </div>

        {/* Archive Grid */}
        <ArchiveGrid
          games={allGames}
          gameType="connections"
        />

        {/* Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>All your progress is saved separately for each game.</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default ConnectionsArchive;
