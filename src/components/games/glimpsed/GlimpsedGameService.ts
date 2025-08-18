import { GameStorageManager } from '../../../utils/gameStorage';
import { GameStateService } from '../../../services/gameStateService';
import { GlimpsedGameData } from '../../../types/gameTypes';

export interface GlimpsedGameState {
  currentFrame: number;
  guesses: string[];
  movieFound: boolean;
  gameCompleted: boolean;
  attempts: number;
  showAnswer: boolean;
}

export interface GlimpsedGameResult {
  newState: GlimpsedGameState;
  isCorrect: boolean;
  gameWon: boolean;
}

export class GlimpsedGameService {
  /**
   * Initialize a new game state
   */
  static initializeGameState(): GlimpsedGameState {
    return {
      currentFrame: 1,
      guesses: [],
      movieFound: false,
      gameCompleted: false,
      attempts: 0,
      showAnswer: false
    };
  }

  /**
   * Load game progress from storage
   */
  static loadGameProgress(gameId: string): GlimpsedGameState {
    const progress = GameStorageManager.getGameProgress(gameId);
    
    if (!progress || !progress.gameState) {
      return this.initializeGameState();
    }

    return {
      currentFrame: progress.gameState.currentFrame || 1,
      guesses: progress.gameState.guesses || [],
      movieFound: progress.gameState.movieFound || false,
      gameCompleted: progress.completed,
      attempts: progress.attempts || 0,
      showAnswer: progress.completed
    };
  }

  /**
   * Process a movie guess
   */
  static processGuess(
    guess: string,
    correctMovie: string,
    currentState: GlimpsedGameState
  ): GlimpsedGameResult {
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedCorrect = correctMovie.toLowerCase().trim();
    
    const isCorrect = normalizedGuess === normalizedCorrect;
    const newAttempts = currentState.attempts + 1;
    
    let newState: GlimpsedGameState = {
      ...currentState,
      guesses: [...currentState.guesses, guess],
      attempts: newAttempts
    };

    if (isCorrect) {
      // Correct guess - game won
      newState = {
        ...newState,
        movieFound: true,
        gameCompleted: true,
        showAnswer: true
      };
    } else {
      // Wrong guess - show next frame (if available)
      const nextFrame = Math.min(currentState.currentFrame + 1, 6);
      newState = {
        ...newState,
        currentFrame: nextFrame
      };

      // Check if max attempts reached (6 wrong guesses)
      if (newAttempts >= 6) {
        newState = {
          ...newState,
          gameCompleted: true,
          showAnswer: true
        };
      }
    }

    return {
      newState,
      isCorrect,
      gameWon: isCorrect
    };
  }

  /**
   * Save game progress using common service
   */
  static saveGameProgress(
    gameId: string, 
    gameState: GlimpsedGameState, 
    gameWon?: boolean, 
    score?: number
  ): void {
    GameStateService.saveGameState(gameId, 'glimpsed', {
      attempts: gameState.attempts,
      completed: gameState.gameCompleted,
      won: gameWon,
      hintsUsed: gameState.currentFrame - 1, // Number of frames shown as hints
      score: score,
      gameState: {
        currentFrame: gameState.currentFrame,
        guesses: gameState.guesses,
        movieFound: gameState.movieFound
      },
      startTime: Date.now() - (gameState.attempts * 30000), // Estimate start time
      endTime: gameState.gameCompleted ? Date.now() : undefined
    });
  }

  /**
   * Calculate score based on number of frames shown and attempts
   */
  static calculateScore(gameState: GlimpsedGameState): number {
    if (!gameState.movieFound) return 0;
    
    // Base score starts at 100
    // Deduct points based on frames shown and number of guesses
    const framesPenalty = (gameState.currentFrame - 1) * 15; // 15 points per frame shown
    const guessesPenalty = Math.max(0, gameState.attempts - 1) * 5; // 5 points per wrong guess
    
    return Math.max(10, 100 - framesPenalty - guessesPenalty);
  }

  /**
   * Get the image path for a specific frame
   */
  static getFrameImagePath(gameData: GlimpsedGameData, frameNumber: number): string {
    const gameNumber = gameData.id.split('-')[1]; // Extract '001' from 'glimpsed-001'
    const paddedFrameNumber = frameNumber.toString().padStart(3, '0');
    return `/images/glimpsed/${gameNumber}/${paddedFrameNumber}.png`;
  }

  /**
   * Get the movie answer image path
   */
  static getMovieImagePath(gameData: GlimpsedGameData): string {
    const gameNumber = gameData.id.split('-')[1]; // Extract '001' from 'glimpsed-001'
    return `/images/glimpsed/${gameNumber}/movie.png`;
  }

  /**
   * Clear game progress and reset to initial state
   */
  static clearGameProgress(gameId: string): void {
    GameStorageManager.clearGameProgress(gameId);
  }
}
