import React, { useState, useEffect } from 'react';
import GameLayout from '../components/GameLayout';
import { ConnectionsGameData, ConnectionsGroup } from '../types/gameTypes';
import { getTodaysConnectionsGame } from '../data/connectionsData';
import { GameStorageManager, formatTimeRemaining } from '../utils/gameStorage';
import { GAME_CONFIG } from '../constants/gameConfig';

interface SelectedItem {
  item: string;
  groupId: string;
}

const ConnectionsGame: React.FC = () => {
  const [gameData, setGameData] = useState<ConnectionsGameData | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<{item: string, groupId: string}[]>([]);

  useEffect(() => {
    const game = getTodaysConnectionsGame();
    if (game) {
      setGameData(game);
      
      // Initialize shuffled items
      const allItems = game.groups
        .flatMap(group => group.items.map(item => ({ item, groupId: group.id })));
      setShuffledItems(allItems.sort(() => Math.random() - 0.5));
      
      // Check if game is on cooldown
      if (GameStorageManager.isGameOnCooldown('connections')) {
        setCooldownTime(GameStorageManager.getRemainingCooldownTime('connections'));
        startCooldownTimer();
      } else {
        // Load game progress
        const progress = GameStorageManager.getGameProgress(game.id);
        if (progress) {
          setAttempts(progress.attempts);
          setGameCompleted(progress.completed);
          // Load solved groups from progress (simplified for this example)
        }
      }
    }
  }, []);

  const startCooldownTimer = () => {
    const timer = setInterval(() => {
      const remaining = GameStorageManager.getRemainingCooldownTime('connections');
      setCooldownTime(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  };

  const handleItemClick = (item: string, groupId: string) => {
    if (gameCompleted || cooldownTime > 0) return;
    
    const itemIndex = selectedItems.findIndex(selected => selected.item === item);
    
    if (itemIndex >= 0) {
      // Deselect item
      setSelectedItems(selectedItems.filter((_, index) => index !== itemIndex));
    } else if (selectedItems.length < 4) {
      // Select item
      setSelectedItems([...selectedItems, { item, groupId }]);
    }
    
    setErrorMessage('');
  };

  const handleShuffle = () => {
    if (gameCompleted || cooldownTime > 0) return;
    
    const currentItems = gameData!.groups
      .filter(group => !solvedGroups.includes(group.id))
      .flatMap(group => group.items.map(item => ({ item, groupId: group.id })));
    
    setShuffledItems(currentItems.sort(() => Math.random() - 0.5));
  };

  const getClosenessMessage = (selectedItems: SelectedItem[]) => {
    // Count how many items belong to each group
    const groupCounts: { [key: string]: number } = {};
    selectedItems.forEach(selected => {
      groupCounts[selected.groupId] = (groupCounts[selected.groupId] || 0) + 1;
    });
    
    // Find the maximum count (closest group)
    const maxCount = Math.max(...Object.values(groupCounts));
    
    if (maxCount === 3) {
      return "So close! You were 1 away from the correct group.";
    } else if (maxCount === 2) {
      return "Getting warmer! You were 2 away from the correct group.";
    } else {
      return "Not quite right. Try a different combination!";
    }
  };

  const handleSubmit = () => {
    if (selectedItems.length !== 4 || gameCompleted || cooldownTime > 0) return;
    
    // Check if all selected items belong to the same group
    const firstGroupId = selectedItems[0].groupId;
    const allSameGroup = selectedItems.every(selected => selected.groupId === firstGroupId);
    
    if (allSameGroup && !solvedGroups.includes(firstGroupId)) {
      // Correct group found
      const newSolvedGroups = [...solvedGroups, firstGroupId];
      setSolvedGroups(newSolvedGroups);
      setSelectedItems([]);
      
      // Update shuffled items to remove solved group items
      const remainingItems = shuffledItems.filter(item => item.groupId !== firstGroupId);
      setShuffledItems(remainingItems);
      
      const newSolvedCount = newSolvedGroups.length;
      if (newSolvedCount === 4) {
        // Game completed
        setGameCompleted(true);
        GameStorageManager.updateLastPlayed('connections');
        GameStorageManager.updateUserStats('connections', true, attempts + 1, 100 - (attempts * 10));
        GameStorageManager.saveGameProgress(gameData!.id, {
          gameId: gameData!.id,
          status: 'completed',
          attempts: attempts + 1,
          hintsUsed: 0,
          startTime: Date.now() - (attempts * 30000), // Approximate
          endTime: Date.now(),
          score: 100 - (attempts * 10),
          completed: true
        });
      }
    } else {
      // Wrong group - provide better feedback
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setSelectedItems([]);
      setErrorMessage(getClosenessMessage(selectedItems));
      
      if (newAttempts >= GAME_CONFIG.MAX_ATTEMPTS) {
        // Game over - reveal all groups
        setGameOver(true);
        setGameCompleted(true);
        GameStorageManager.updateLastPlayed('connections');
        GameStorageManager.updateUserStats('connections', false, newAttempts);
        GameStorageManager.saveGameProgress(gameData!.id, {
          gameId: gameData!.id,
          status: 'completed',
          attempts: newAttempts,
          hintsUsed: 0,
          startTime: Date.now() - (newAttempts * 30000),
          endTime: Date.now(),
          completed: false
        });
      }
    }
  };

  const renderGroup = (group: ConnectionsGroup, isRevealed: boolean) => {
    if (isRevealed) {
      return (
        <div key={group.id} className={`${group.color} p-4 rounded-lg mb-4`}>
          <h3 className="font-bold text-white text-lg mb-2">{group.category}</h3>
          <div className="grid grid-cols-2 gap-2">
            {group.items.map((item, index) => (
              <div key={index} className="bg-white/20 p-2 rounded text-white text-center font-medium">
                {item}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return group.items.map((item, index) => (
      <button
        key={`${group.id}-${index}`}
        onClick={() => handleItemClick(item, group.id)}
        disabled={gameCompleted || cooldownTime > 0}
        className={`p-4 rounded-lg border-2 transition-all font-medium ${
          selectedItems.some(selected => selected.item === item)
            ? 'bg-bollywood-gold border-yellow-600 text-black'
            : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-800'
        } ${(gameCompleted || cooldownTime > 0) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {item}
      </button>
    ));
  };

  if (!gameData) {
    return (
      <GameLayout title="Connections" description="Loading game...">
        <div className="text-center py-8">Loading...</div>
      </GameLayout>
    );
  }

  if (cooldownTime > 0) {
    return (
      <GameLayout title="Connections" description="Find groups of 4 related Bollywood items">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Game on Cooldown</h2>
          <p className="text-gray-600 mb-4">
            You can play again in: <span className="font-bold text-bollywood-red">
              {formatTimeRemaining(cooldownTime)}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Each game can be played once every 12 hours.
          </p>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Connections" description="Find groups of 4 related Bollywood items">
      <div className="max-w-4xl mx-auto">
        {/* Game Status */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Attempts: {attempts}/{GAME_CONFIG.MAX_ATTEMPTS}
          </div>
          <div className="text-sm text-gray-600">
            Groups found: {solvedGroups.length}/4
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Game Completed Message */}
        {gameCompleted && (
          <div className={`${solvedGroups.length === 4 ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded mb-4`}>
            {solvedGroups.length === 4 ? 'Congratulations! You solved all groups!' : 'Game Over! Better luck next time.'}
          </div>
        )}

        {/* Solved Groups and Game Over Groups */}
        <div className="mb-6">
          {/* Show solved groups first in order they were solved */}
          {gameData.groups
            .filter(group => solvedGroups.includes(group.id))
            .sort((a, b) => solvedGroups.indexOf(a.id) - solvedGroups.indexOf(b.id))
            .map(group => renderGroup(group, true))}
          
          {/* Show remaining groups if game is over */}
          {gameOver && gameData.groups
            .filter(group => !solvedGroups.includes(group.id))
            .map(group => (
              <div key={group.id} className={`${group.color} p-4 rounded-lg mb-4 opacity-75`}>
                <h3 className="font-bold text-white text-lg mb-2">{group.category} (Not Found)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {group.items.map((item, index) => (
                    <div key={index} className="bg-white/20 p-2 rounded text-white text-center font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Game Grid - Hide when game is over */}
        {!gameOver && (
          <div className="mb-6">
            {/* Shuffle Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleShuffle}
                disabled={gameCompleted || cooldownTime > 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                title="Shuffle items"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                  />
                </svg>
                Shuffle
              </button>
            </div>
            
            {/* Items Grid */}
            <div className="grid grid-cols-4 gap-3">
              {shuffledItems.map(({ item, groupId }, index) => (
                <button
                  key={`${groupId}-${item}-${index}`}
                  onClick={() => handleItemClick(item, groupId)}
                  disabled={gameCompleted || cooldownTime > 0}
                  className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                    selectedItems.some(selected => selected.item === item)
                      ? 'bg-bollywood-gold border-yellow-600 text-black'
                      : 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-800'
                  } ${(gameCompleted || cooldownTime > 0) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controls - Hide when game is over */}
        {!gameOver && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setSelectedItems([])}
              disabled={selectedItems.length === 0 || gameCompleted || cooldownTime > 0}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedItems.length !== 4 || gameCompleted || cooldownTime > 0}
              className="px-6 py-2 bg-bollywood-red text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              Submit ({selectedItems.length}/4)
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 text-sm text-gray-600 text-center">
          <p>Select 4 items that belong to the same category and click Submit.</p>
          <p>You have {GAME_CONFIG.MAX_ATTEMPTS} attempts to find all groups.</p>
        </div>
      </div>
    </GameLayout>
  );
};

export default ConnectionsGame;
