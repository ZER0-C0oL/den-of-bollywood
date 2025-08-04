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

// Share Feature Configuration
export const SHARE_CONFIG = {
  // Emoji colors for share results (customizable)
  COLORS: {
    // Face Mash Game Colors
    FACE_MASH: {
      WRONG_ATTEMPT: '🟥', // Red for wrong attempts
      SUCCESS: '🟩',       // Green for success
      ALT_WRONG: '🔴',     // Alternative red (smaller)
      ALT_SUCCESS: '✅'     // Alternative success
    },
    // Connections Game Colors (NYT style)
    CONNECTIONS: {
      CORRECT: '🟩',       // Green for correct group
      ONE_AWAY: '🟨',      // Yellow for one away
      WRONG: '🟥',         // Red for wrong
      BACKGROUND: '⬜'     // White/gray background
    }
  },
  
  // Website URL for shares
  WEBSITE_URL: 'denofbollywood.com',
  
  // Game numbering (can be date-based or sequential)
  getGameNumber: (gameId: string): string => {
    // Extract number from gameId (e.g., 'face-mash-001' -> '1')
    const match = gameId.match(/(\d+)$/);
    return match ? match[1] : '1';
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