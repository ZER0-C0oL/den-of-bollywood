import React from 'react';
import GameLayout from '../../GameLayout';
import ArchiveGrid from '../ArchiveGrid';
import { getAllGlimpsedGames } from '../../../data/glimpsedData';

const GlimpsedArchive: React.FC = () => {
  const games = getAllGlimpsedGames();

  return (
    <GameLayout title="Glimpsed Archive" description="Play past Glimpsed games">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Glimpsed Archive</h1>
            <p className="text-gray-600">
              Play previous Glimpsed challenges. Guess the Bollywood movie from the frames shown!
            </p>
          </div>
        </div>

        {/* Archive Grid */}
        <ArchiveGrid
          games={games}
          gameType="glimpsed"
          emptyMessage="No Glimpsed games available yet. Check back soon!"
        />
      </div>
    </GameLayout>
  );
};

export default GlimpsedArchive;
