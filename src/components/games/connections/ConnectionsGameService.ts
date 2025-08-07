import { ConnectionsGameData } from '../../../types/gameTypes';
import { GameStorageManager } from '../../../utils/gameStorage';
import { GAME_CONFIG } from '../../../constants/gameConfig';

export interface SelectedItem {
  item: string;
  groupId: string;
}

export interface ConnectionsGameState {
  selectedItems: SelectedItem[];
  solvedGroups: string[];
  attempts: number;
  gameCompleted: boolean;
  gameOver: boolean;
  shuffledItems: { item: string; groupId: string }[];
  errorMessage: string;
  attemptResults: ('correct' | 'one_away' | 'wrong')[];
}

export class ConnectionsGameService {
  /**
   * Initialize shuffled items from game data
   */
  static initializeShuffledItems(gameData: ConnectionsGameData): { item: string; groupId: string }[] {
    const allItems = gameData.groups
      .flatMap(group => group.items.map(item => ({ item, groupId: group.id })));
    return allItems.sort(() => Math.random() - 0.5);
  }

  /**
   * Load game progress from storage
   */
  static loadGameProgress(gameId: string): Partial<ConnectionsGameState> {
    const progress = GameStorageManager.getGameProgress(gameId);
    if (!progress) return {};

    return {
      attempts: progress.attempts,
      gameCompleted: progress.completed,
      solvedGroups: progress.gameState?.solvedGroups || [],
      attemptResults: (progress.attemptResults as ('correct' | 'one_away' | 'wrong')[]) || []
    };
  }

  /**
   * Check if an item can be selected
   */
  static canSelectItem(selectedItems: SelectedItem[], item: string): boolean {
    const itemIndex = selectedItems.findIndex(selected => selected.item === item);
    return itemIndex >= 0 || selectedItems.length < 4;
  }

  /**
   * Toggle item selection
   */
  static toggleItemSelection(
    selectedItems: SelectedItem[], 
    item: string, 
    groupId: string
  ): SelectedItem[] {
    const itemIndex = selectedItems.findIndex(selected => selected.item === item);
    
    if (itemIndex >= 0) {
      // Deselect item
      return selectedItems.filter((_, index) => index !== itemIndex);
    } else if (selectedItems.length < 4) {
      // Select item
      return [...selectedItems, { item, groupId }];
    }
    
    return selectedItems;
  }

  /**
   * Shuffle remaining items (excluding solved groups)
   */
  static shuffleRemainingItems(
    gameData: ConnectionsGameData, 
    solvedGroups: string[]
  ): { item: string; groupId: string }[] {
    const currentItems = gameData.groups
      .filter(group => !solvedGroups.includes(group.id))
      .flatMap(group => group.items.map(item => ({ item, groupId: group.id })));
    
    return currentItems.sort(() => Math.random() - 0.5);
  }

  /**
   * Get closeness message based on selected items
   */
  static getClosenessMessage(selectedItems: SelectedItem[]): string {
    const groupCounts: { [key: string]: number } = {};
    selectedItems.forEach(selected => {
      groupCounts[selected.groupId] = (groupCounts[selected.groupId] || 0) + 1;
    });
    
    const maxCount = Math.max(...Object.values(groupCounts));
    
    if (maxCount === 3) {
      return "So close! You were 1 away from the correct group.";
    } else if (maxCount === 2) {
      return "Getting warmer! You were 2 away from the correct group.";
    } else {
      return "Not quite right. Try a different combination!";
    }
  }

  /**
   * Check if selected items form a correct group
   */
  static checkGroupMatch(selectedItems: SelectedItem[], solvedGroups: string[]): {
    isCorrect: boolean;
    groupId: string | null;
    isOneAway: boolean;
  } {
    if (selectedItems.length !== 4) {
      return { isCorrect: false, groupId: null, isOneAway: false };
    }

    const firstGroupId = selectedItems[0].groupId;
    const allSameGroup = selectedItems.every(selected => selected.groupId === firstGroupId);
    
    if (allSameGroup && !solvedGroups.includes(firstGroupId)) {
      return { isCorrect: true, groupId: firstGroupId, isOneAway: false };
    }

    // Check if one away
    const groupCounts: { [key: string]: number } = {};
    selectedItems.forEach(selected => {
      groupCounts[selected.groupId] = (groupCounts[selected.groupId] || 0) + 1;
    });
    
    const maxCount = Math.max(...Object.values(groupCounts));
    const isOneAway = maxCount === 3;

    return { isCorrect: false, groupId: null, isOneAway };
  }

  /**
   * Process a correct group submission
   */
  static processCorrectSubmission(
    gameData: ConnectionsGameData,
    groupId: string,
    solvedGroups: string[],
    shuffledItems: { item: string; groupId: string }[],
    attempts: number,
    attemptResults: ('correct' | 'one_away' | 'wrong')[]
  ): {
    newSolvedGroups: string[];
    newShuffledItems: { item: string; groupId: string }[];
    newAttemptResults: ('correct' | 'one_away' | 'wrong')[];
    gameCompleted: boolean;
  } {
    const newSolvedGroups = [...solvedGroups, groupId];
    const newShuffledItems = shuffledItems.filter(item => item.groupId !== groupId);
    const newAttemptResults = [...attemptResults, 'correct' as const];
    const gameCompleted = newSolvedGroups.length === 4;

    // Only update stats when game is completed, progress is saved in the component
    if (gameCompleted) {
      GameStorageManager.updateLastPlayed('connections');
      GameStorageManager.updateUserStats('connections', true, attempts + 1, 100 - (attempts * 10));
    }

    return {
      newSolvedGroups,
      newShuffledItems,
      newAttemptResults,
      gameCompleted
    };
  }

  /**
   * Process an incorrect group submission
   */
  static processIncorrectSubmission(
    gameData: ConnectionsGameData,
    selectedItems: SelectedItem[],
    attempts: number,
    solvedGroups: string[],
    attemptResults: ('correct' | 'one_away' | 'wrong')[],
    isOneAway: boolean,
    wrongAttempts: number
  ): {
    newAttempts: number;
    newAttemptResults: ('correct' | 'one_away' | 'wrong')[];
    errorMessage: string;
    gameOver: boolean;
    gameCompleted: boolean;
  } {
    const newAttempts = attempts + 1;
    const newAttemptResults = [...attemptResults, isOneAway ? 'one_away' as const : 'wrong' as const];
    const errorMessage = this.getClosenessMessage(selectedItems);
    const newWrongAttempts = wrongAttempts + 1;
    const gameOver = newWrongAttempts >= GAME_CONFIG.MAX_ATTEMPTS;
    const gameCompleted = gameOver;

    // Save progress
    GameStorageManager.saveGameProgress(gameData.id, {
      gameId: gameData.id,
      status: gameOver ? 'completed' : 'in_progress',
      attempts: newAttempts,
      hintsUsed: 0,
      startTime: Date.now() - (newAttempts * 30000),
      completed: gameOver,
      gameState: {
        solvedGroups: solvedGroups
      },
      attemptResults: newAttemptResults
    });

    if (gameOver) {
      GameStorageManager.updateLastPlayed('connections');
      GameStorageManager.updateUserStats('connections', false, newAttempts);
    }

    return {
      newAttempts,
      newAttemptResults,
      errorMessage,
      gameOver,
      gameCompleted
    };
  }

  /**
   * Get group visual styling
   */
  static getGroupStyling(groupIndex: number): { backgroundColor: string; borderColor: string } {
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    const color = colors[groupIndex];
    
    return {
      backgroundColor: color + '20',
      borderColor: color
    };
  }
}
