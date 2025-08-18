import React from 'react';
import { Link } from 'react-router-dom';
import GameLayout from '../components/GameLayout';
import { GameStorageManager } from '../utils/gameStorage';
import { GAME_CONFIG } from '../constants/gameConfig';
import { getTodaysConnectionsGame } from '../data/connectionsData';
import { getTodaysFaceMashGame } from '../data/faceMashData';
import { getTodaysPlotFusionGame } from '../data/plotFusionData';
import { getTodaysGlimpsedGame } from '../data/glimpsedData';

const HomePage: React.FC = () => {
  const userStats = GameStorageManager.getUserStats();
  const connectionsOnCooldown = GameStorageManager.isGameOnCooldown('connections');
  const faceMashOnCooldown = GameStorageManager.isGameOnCooldown('face-mash');
  const plotFusionOnCooldown = GameStorageManager.isGameOnCooldown('plot-fusion');
  const glimpsedOnCooldown = GameStorageManager.isGameOnCooldown('glimpsed');

  // Check if today's games are completed
  const todaysConnectionsGame = getTodaysConnectionsGame();
  const todaysFaceMashGame = getTodaysFaceMashGame();
  const todaysPlotFusionGame = getTodaysPlotFusionGame();
  const todaysGlimpsedGame = getTodaysGlimpsedGame();
  
  const connectionsProgress = todaysConnectionsGame ? 
    GameStorageManager.getGameProgress(todaysConnectionsGame.id) : null;
  const faceMashProgress = todaysFaceMashGame ? 
    GameStorageManager.getGameProgress(todaysFaceMashGame.id) : null;
  const plotFusionProgress = todaysPlotFusionGame ? 
    GameStorageManager.getGameProgress(todaysPlotFusionGame.id) : null;
  const glimpsedProgress = todaysGlimpsedGame ? 
    GameStorageManager.getGameProgress(todaysGlimpsedGame.id) : null;

  // Function to determine game status
  const getGameStatus = (progress: any, gameType: 'connections' | 'face-mash' | 'plot-fusion' | 'glimpsed') => {
    if (!progress) return 'not_started';
    
    if (progress.completed) {
      if (gameType === 'connections') {
        return progress.gameState?.solvedGroups?.length === 4 ? 'solved' : 'unsolved';
      } else if (gameType === 'face-mash') {
        return (progress.gameState?.actor1State?.found && progress.gameState?.actor2State?.found) ? 'solved' : 'unsolved';
      } else if (gameType === 'plot-fusion') {
        return (progress.gameState?.movie1State?.found && progress.gameState?.movie2State?.found) ? 'solved' : 'unsolved';
      } else if (gameType === 'glimpsed') {
        return progress.gameState?.movieFound ? 'solved' : 'unsolved';
      }
    }
    
    // Only return in_progress if game has attempts but is not completed
    return progress.attempts > 0 ? 'in_progress' : 'not_started';
  };

  const connectionsStatus = getGameStatus(connectionsProgress, 'connections');
  const faceMashStatus = getGameStatus(faceMashProgress, 'face-mash');
  const plotFusionStatus = getGameStatus(plotFusionProgress, 'plot-fusion');
  const glimpsedStatus = getGameStatus(glimpsedProgress, 'glimpsed');

  const gameCards = [
    {
      title: 'Connections',
      description: 'Find groups of 4 related Bollywood items. Movies, actors, directors, and more!',
      route: '/connections',
      gameType: 'connections' as const,
      onCooldown: connectionsOnCooldown,
      status: connectionsStatus,
      stats: userStats.gameStats.connections
    },
    {
      title: 'Face Mash',
      description: 'Guess both actors from their merged faces. Test your Bollywood recognition skills!',
      route: '/face-mash',
      gameType: 'face-mash' as const,
      onCooldown: faceMashOnCooldown,
      status: faceMashStatus,
      stats: userStats.gameStats['face-mash']
    },
    {
      title: 'Plot Fusion',
      description: 'Two movie plots combined into one! Can you identify both Bollywood films?',
      route: '/plot-fusion',
      gameType: 'plot-fusion' as const,
      onCooldown: plotFusionOnCooldown,
      status: plotFusionStatus,
      stats: userStats.gameStats['plot-fusion']
    },
    {
      title: 'Glimpsed',
      description: 'Guess the Bollywood movie from frames shown one by one. More frames unlock with wrong guesses!',
      route: '/glimpsed',
      gameType: 'glimpsed' as const,
      onCooldown: glimpsedOnCooldown,
      status: glimpsedStatus,
      stats: userStats.gameStats.glimpsed
    }
  ];

  return (
    <GameLayout title="" description="">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Den of Bollywood!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your Bollywood knowledge with our daily games. Each game can be played once every 12 hours, 
            so make every attempt count!
          </p>

          {/* User Stats Card */}
          {userStats.totalGamesPlayed > 0 && (
            <div className="mt-2 md:absolute md:top-0 md:left-0 bg-bollywood-veryLightBlue border border-gray-200 rounded-lg shadow-sm p-3 text-xs z-10 inline-block">
              <div className="text-center mb-1">
                <div className="font-bold text-black-700 text-xs">Your Stats</div>
              </div>
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="font-bold text-gray-800">{userStats.totalGamesPlayed}</div>
                  <div className="text-gray-500 text-xs font-semibold">Played</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">{userStats.totalGamesCompleted}</div>
                  <div className="text-gray-500 text-xs font-semibold">Won</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">{userStats.streakCount}</div>
                  <div className="text-gray-500 text-xs font-semibold">Streak</div>
                </div>
              </div>
            </div>
          )}
        </div>

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
                  <div className="flex gap-2">
                    {game.status === 'solved' && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="text-green-600">✓</span>
                        Solved
                      </span>
                    )}
                    {game.status === 'unsolved' && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="text-red-600">✗</span>
                        Unsolved
                      </span>
                    )}
                    {game.status === 'in_progress' && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{game.description}</p>
                
                {/* Game Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <div className="font-semibold text-gray-800">{game.stats?.played || 0}</div>
                    <div className="text-gray-600 text-xs">Played</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <div className="font-semibold text-gray-800">{game.stats?.completed || 0}</div>
                    <div className="text-gray-600 text-xs">Completed</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-center">
                    <div className="font-semibold text-gray-800">
                      {game.stats?.averageAttempts && game.stats.averageAttempts > 0 ? Math.round(game.stats.averageAttempts * 10) / 10 : '-'}
                    </div>
                    <div className="text-gray-600 text-xs">Avg Attempts</div>
                  </div>
                </div>
                
                <Link
                  to={game.route}
                  className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                    game.status === 'solved'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : game.status === 'unsolved'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : game.status === 'in_progress'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-bollywood-red text-white hover:bg-red-700'
                  }`}
                >
                  {game.status === 'solved'
                    ? 'View Solution'
                    : game.status === 'unsolved'
                    ? 'View Attempt'
                    : game.status === 'in_progress'
                    ? 'Continue Game'
                    : 'Play Now'
                  }
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
      </div>
    </GameLayout>
  );
};

export default HomePage;
