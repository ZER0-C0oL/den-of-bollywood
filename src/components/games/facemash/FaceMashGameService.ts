import { FaceMashGameData, FaceMashHint } from '../../../types/gameTypes';
import { GameStorageManager } from '../../../utils/gameStorage';
import { getActorSuggestions } from '../../../data/actorsData';
import { GameCalculationService } from '../../../services/gameCalculationService';
import { GameStateService } from '../../../services/gameStateService';

// Interface for tracking guesses and hints per actor
export interface ActorState {
  found: boolean;
  guesses: string[];
  hintsRevealed: number;
}

export interface FaceMashGameState {
  actor1State: ActorState;
  actor2State: ActorState;
  attempts: number;
  gameCompleted: boolean;
  gameWon: boolean;
  showAnswers: boolean;
  currentTarget: 'actor1' | 'actor2' | null;
}

export class FaceMashGameService {
  /**
   * Get ordered hints (Gender, Birthdate, Movies, Initials)
   */
  static getOrderedHints(hints: FaceMashHint[]): FaceMashHint[] {
    const order = ['birth_year', 'famous_movies', 'initials'];
    return order.map(type => hints.find(hint => hint.type === type)).filter(Boolean) as FaceMashHint[];
  }

  /**
   * Initialize actor state
   */
  static initializeActorState(): ActorState {
    return {
      found: false,
      guesses: [],
      hintsRevealed: 0
    };
  }

  /**
   * Load game progress from storage
   */
  static loadGameProgress(gameId: string): Partial<FaceMashGameState> {
    const progress = GameStorageManager.getGameProgress(gameId);
    if (!progress) return {};

    return {
      attempts: progress.attempts,
      gameCompleted: progress.completed,
      showAnswers: progress.completed,
      actor1State: progress.gameState?.actor1State || this.initializeActorState(),
      actor2State: progress.gameState?.actor2State || this.initializeActorState()
    };
  }

  /**
   * Determine target based on gender and current target
   */
  static determineTarget(
    guess: string, 
    gameData: FaceMashGameData,
    actor1State: ActorState,
    actor2State: ActorState,
    currentTarget: 'actor1' | 'actor2' | null
  ): 'actor1' | 'actor2' | null {
    // If user clicked on a frame, use that target
    if (currentTarget) return currentTarget;
    
    // If one actor is already found, target the other one
    if (actor1State.found && !actor2State.found) {
      return 'actor2';
    } else if (!actor1State.found && actor2State.found) {
      return 'actor1';
    }
    
    // Auto-target based on gender differences (only if both actors are not found yet)
    if (!actor1State.found && !actor2State.found) {
      const actor1Gender = gameData.actor1.hints.find(h => h.type === 'gender')?.content.toLowerCase();
      const actor2Gender = gameData.actor2.hints.find(h => h.type === 'gender')?.content.toLowerCase();
      
      if (actor1Gender !== actor2Gender) {
        // Different genders - find the guessed actor's gender from bollywoodActors data
        const guessLower = guess.toLowerCase().trim();
        const foundActor = getActorSuggestions(guess, 1)[0]; // Get the best match
        
        if (foundActor && foundActor.name.toLowerCase() === guessLower) {
          // Exact match found - use the actor's gender
          if (foundActor.gender === 'male' && actor1Gender === 'male') return 'actor1';
          if (foundActor.gender === 'male' && actor2Gender === 'male') return 'actor2';
          if (foundActor.gender === 'female' && actor1Gender === 'female') return 'actor1';
          if (foundActor.gender === 'female' && actor2Gender === 'female') return 'actor2';
        }
      }
      
      // Default: target the one with fewer hints revealed
      return actor1State.hintsRevealed <= actor2State.hintsRevealed ? 'actor1' : 'actor2';
    }
    
    return null;
  }

  /**
   * Reveal next hint for a target actor
   */
  static revealNextHint(
    target: 'actor1' | 'actor2',
    gameData: FaceMashGameData,
    actor1State: ActorState,
    actor2State: ActorState
  ): { actor1State: ActorState; actor2State: ActorState } {
    const targetState = target === 'actor1' ? actor1State : actor2State;
    const targetHints = target === 'actor1' 
      ? this.getOrderedHints(gameData.actor1.hints) 
      : this.getOrderedHints(gameData.actor2.hints);
    
    if (targetState.hintsRevealed < targetHints.length) {
      const newTargetState = {
        ...targetState,
        hintsRevealed: targetState.hintsRevealed + 1
      };
      
      return target === 'actor1' 
        ? { actor1State: newTargetState, actor2State }
        : { actor1State, actor2State: newTargetState };
    }
    
    return { actor1State, actor2State };
  }

  /**
   * Process a guess and return updated game state
   */
  static processGuess(
    guess: string,
    gameData: FaceMashGameData,
    currentState: FaceMashGameState
  ): {
    newState: FaceMashGameState;
    isCorrect: boolean;
    target: 'actor1' | 'actor2' | null;
  } {
    const guessLower = guess.toLowerCase().trim();
    
    // Check if this guess has already been made for any actor
    const allGuesses = [
      ...currentState.actor1State.guesses,
      ...currentState.actor2State.guesses
    ];
    const isDuplicateGuess = allGuesses.some(prevGuess => 
      prevGuess.toLowerCase().trim() === guessLower
    );
    
    if (isDuplicateGuess) {
      // Return current state unchanged if it's a duplicate guess
      return { 
        newState: currentState, 
        isCorrect: false, 
        target: null 
      };
    }
    
    const actor1Correct = guessLower === gameData.actor1.name.toLowerCase();
    const actor2Correct = guessLower === gameData.actor2.name.toLowerCase();
    const isCorrect = actor1Correct || actor2Correct;
    
    const newAttempts = currentState.attempts + 1;
    let newState = { ...currentState, attempts: newAttempts };
    let target: 'actor1' | 'actor2' | null = null;

    if (isCorrect) {
      // Correct guess - automatically assign to the correct actor regardless of selection
      const correctTarget = actor1Correct ? 'actor1' : 'actor2';
      target = correctTarget;
      const targetHints = correctTarget === 'actor1' 
        ? this.getOrderedHints(gameData.actor1.hints) 
        : this.getOrderedHints(gameData.actor2.hints);
      
      const newTargetState = {
        ...((correctTarget === 'actor1' ? currentState.actor1State : currentState.actor2State)),
        found: true,
        guesses: [...((correctTarget === 'actor1' ? currentState.actor1State : currentState.actor2State)).guesses, guess],
        hintsRevealed: targetHints.length // Show all hints when actor is found
      };
      
      if (correctTarget === 'actor1') {
        newState.actor1State = newTargetState;
      } else {
        newState.actor2State = newTargetState;
      }
      
      // Check if both actors found
      const bothFound = (correctTarget === 'actor1' ? true : currentState.actor1State.found) && 
                      (correctTarget === 'actor2' ? true : currentState.actor2State.found);
      
      if (bothFound) {
        newState.gameCompleted = true;
        newState.gameWon = true;
        newState.showAnswers = true;
      }
    } else {
      // Wrong guess - determine target and add to their guesses
      target = this.determineTarget(guess, gameData, currentState.actor1State, currentState.actor2State, currentState.currentTarget);
      
      if (target) {
        const targetState = target === 'actor1' ? currentState.actor1State : currentState.actor2State;
        
        const newTargetState = {
          ...targetState,
          guesses: [...targetState.guesses, guess]
        };
        
        if (target === 'actor1') {
          newState.actor1State = newTargetState;
        } else {
          newState.actor2State = newTargetState;
        }
        
        // Reveal hint for the target
        const { actor1State, actor2State } = this.revealNextHint(target, gameData, newState.actor1State, newState.actor2State);
        newState.actor1State = actor1State;
        newState.actor2State = actor2State;
        
        // Check if this actor has reached 5 wrong attempts
        if (newTargetState.guesses.length >= 5) {
          // Check if both actors have reached max attempts or are found
          const actor1Done = newState.actor1State.found || newState.actor1State.guesses.length >= 5;
          const actor2Done = newState.actor2State.found || newState.actor2State.guesses.length >= 5;
          
          if (actor1Done && actor2Done) {
            // Game over
            newState.gameCompleted = true;
            newState.showAnswers = true;
          }
        }
      }
    }
    
    return { newState, isCorrect, target };
  }

  /**
   * Save game progress using common service
   */
  static saveGameProgress(gameId: string, gameState: FaceMashGameState, gameWon?: boolean, score?: number): void {
    GameStateService.saveGameState(gameId, 'face-mash', {
      attempts: gameState.attempts,
      completed: gameState.gameCompleted,
      won: gameWon,
      hintsUsed: gameState.actor1State.hintsRevealed + gameState.actor2State.hintsRevealed,
      score: score,
      gameState: {
        actor1State: gameState.actor1State,
        actor2State: gameState.actor2State
      },
      startTime: Date.now() - (gameState.attempts * 60000),
      endTime: gameState.gameCompleted ? Date.now() : undefined
    });
  }

  /**
   * Clear game progress and reset to initial state
   */
  static clearGameProgress(gameId: string): void {
    GameStorageManager.clearGameProgress(gameId);
  }

  /**
   * Check if game is won
   */
  static isGameWon(actor1State: ActorState, actor2State: ActorState): boolean {
    return actor1State.found && actor2State.found;
  }

  /**
   * Calculate score using common service
   */
  static calculateScore(attempts: number, gameWon: boolean, hintsUsed: number = 0): number {
    if (!gameWon) return 0;
    
    const baseScore = GameCalculationService.calculateAttemptBasedScore(attempts, 10, 100, 10);
    const hintPenalty = GameCalculationService.calculateHintPenalty(hintsUsed, 5);
    
    return GameCalculationService.calculateFinalScore(baseScore, 0, hintPenalty);
  }
}
