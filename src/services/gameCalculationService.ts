/**
 * Common scoring and game calculation utilities
 */
export class GameCalculationService {
  /**
   * Calculate score based on attempts and max attempts
   */
  static calculateAttemptBasedScore(
    attempts: number, 
    maxAttempts: number, 
    baseScore: number = 100,
    penaltyPerAttempt: number = 15
  ): number {
    if (attempts > maxAttempts) return 0;
    return Math.max(0, baseScore - (attempts * penaltyPerAttempt));
  }

  /**
   * Calculate streak bonus
   */
  static calculateStreakBonus(streakCount: number, bonusPerStreak: number = 5): number {
    return streakCount * bonusPerStreak;
  }

  /**
   * Calculate hint penalty
   */
  static calculateHintPenalty(hintsUsed: number, penaltyPerHint: number = 5): number {
    return hintsUsed * penaltyPerHint;
  }

  /**
   * Calculate final score with all bonuses and penalties
   */
  static calculateFinalScore(
    baseScore: number,
    streakBonus: number = 0,
    hintPenalty: number = 0,
    timeBonusOrPenalty: number = 0
  ): number {
    return Math.max(0, baseScore + streakBonus - hintPenalty + timeBonusOrPenalty);
  }

  /**
   * Calculate time bonus/penalty based on completion time
   */
  static calculateTimeBonus(
    completionTimeMs: number,
    optimalTimeMs: number = 300000, // 5 minutes
    bonusPerSecondUnder: number = 0.1,
    penaltyPerSecondOver: number = 0.05
  ): number {
    const timeDifferenceMs = completionTimeMs - optimalTimeMs;
    const timeDifferenceSeconds = timeDifferenceMs / 1000;
    
    if (timeDifferenceSeconds < 0) {
      // Faster than optimal - bonus
      return Math.abs(timeDifferenceSeconds) * bonusPerSecondUnder;
    } else {
      // Slower than optimal - penalty
      return -timeDifferenceSeconds * penaltyPerSecondOver;
    }
  }

  /**
   * Get performance rating based on score
   */
  static getPerformanceRating(score: number): 'Excellent' | 'Great' | 'Good' | 'Fair' | 'Poor' {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Great';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  }

  /**
   * Calculate average attempts from a series of games
   */
  static calculateAverageAttempts(attempts: number[]): number {
    if (attempts.length === 0) return 0;
    const sum = attempts.reduce((acc, curr) => acc + curr, 0);
    return Math.round((sum / attempts.length) * 10) / 10;
  }

  /**
   * Calculate win percentage
   */
  static calculateWinPercentage(wins: number, totalGames: number): number {
    if (totalGames === 0) return 0;
    return Math.round((wins / totalGames) * 100);
  }

  /**
   * Generate performance summary
   */
  static generatePerformanceSummary(
    score: number,
    attempts: number,
    hintsUsed: number,
    completionTime?: number
  ): {
    score: number;
    rating: string;
    attempts: number;
    hintsUsed: number;
    completionTime?: number;
    summary: string;
  } {
    const rating = this.getPerformanceRating(score);
    const completionTimeSeconds = completionTime ? Math.round(completionTime / 1000) : undefined;
    
    let summary = `You scored ${score} points with a ${rating} performance! `;
    summary += `You completed the game in ${attempts} attempts`;
    if (hintsUsed > 0) {
      summary += ` using ${hintsUsed} hints`;
    }
    if (completionTimeSeconds) {
      summary += ` in ${completionTimeSeconds} seconds`;
    }
    summary += '.';
    
    return {
      score,
      rating,
      attempts,
      hintsUsed,
      completionTime: completionTimeSeconds,
      summary
    };
  }
}
