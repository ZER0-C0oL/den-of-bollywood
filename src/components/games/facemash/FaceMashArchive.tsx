import React from 'react';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../../GameLayout';
import ArchiveGrid from '../ArchiveGrid';
import { getAllFaceMashGames } from '../../../data/faceMashData';

const FaceMashArchive: React.FC = () => {
  const navigate = useNavigate();
  const allGames = getAllFaceMashGames();

  const handleGameSelect = (gameId: string) => {
    navigate(`/face-mash?gameId=${gameId}`);
  };

  const handleBackToGame = () => {
    navigate('/face-mash');
  };

  return (
    <GameLayout title="Face Mash Archive" description="Play past Face Mash games">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Face Mash Archive</h1>
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
          onGameSelect={handleGameSelect}
          gameType="face-mash"
        />

        {/* Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>All your progress is saved separately for each game.</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default FaceMashArchive;
