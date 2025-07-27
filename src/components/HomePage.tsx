import React from 'react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import { GameStorageManager } from '../utils/gameStorage';
import { GAME_CONFIG } from '../constants/gameConfig';

const HomePage: React.FC = () => {
  const userStats = GameStorageManager.getUserStats();
  const connectionsOnCooldown = GameStorageManager.isGameOnCooldown('connections');
  const faceMashOnCooldown = GameStorageManager.isGameOnCooldown('face-mash');

  const gameCards = [
    {
      title: 'Connections',
      description: 'Find groups of 4 related Bollywood items. Movies, actors, directors, and more!',
      route: '/connections',
      gameType: 'connections' as const,
      onCooldown: connectionsOnCooldown,
      stats: userStats.gameStats.connections
    },
    {
      title: 'Face Mash',
      description: 'Guess both actors from their merged faces. Test your Bollywood recognition skills!',
      route: '/face-mash',
      gameType: 'face-mash' as const,
      onCooldown: faceMashOnCooldown,
      stats: userStats.gameStats['face-mash']
    }
  ];

  return (
    <GameLayout title="Den of Bollywood" description="Daily Bollywood Gaming Challenge">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Den of Bollywood!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your Bollywood knowledge with our daily games. Each game can be played once every 12 hours, 
            so make every attempt count!
          </p>
        </div>

        {/* User Stats Overview */}
        {userStats.totalGamesPlayed > 0 && (
          <div className="bg-gradient-to-r from-bollywood-gold to-yellow-400 p-6 rounded-lg mb-8 text-center">
            <h2 className="text-2xl font-bold text-black mb-4">Your Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-black">{userStats.totalGamesPlayed}</div>
                <div className="text-sm text-black/80">Games Played</div>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-black">{userStats.totalGamesCompleted}</div>
                <div className="text-sm text-black/80">Games Completed</div>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-black">{userStats.streakCount}</div>
                <div className="text-sm text-black/80">Current Streak</div>
              </div>
              <div className="bg-white/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-black">
                  {Math.round(userStats.averageAttempts * 10) / 10}
                </div>
                <div className="text-sm text-black/80">Avg Attempts</div>
              </div>
            </div>
          </div>
        )}

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {gameCards.map((game) => (
            <div
              key={game.gameType}
              className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{game.title}</h3>
                  {game.onCooldown && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      On Cooldown
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-6">{game.description}</p>
                
                {/* Game Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-semibold text-gray-800">{game.stats.played}</div>
                    <div className="text-gray-600">Played</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-semibold text-gray-800">{game.stats.completed}</div>
                    <div className="text-gray-600">Completed</div>
                  </div>
                </div>
                
                <Link
                  to={game.route}
                  className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                    game.onCooldown
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-bollywood-red text-white hover:bg-red-700'
                  }`}
                  onClick={(e) => {
                    if (game.onCooldown) {
                      e.preventDefault();
                    }
                  }}
                >
                  {game.onCooldown ? 'On Cooldown' : 'Play Now'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Game Rules */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Game Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">General Rules</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Each game can be played once every {GAME_CONFIG.COOLDOWN_PERIOD / (1000 * 60 * 60)} hours</li>
                <li>• You have {GAME_CONFIG.MAX_ATTEMPTS} attempts per game</li>
                <li>• Hints are provided after wrong attempts</li>
                <li>• Your progress is saved locally</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Scoring</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Points decrease with more attempts</li>
                <li>• Bonus points for completing without hints</li>
                <li>• Streak bonuses for consecutive completions</li>
                <li>• Stats are tracked across all games</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>New games and features coming soon! Follow your progress and compete with friends.</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default HomePage;
