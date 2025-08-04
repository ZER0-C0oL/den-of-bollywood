import { GameType, GameStatus } from '../constants/gameConfig';

export type { GameType, GameStatus };

// Base Game Interface
export interface BaseGame {
  id: string;
  title: string;
  description: string;
  type: GameType;
  route: string;
}

// Connections Game Types
export interface ConnectionsGroup {
  id: string;
  category: string;
  items: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  color: string;
}

export interface ConnectionsGameData extends BaseGame {
  type: 'connections';
  groups: ConnectionsGroup[];
  date: string;
}

// Face Mash Game Types
export interface FaceMashHint {
  type: 'gender' | 'birth_date' | 'famous_movies' | 'initials';
  content: string;
}

export interface FaceMashGameData extends BaseGame {
  type: 'face-mash';
  actor1: {
    name: string;
    image: string;
    hints: FaceMashHint[];
  };
  actor2: {
    name: string;
    image: string;
    hints: FaceMashHint[];
  };
  mashedImage: string;
  date: string;
}

// Game Progress Tracking
export interface GameProgress {
  gameId: string;
  status: GameStatus;
  attempts: number;
  hintsUsed: number;
  startTime: number;
  endTime?: number;
  score?: number;
  completed: boolean;
  // Game-specific state data
  gameState?: {
    // For Connections: solved group IDs
    solvedGroups?: string[];
    // For FaceMash: actor states
    actor1State?: {
      found: boolean;
      guesses: string[];
      hintsRevealed: number;
    };
    actor2State?: {
      found: boolean;
      guesses: string[];
      hintsRevealed: number;
    };
  };
  // For Connections: attempt results
  attemptResults?: ('correct' | 'one_away' | 'wrong')[];
}

// User Stats
export interface UserStats {
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  averageAttempts: number;
  streakCount: number;
  lastPlayedDate: string;
  gameStats: Record<GameType, {
    played: number;
    completed: number;
    bestScore: number;
    averageAttempts: number;
  }>;
}

// Actor suggestion for autocomplete
export interface Actor {
  id: string;
  name: string;
  aliases?: string[]; // Alternative names or spellings
  gender: 'male' | 'female';
}
