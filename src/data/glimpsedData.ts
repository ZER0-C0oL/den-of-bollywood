import { GlimpsedGameData } from '../types/gameTypes';

export const glimpsedGamesData: GlimpsedGameData[] = [
  {
    id: 'glimpsed-001',
    title: 'Glimpsed #1',
    description: 'Guess the Bollywood movie from frames',
    type: 'glimpsed',
    route: '/glimpsed/001',
    movieId: '11',
    movieName: 'Chalte Chalte',
    totalFrames: 6,
    date: '2025-08-18'
  }
];

// Get today's Glimpsed game (for now, just return the first one)
export const getTodaysGlimpsedGame = (): GlimpsedGameData | null => {
  return glimpsedGamesData[0] || null;
};

// Get Glimpsed game by ID
export const getGlimpsedGameById = (gameId: string): GlimpsedGameData | null => {
  return glimpsedGamesData.find(game => game.id === gameId) || null;
};

// Get all Glimpsed games for archive
export const getAllGlimpsedGames = (): GlimpsedGameData[] => {
  return glimpsedGamesData;
};
