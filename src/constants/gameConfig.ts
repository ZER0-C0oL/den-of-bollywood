// Game Configuration Constants
export const GAME_CONFIG = {
  // Cooldown period between games (12 hours in milliseconds)
  COOLDOWN_PERIOD: 12 * 60 * 60 * 1000,
  
  // Maximum attempts for trivia-based games
  MAX_ATTEMPTS: 5,
  
  // Number of hints to show progressively
  MAX_HINTS: 4,
  
  // Game identifiers
  GAMES: {
    CONNECTIONS: 'connections',
    FACE_MASH: 'face-mash'
  }
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  GAME_PROGRESS: 'bollywood_game_progress',
  LAST_PLAYED: 'bollywood_last_played',
  USER_STATS: 'bollywood_user_stats'
} as const;

// Game Status Types
export type GameStatus = 'not_started' | 'in_progress' | 'completed' | 'cooldown';

export type GameType = typeof GAME_CONFIG.GAMES[keyof typeof GAME_CONFIG.GAMES];
