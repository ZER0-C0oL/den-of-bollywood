import React, { useState, useEffect } from 'react';
import GameLayout from '../../GameLayout';
import ShareModal from '../../ShareModal';
import { ConnectionsGameData } from '../../../types/gameTypes';
import { getTodaysConnectionsGame } from '../../../data/connectionsData';
import { generateConnectionsShareText, ConnectionsShareData } from '../../../utils/shareUtils';
import { GameStorageManager } from '../../../utils/gameStorage';
import { GAME_CONFIG } from '../../../constants/gameConfig';
import { CooldownService, CooldownState } from '../../../services/cooldownService';
import { 
  ConnectionsGameService, 
  SelectedItem
} from './ConnectionsGameService';
import ConnectionsGrid from './ConnectionsGrid';
import SolvedGroups from './SolvedGroups';
import ConnectionsControls from './ConnectionsControls';
import ConnectionsCooldownView from './ConnectionsCooldownView';

const ConnectionsGame: React.FC = () => {
  const [gameData, setGameData] = useState<ConnectionsGameData | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [cooldownState, setCooldownState] = useState<CooldownState>({
    isOnCooldown: false,
    remainingTime: 0,
    formattedTime: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<{item: string, groupId: string}[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [attemptResults, setAttemptResults] = useState<('correct' | 'one_away' | 'wrong')[]>([]);

  useEffect(() => {
    const game = getTodaysConnectionsGame();
    if (game) {
      setGameData(game);
      
      // Check cooldown state
      const initialCooldownState = CooldownService.getCooldownState('connections');
      setCooldownState(initialCooldownState);
      
      if (initialCooldownState.isOnCooldown) {
        // Start cooldown timer
        const cleanup = CooldownService.startCooldownTimer('connections', setCooldownState);
        return cleanup;
      } else {
        // Load game progress
        const progress = ConnectionsGameService.loadGameProgress(game.id);
        const loadedSolvedGroups = progress.solvedGroups || [];
        
        // Auto-complete if 3 groups are already solved
        let finalSolvedGroups = loadedSolvedGroups;
        let finalGameCompleted = progress.gameCompleted || false;
        
        if (loadedSolvedGroups.length === 3 && !finalGameCompleted) {
          // Find the remaining unsolved group and auto-complete
          const remainingGroup = game.groups.find(group => 
            !loadedSolvedGroups.includes(group.id)
          );
          
          if (remainingGroup) {
            finalSolvedGroups = [...loadedSolvedGroups, remainingGroup.id];
            finalGameCompleted = true;
            
            // Update storage with completed game
            GameStorageManager.saveGameProgress(game.id, {
              gameId: game.id,
              status: 'completed',
              attempts: progress.attempts || 0,
              hintsUsed: 0,
              startTime: Date.now() - ((progress.attempts || 0) * 30000),
              endTime: Date.now(),
              score: 100 - ((progress.attempts || 0) * 10),
              completed: true,
              gameState: {
                solvedGroups: finalSolvedGroups
              },
              attemptResults: progress.attemptResults || []
            });
          }
        }
        
        setAttempts(progress.attempts || 0);
        setGameCompleted(finalGameCompleted);
        setSolvedGroups(finalSolvedGroups);
        setAttemptResults(progress.attemptResults || []);
        
        // Initialize shuffled items excluding already solved groups
        if (finalSolvedGroups.length > 0) {
          const remainingItems = ConnectionsGameService.shuffleRemainingItems(game, finalSolvedGroups);
          setShuffledItems(remainingItems);
        } else {
          setShuffledItems(ConnectionsGameService.initializeShuffledItems(game));
        }
        
        // If game is completed, set cooldown state
        if (finalGameCompleted) {
          const cooldownState = CooldownService.getCooldownState('connections');
          setCooldownState(cooldownState);
          
          if (cooldownState.isOnCooldown) {
            CooldownService.startCooldownTimer('connections', setCooldownState);
          }
        }
      }
    }
  }, []);

  const handleItemClick = (item: string, groupId: string) => {
    if (gameCompleted || cooldownState.isOnCooldown) return;
    
    if (!ConnectionsGameService.canSelectItem(selectedItems, item)) return;
    
    const newSelectedItems = ConnectionsGameService.toggleItemSelection(selectedItems, item, groupId);
    setSelectedItems(newSelectedItems);
    setErrorMessage('');
  };

  const handleShuffle = () => {
    if (gameCompleted || cooldownState.isOnCooldown) return;
    
    const newShuffledItems = ConnectionsGameService.shuffleRemainingItems(gameData!, solvedGroups);
    setShuffledItems(newShuffledItems);
  };

  const handleSubmit = () => {
    if (selectedItems.length !== 4 || gameCompleted || cooldownState.isOnCooldown) return;
    
    const matchResult = ConnectionsGameService.checkGroupMatch(selectedItems, solvedGroups);
    
    if (matchResult.isCorrect && matchResult.groupId) {
      // Correct group found
      const result = ConnectionsGameService.processCorrectSubmission(
        gameData!,
        matchResult.groupId,
        solvedGroups,
        shuffledItems,
        attempts,
        attemptResults
      );
      
      // Check if we now have 3 groups solved - if so, auto-solve the 4th
      let finalSolvedGroups = result.newSolvedGroups;
      let finalAttemptResults = result.newAttemptResults;
      let finalGameCompleted = result.gameCompleted;
      
      if (result.newSolvedGroups.length === 3) {
        // Find the remaining unsolved group
        const remainingGroup = gameData!.groups.find(group => 
          !result.newSolvedGroups.includes(group.id)
        );
        
        if (remainingGroup) {
          finalSolvedGroups = [...result.newSolvedGroups, remainingGroup.id];
          finalGameCompleted = true;
          
          // Update last played and stats for completing the game
          GameStorageManager.updateLastPlayed('connections');
          GameStorageManager.updateUserStats('connections', true, attempts + 1, 100 - ((attempts + 1) * 10));
        }
      }
      
      // Update state immediately
      setSolvedGroups(finalSolvedGroups);
      // Update shuffled items based on game completion status
      if (finalGameCompleted) {
        setShuffledItems([]); // Clear shuffled items when game is completed
      } else {
        // Update shuffled items to show remaining unsolved groups
        const remainingItems = ConnectionsGameService.shuffleRemainingItems(gameData!, finalSolvedGroups);
        setShuffledItems(remainingItems);
      }
      setAttemptResults(finalAttemptResults);
      setGameCompleted(finalGameCompleted);
      setSelectedItems([]);
      
      // Save progress with the updated values immediately
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      GameStorageManager.saveGameProgress(gameData!.id, {
        gameId: gameData!.id,
        status: finalGameCompleted ? 'completed' : 'in_progress',
        attempts: newAttempts,
        hintsUsed: 0,
        startTime: Date.now() - (newAttempts * 30000),
        endTime: finalGameCompleted ? Date.now() : undefined,
        score: finalGameCompleted ? 100 - (newAttempts * 10) : undefined,
        completed: finalGameCompleted,
        gameState: {
          solvedGroups: finalSolvedGroups
        },
        attemptResults: finalAttemptResults
      });
      
      // If game is completed, trigger cooldown immediately
      if (finalGameCompleted) {
        const newCooldownState = CooldownService.getCooldownState('connections');
        setCooldownState(newCooldownState);
        
        if (newCooldownState.isOnCooldown) {
          CooldownService.startCooldownTimer('connections', setCooldownState);
        }
      }
    } else {
      // Wrong group
      const result = ConnectionsGameService.processIncorrectSubmission(
        gameData!,
        selectedItems,
        attempts,
        solvedGroups,
        attemptResults,
        matchResult.isOneAway
      );
      
      setAttempts(result.newAttempts);
      setAttemptResults(result.newAttemptResults);
      setErrorMessage(result.errorMessage);
      setGameOver(result.gameOver);
      setGameCompleted(result.gameCompleted);
      setSelectedItems([]);
    }
  };

  const generateShareData = (): ConnectionsShareData => {
    return {
      gameId: gameData!.id,
      gameWon: solvedGroups.length === 4,
      totalAttempts: attempts,
      maxAttempts: GAME_CONFIG.MAX_ATTEMPTS,
      solvedGroups: solvedGroups,
      attemptResults: attemptResults
    };
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  if (!gameData) {
    return (
      <GameLayout title="Connections" description="Loading game...">
        <div className="text-center py-8">Loading...</div>
      </GameLayout>
    );
  }

  if (cooldownState.isOnCooldown) {
    return (
      <GameLayout title="Connections" description="Find groups of 4 related Bollywood items">
        <ConnectionsCooldownView 
          cooldownState={cooldownState}
          onShare={handleShare}
        />
      </GameLayout>
    );
  }

  const isDisabled = gameCompleted || cooldownState.isOnCooldown;
  const shouldShowGrid = !gameOver && solvedGroups.length < 4;

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
            <div className="flex justify-between items-center">
              <span>
                {solvedGroups.length === 4 ? 'Congratulations! You solved all groups!' : 'Game Over! Better luck next time.'}
              </span>
              <button
                onClick={handleShare}
                className="ml-4 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm border border-gray-300"
              >
                📤 Share Result
              </button>
            </div>
          </div>
        )}

        {/* Solved Groups */}
        <SolvedGroups 
          groups={gameData.groups}
          solvedGroups={solvedGroups}
          gameOver={gameOver}
        />

        {/* Game Grid - Hide only when all groups are solved or game is over */}
        {shouldShowGrid && (
          <div className="mb-6">
            {/* Items Grid */}
            <ConnectionsGrid
              shuffledItems={shuffledItems}
              selectedItems={selectedItems}
              onItemClick={handleItemClick}
              disabled={isDisabled}
            />
            
            {/* All Controls (Shuffle, Clear, Submit) */}
            <ConnectionsControls
              selectedItems={selectedItems}
              onClearSelection={handleClearSelection}
              onSubmit={handleSubmit}
              onShuffle={handleShuffle}
              disabled={isDisabled}
            />
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 text-sm text-gray-600 text-center">
          <p>Select 4 items that belong to the same category and click Submit.</p>
          <p>You have {GAME_CONFIG.MAX_ATTEMPTS} attempts to find all groups.</p>
        </div>
      </div>

      {/* Share Modal */}
      {(gameCompleted || cooldownState.isOnCooldown) && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareText={generateConnectionsShareText(generateShareData())}
          gameTitle="Connections Result"
        />
      )}
    </GameLayout>
  );
};

export default ConnectionsGame;
