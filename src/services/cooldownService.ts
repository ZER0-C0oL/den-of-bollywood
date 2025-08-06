import { GameStorageManager, formatTimeRemaining } from '../utils/gameStorage';
import { GameType } from '../types/gameTypes';

export interface CooldownState {
  isOnCooldown: boolean;
  remainingTime: number;
  formattedTime: string;
}

export class CooldownService {
  private static timers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Check if a game is on cooldown and get remaining time
   */
  static getCooldownState(gameType: GameType): CooldownState {
    const isOnCooldown = GameStorageManager.isGameOnCooldown(gameType);
    const remainingTime = isOnCooldown ? GameStorageManager.getRemainingCooldownTime(gameType) : 0;
    
    return {
      isOnCooldown,
      remainingTime,
      formattedTime: formatTimeRemaining(remainingTime)
    };
  }

  /**
   * Start a cooldown timer and return a cleanup function
   */
  static startCooldownTimer(
    gameType: GameType, 
    onUpdate: (cooldownState: CooldownState) => void
  ): () => void {
    // Clear existing timer if any
    this.clearTimer(gameType);

    const timer = setInterval(() => {
      const cooldownState = this.getCooldownState(gameType);
      onUpdate(cooldownState);
      
      if (cooldownState.remainingTime <= 0) {
        this.clearTimer(gameType);
      }
    }, 1000);

    this.timers.set(gameType, timer);

    // Return cleanup function
    return () => this.clearTimer(gameType);
  }

  /**
   * Clear timer for a specific game type
   */
  static clearTimer(gameType: string): void {
    const timer = this.timers.get(gameType);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(gameType);
    }
  }

  /**
   * Clear all timers (useful for cleanup)
   */
  static clearAllTimers(): void {
    this.timers.forEach(timer => clearInterval(timer));
    this.timers.clear();
  }
}
