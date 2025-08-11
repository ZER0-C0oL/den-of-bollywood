import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GAME_CONFIG } from '../constants/gameConfig';

interface GameNavItem {
  name: string;
  route: string;
  gameType: string;
}

const gameNavItems: GameNavItem[] = [
  { name: 'Connections', route: '/connections', gameType: GAME_CONFIG.GAMES.CONNECTIONS },
  { name: 'Face Mash', route: '/face-mash', gameType: GAME_CONFIG.GAMES.FACE_MASH },
  { name: 'Plot Fusion', route: '/plot-fusion', gameType: GAME_CONFIG.GAMES.PLOT_FUSION }
];

const GameNavigation: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  
  const currentGame = gameNavItems.find(item => item.route === location.pathname);
  const otherGames = gameNavItems.filter(item => item.route !== location.pathname);

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="bg-bollywood-gold text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition-colors flex items-center gap-2"
      >
        {currentGame ? currentGame.name : 'Select Game'}
        <svg 
          className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
          {otherGames.map((game) => (
            <Link
              key={game.route}
              to={game.route}
              className="block px-4 py-3 text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              {game.name}
            </Link>
          ))}
          <Link
            to="/"
            className="block px-4 py-3 text-gray-700 hover:bg-gray-100 last:rounded-b-lg transition-colors border-t border-gray-200"
            onClick={() => setIsDropdownOpen(false)}
          >
            Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default GameNavigation;
