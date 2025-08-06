import { GameStorageManager } from '../utils/gameStorage';
import { GameType } from '../types/gameTypes';

/**
 * Common game state management utilities
 */
export class GameStateService {
  /**
   * Save game state with common properties
   */
  static saveGameState(
    gameId: string,
    gameType: GameType,
    state: {
      attempts: number;
      completed: boolean;
      won?: boolean;
      hintsUsed?: number;
      score?: number;
      gameState?: any;
      startTime?: number;
      endTime?: number;
    }
  ): void {
    GameStorageManager.saveGameProgress(gameId, {
      gameId,
      status: state.completed ? 'completed' : 'in_progress',
      attempts: state.attempts,
      hintsUsed: state.hintsUsed || 0,
      startTime: state.startTime || Date.now() - (state.attempts * 60000),
      endTime: state.completed ? (state.endTime || Date.now()) : undefined,
      score: state.score,
      completed: state.completed,
      gameState: state.gameState
    });

    if (state.completed) {
      GameStorageManager.updateLastPlayed(gameType);
      if (state.won !== undefined) {
        GameStorageManager.updateUserStats(
          gameType,
          state.won,
          state.attempts,
          state.score
        );
      }
    }
  }

  /**
   * Load game state with common properties
   */
  static loadGameState(gameId: string): {
    attempts: number;
    completed: boolean;
    gameState?: any;
    hintsUsed: number;
    score?: number;
  } | null {
    const progress = GameStorageManager.getGameProgress(gameId);
    if (!progress) return null;

    return {
      attempts: progress.attempts,
      completed: progress.completed,
      gameState: progress.gameState,
      hintsUsed: progress.hintsUsed || 0,
      score: progress.score
    };
  }

  /**
   * Check if a game should be completed based on attempts and max attempts
   */
  static shouldCompleteGame(attempts: number, maxAttempts: number): boolean {
    return attempts >= maxAttempts;
  }

  /**
   * Create initial game state
   */
  static createInitialState<T>(gameSpecificState: T): T & {
    attempts: number;
    completed: boolean;
    hintsUsed: number;
  } {
    return {
      ...gameSpecificState,
      attempts: 0,
      completed: false,
      hintsUsed: 0
    };
  }

  /**
   * Update attempts and check completion
   */
  static updateAttempts<T extends { attempts: number; completed: boolean }>(
    state: T,
    maxAttempts: number
  ): T {
    const newAttempts = state.attempts + 1;
    const shouldComplete = this.shouldCompleteGame(newAttempts, maxAttempts);
    
    return {
      ...state,
      attempts: newAttempts,
      completed: shouldComplete || state.completed
    };
  }

  /**
   * Add hints used to state
   */
  static addHints<T extends { hintsUsed?: number }>(
    state: T,
    hintsAdded: number = 1
  ): T {
    return {
      ...state,
      hintsUsed: (state.hintsUsed || 0) + hintsAdded
    };
  }

  /**
   * Mark game as completed
   */
  static completeGame<T extends { completed: boolean }>(
    state: T,
    won: boolean = false
  ): T & { completed: true; won: boolean } {
    return {
      ...state,
      completed: true,
      won
    };
  }

  /**
   * Get game summary for sharing
   */
  static getGameSummary(
    gameId: string,
    gameType: GameType,
    gameName: string
  ): {
    gameId: string;
    gameType: GameType;
    gameName: string;
    attempts: number;
    completed: boolean;
    score?: number;
    hintsUsed: number;
  } | null {
    const state = this.loadGameState(gameId);
    if (!state) return null;

    return {
      gameId,
      gameType,
      gameName,
      attempts: state.attempts,
      completed: state.completed,
      score: state.score,
      hintsUsed: state.hintsUsed
    };
  }
}
