import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectionsGameData, FaceMashGameData, PlotFusionGameData, GlimpsedGameData } from '../../types/gameTypes';

interface ArchiveGridProps {
  games: (ConnectionsGameData | FaceMashGameData | PlotFusionGameData | GlimpsedGameData)[];
  gameType: 'connections' | 'face-mash' | 'plot-fusion' | 'glimpsed';
  emptyMessage?: string;
}

const ArchiveGrid: React.FC<ArchiveGridProps> = ({ games, gameType, emptyMessage }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const currentYear = today.getFullYear();
    const gameYear = date.getFullYear();
    
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric'
    };
    
    // Add year in YY format if not current year
    if (gameYear !== currentYear) {
      options.year = '2-digit';
    }
    
    return date.toLocaleDateString('en-US', options);
  };

  const getGameNumber = (gameId: string) => {
    const match = gameId.match(/(\d+)$/);
    return match ? match[1] : '1';
  };

  const handleGameClick = (game: any) => {
    const gameNumber = getGameNumber(game.id);
    navigate(`/${gameType}/${gameNumber}`);
  };

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">
          {emptyMessage || 'No games available yet. Check back soon!'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => handleGameClick(game)}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-bollywood-teal hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center min-h-[100px]"
          >
            <div className="text-2xl font-bold text-gray-800 mb-2">
              #{getGameNumber(game.id)}
            </div>
            <div className="text-sm text-gray-600 text-center">
              {formatDate(game.date)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ArchiveGrid;
