import { PlotFusionGameData } from '../../../types/gameTypes';
import { GameStorageManager } from '../../../utils/gameStorage';

export interface PlotFusionMovieState {
  found: boolean;
  guesses: string[];
  hintsRevealed: number;
}

export interface PlotFusionGameState {
  movie1State: PlotFusionMovieState;
  movie2State: PlotFusionMovieState;
  attempts: number;
  gameCompleted: boolean;
  gameWon: boolean;
  showAnswers: boolean;
  currentTarget: 'movie1' | 'movie2' | null;
}

export class PlotFusionGameService {
  static initializeMovieState(): PlotFusionMovieState {
    return {
      found: false,
      guesses: [],
      hintsRevealed: 0
    };
  }

  static loadGameProgress(gameId: string): Partial<PlotFusionGameState> {
    const progress = GameStorageManager.getGameProgress(gameId);
    
    if (!progress || !progress.gameState) {
      return {};
    }

    return {
      movie1State: progress.gameState.movie1State || this.initializeMovieState(),
      movie2State: progress.gameState.movie2State || this.initializeMovieState(),
      attempts: progress.attempts || 0,
      gameCompleted: progress.completed || false,
      gameWon: (progress.gameState.movie1State?.found && progress.gameState.movie2State?.found) || false,
      showAnswers: progress.completed || false
    };
  }

  static saveGameProgress(
    gameId: string,
    gameState: PlotFusionGameState,
    gameWon: boolean,
    score: number
  ): void {
    GameStorageManager.saveGameProgress(gameId, {
      gameId,
      status: gameState.gameCompleted ? 'completed' : 'in_progress',
      attempts: gameState.attempts,
      hintsUsed: gameState.movie1State.hintsRevealed + gameState.movie2State.hintsRevealed,
      startTime: Date.now() - (gameState.attempts * 30000), // Approximate
      endTime: gameState.gameCompleted ? Date.now() : undefined,
      score: gameState.gameCompleted ? score : undefined,
      completed: gameState.gameCompleted,
      gameState: {
        movie1State: gameState.movie1State,
        movie2State: gameState.movie2State
      }
    });
  }

  static clearGameProgress(gameId: string): void {
    GameStorageManager.clearGameProgress(gameId);
  }

  static processGuess(
    guess: string,
    gameData: PlotFusionGameData,
    currentState: PlotFusionGameState
  ): {
    newState: PlotFusionGameState;
    isCorrect: boolean;
    target: 'movie1' | 'movie2' | null;
  } {
    const guessLower = guess.toLowerCase().trim();
    let newState = { ...currentState };
    let isCorrect = false;
    let target: 'movie1' | 'movie2' | null = null;

    // Check if guess matches movie1
    if (!newState.movie1State.found && 
        gameData.movies.movie1.name.toLowerCase() === guessLower) {
      newState.movie1State = {
        ...newState.movie1State,
        found: true,
        guesses: [...newState.movie1State.guesses, guess]
      };
      isCorrect = true;
      target = 'movie1';
    }
    // Check if guess matches movie2
    else if (!newState.movie2State.found && 
             gameData.movies.movie2.name.toLowerCase() === guessLower) {
      newState.movie2State = {
        ...newState.movie2State,
        found: true,
        guesses: [...newState.movie2State.guesses, guess]
      };
      isCorrect = true;
      target = 'movie2';
    }
    // Wrong guess - add to appropriate list and reveal hint
    else {
      // Determine which movie to add the guess to (alternate or use current target)
      const targetMovie = newState.currentTarget || 
        (newState.movie1State.guesses.length <= newState.movie2State.guesses.length ? 'movie1' : 'movie2');
      
      if (targetMovie === 'movie1' && !newState.movie1State.found) {
        newState.movie1State = {
          ...newState.movie1State,
          guesses: [...newState.movie1State.guesses, guess],
          hintsRevealed: Math.min(
            newState.movie1State.hintsRevealed + 1,
            gameData.movies.movie1.hints.length
          )
        };
        target = 'movie1';
      } else if (targetMovie === 'movie2' && !newState.movie2State.found) {
        newState.movie2State = {
          ...newState.movie2State,
          guesses: [...newState.movie2State.guesses, guess],
          hintsRevealed: Math.min(
            newState.movie2State.hintsRevealed + 1,
            gameData.movies.movie2.hints.length
          )
        };
        target = 'movie2';
      }
    }

    // Update attempts and check completion
    newState.attempts += 1;
    newState.gameWon = newState.movie1State.found && newState.movie2State.found;
    newState.gameCompleted = newState.gameWon || newState.attempts >= 10; // Max 10 attempts
    newState.showAnswers = newState.gameCompleted;

    return { newState, isCorrect, target };
  }

  static calculateScore(attempts: number, gameWon: boolean, hintsUsed: number): number {
    if (!gameWon) return 0;
    
    const baseScore = 100;
    const attemptPenalty = Math.min(attempts * 5, 50); // Max 50 points penalty for attempts
    const hintPenalty = Math.min(hintsUsed * 5, 30); // Max 30 points penalty for hints
    
    return Math.max(baseScore - attemptPenalty - hintPenalty, 10); // Minimum 10 points
  }

  static shouldRevealHint(movieState: PlotFusionMovieState, hintIndex: number): boolean {
    return movieState.hintsRevealed > hintIndex;
  }
}
