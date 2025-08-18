import { STORAGE_KEYS, GAME_CONFIG } from '../constants/gameConfig';
import { GameProgress, UserStats, GameType } from '../types/gameTypes';

export class GameStorageManager {
  // Get game progress for a specific game
  static getGameProgress(gameId: string): GameProgress | null {
    try {
      const progressData = localStorage.getItem(STORAGE_KEYS.GAME_PROGRESS);
      if (!progressData) return null;
      
      const allProgress: Record<string, GameProgress> = JSON.parse(progressData);
      return allProgress[gameId] || null;
    } catch (error) {
      console.error('Error getting game progress:', error);
      return null;
    }
  }

  // Save game progress
  static saveGameProgress(gameId: string, progress: GameProgress): void {
    try {
      const progressData = localStorage.getItem(STORAGE_KEYS.GAME_PROGRESS);
      const allProgress: Record<string, GameProgress> = progressData ? JSON.parse(progressData) : {};
      
      allProgress[gameId] = progress;
      localStorage.setItem(STORAGE_KEYS.GAME_PROGRESS, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving game progress:', error);
    }
  }

  // Check if a game is on cooldown
  static isGameOnCooldown(gameType: GameType): boolean {
    try {
      const lastPlayedData = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
      if (!lastPlayedData) return false;
      
      const lastPlayed: Record<GameType, number> = JSON.parse(lastPlayedData);
      const lastPlayedTime = lastPlayed[gameType];
      
      if (!lastPlayedTime) return false;
      
      const now = Date.now();
      const timeDiff = now - lastPlayedTime;
      
      return timeDiff < GAME_CONFIG.COOLDOWN_PERIOD;
    } catch (error) {
      console.error('Error checking game cooldown:', error);
      return false;
    }
  }

  // Get remaining cooldown time in milliseconds
  static getRemainingCooldownTime(gameType: GameType): number {
    try {
      const lastPlayedData = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
      if (!lastPlayedData) return 0;
      
      const lastPlayed: Record<GameType, number> = JSON.parse(lastPlayedData);
      const lastPlayedTime = lastPlayed[gameType];
      
      if (!lastPlayedTime) return 0;
      
      const now = Date.now();
      const timeDiff = now - lastPlayedTime;
      const remaining = GAME_CONFIG.COOLDOWN_PERIOD - timeDiff;
      
      return Math.max(0, remaining);
    } catch (error) {
      console.error('Error getting remaining cooldown time:', error);
      return 0;
    }
  }

  // Update last played time for a game
  static updateLastPlayed(gameType: GameType): void {
    try {
      const lastPlayedData = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
      const lastPlayed: Record<GameType, number> = lastPlayedData ? JSON.parse(lastPlayedData) : {};
      
      lastPlayed[gameType] = Date.now();
      localStorage.setItem(STORAGE_KEYS.LAST_PLAYED, JSON.stringify(lastPlayed));
    } catch (error) {
      console.error('Error updating last played time:', error);
    }
  }

  // Get user stats
  static getUserStats(): UserStats {
    try {
      const statsData = localStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (!statsData) {
        return this.getDefaultUserStats();
      }
      
      const stats = JSON.parse(statsData);
      
      // Migration: Add missing game types to existing stats
      const defaultStats = this.getDefaultUserStats();
      if (!stats.gameStats) {
        stats.gameStats = defaultStats.gameStats;
      } else {
        // Ensure all game types exist
        for (const gameType of ['connections', 'face-mash', 'plot-fusion'] as const) {
          if (!stats.gameStats[gameType]) {
            stats.gameStats[gameType] = defaultStats.gameStats[gameType];
          }
        }
      }
      
      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return this.getDefaultUserStats();
    }
  }

  // Save user stats
  static saveUserStats(stats: UserStats): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }

  // Update user stats after completing a game
  static updateUserStats(gameType: GameType, completed: boolean, attempts: number, score?: number): void {
    const stats = this.getUserStats();
    
    stats.totalGamesPlayed++;
    stats.lastPlayedDate = new Date().toISOString();
    
    if (completed) {
      stats.totalGamesCompleted++;
      stats.streakCount++;
    } else {
      stats.streakCount = 0;
    }
    
    // Update game-specific stats
    if (!stats.gameStats[gameType]) {
      stats.gameStats[gameType] = {
        played: 0,
        completed: 0,
        bestScore: 0,
        averageAttempts: 0
      };
    }
    
    const gameStats = stats.gameStats[gameType];
    gameStats.played++;
    
    if (completed) {
      gameStats.completed++;
      if (score !== undefined && score > gameStats.bestScore) {
        gameStats.bestScore = score;
      }
    }
    
    // Calculate average attempts
    gameStats.averageAttempts = (gameStats.averageAttempts * (gameStats.played - 1) + attempts) / gameStats.played;
    stats.averageAttempts = (stats.averageAttempts * (stats.totalGamesPlayed - 1) + attempts) / stats.totalGamesPlayed;
    
    this.saveUserStats(stats);
  }

  // Get default user stats
  private static getDefaultUserStats(): UserStats {
    return {
      totalGamesPlayed: 0,
      totalGamesCompleted: 0,
      averageAttempts: 0,
      streakCount: 0,
      lastPlayedDate: '',
      gameStats: {
        'connections': {
          played: 0,
          completed: 0,
          bestScore: 0,
          averageAttempts: 0
        },
        'face-mash': {
          played: 0,
          completed: 0,
          bestScore: 0,
          averageAttempts: 0
        },
        'plot-fusion': {
          played: 0,
          completed: 0,
          bestScore: 0,
          averageAttempts: 0
        },
        'glimpsed': {
          played: 0,
          completed: 0,
          bestScore: 0,
          averageAttempts: 0
        }
      }
    };
  }

  // Clear all game data (for testing/reset purposes)
  static clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.GAME_PROGRESS);
      localStorage.removeItem(STORAGE_KEYS.LAST_PLAYED);
      localStorage.removeItem(STORAGE_KEYS.USER_STATS);
    } catch (error) {
      console.error('Error clearing game data:', error);
    }
  }

  // Clear progress for a specific game
  static clearGameProgress(gameId: string): void {
    try {
      const progressData = localStorage.getItem(STORAGE_KEYS.GAME_PROGRESS);
      if (!progressData) return;
      
      const allProgress: Record<string, GameProgress> = JSON.parse(progressData);
      delete allProgress[gameId];
      localStorage.setItem(STORAGE_KEYS.GAME_PROGRESS, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error clearing game progress:', error);
    }
  }

  // Clear cooldown for a specific game (allows immediate replay)
  static clearGameCooldown(gameType: GameType): void {
    try {
      const lastPlayedData = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
      if (!lastPlayedData) return;
      
      const lastPlayed: Record<GameType, number> = JSON.parse(lastPlayedData);
      delete lastPlayed[gameType];
      localStorage.setItem(STORAGE_KEYS.LAST_PLAYED, JSON.stringify(lastPlayed));
    } catch (error) {
      console.error('Error clearing game cooldown:', error);
    }
  }
}

// Utility function to format time remaining
export const formatTimeRemaining = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};
