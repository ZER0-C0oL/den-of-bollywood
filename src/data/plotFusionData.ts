import { PlotFusionGameData } from '../types/gameTypes';

export const plotFusionGames: PlotFusionGameData[] = [
  {
    id: '1',
    type: 'plot-fusion',
    title: 'Plot Fusion #1',
    description: 'Guess the two movies from their fused plot',
    route: '/plot-fusion',
    date: '2025-08-09',
    fusedPlot: `A young man from a middle-class family falls in love with a rich girl, but their families are against their relationship. Meanwhile, a notorious gangster tries to take over Mumbai's underworld, facing betrayal from his closest allies. Love blooms amidst the chaos of crime, where bullets fly and hearts break in equal measure.`,
    movies: {
      movie1: {
        movieId: '1', // Dilwale Dulhania Le Jayenge
        name: 'Dilwale Dulhania Le Jayenge'
      },
      movie2: {
        movieId: '2', // Satya
        name: 'Satya'
      }
    }
  },
  {
    id: '2',
    type: 'plot-fusion',
    title: 'Plot Fusion #2',
    description: 'Guess the two movies from their fused plot',
    route: '/plot-fusion',
    date: '2025-08-08',
    fusedPlot: `Three friends embark on a bachelor trip to Spain, where they encounter adventure, love, and self-discovery. Simultaneously, a man suffering from short-term memory loss tries to find the people who killed his girlfriend, using notes and tattoos to hunt for revenge.`,
    movies: {
      movie1: {
        movieId: '3', // Zindagi Na Milegi Dobara
        name: 'Zindagi Na Milegi Dobara'
      },
      movie2: {
        movieId: '4', // Ghajini
        name: 'Ghajini'
      }
    }
  },
  {
    id: '3',
    type: 'plot-fusion',
    title: 'Plot Fusion #3',
    description: 'Guess the two movies from their fused plot',
    route: '/plot-fusion',
    date: '2025-08-07',
    fusedPlot: `A young wrestler from Haryana dreams of winning a gold medal for India at the Commonwealth Games, inspired by her father's unfulfilled dreams. Meanwhile, a group of friends reunite after years to support one of them who is going through a divorce, rediscovering the bonds of friendship and the meaning of life.`,
    movies: {
      movie1: {
        movieId: '5', // Dangal
        name: 'Dangal'
      },
      movie2: {
        movieId: '6', // Dil Chahta Hai
        name: 'Dil Chahta Hai'
      }
    }
  },
  {
    id: '4',
    type: 'plot-fusion',
    title: 'Plot Fusion #4',
    description: 'Guess the two movies from their fused plot',
    route: '/plot-fusion',
    date: '2025-08-06',
    fusedPlot: `A passionate love story unfolds between a Hindu boy and a Muslim girl, challenging societal norms and family traditions. At the same time, a young man pretends to be someone else to win the heart of a girl, leading to hilarious misunderstandings and romantic complications.`,
    movies: {
      movie1: {
        movieId: '7', // Rockstar
        name: 'Rockstar'
      },
      movie2: {
        movieId: '8', // Mujhse Shaadi Karogi
        name: 'Mujhse Shaadi Karogi'
      }
    }
  },
  {
    id: '5',
    type: 'plot-fusion',
    title: 'Plot Fusion #5',
    description: 'Guess the two movies from their fused plot',
    route: '/plot-fusion',
    date: '2025-08-05',
    fusedPlot: `A story of sibling rivalry and family dynamics unfolds when two brothers compete for their father's love and approval in the world of business. Meanwhile, a man with a stutter overcomes his speech impediment to become a successful radio jockey, finding love and confidence along the way.`,
    movies: {
      movie1: {
        movieId: '9', // Kabhi Khushi Kabhie Gham
        name: 'Kabhi Khushi Kabhie Gham'
      },
      movie2: {
        movieId: '10', // Tumhari Sulu
        name: 'Tumhari Sulu'
      }
    }
  }
];

// Helper functions
export const getTodaysPlotFusionGame = (): PlotFusionGameData | null => {
  const today = new Date().toISOString().split('T')[0];
  return plotFusionGames.find(game => game.date === today) || plotFusionGames[0];
};

export const getPlotFusionGameById = (gameId: string): PlotFusionGameData | null => {
  return plotFusionGames.find(game => game.id === gameId) || null;
};

export const getAllPlotFusionGames = (): PlotFusionGameData[] => {
  return plotFusionGames;
};

export const getPlotFusionGameStats = () => {
  return {
    totalGames: plotFusionGames.length,
    dateRange: {
      oldest: plotFusionGames[plotFusionGames.length - 1]?.date,
      newest: plotFusionGames[0]?.date
    }
  };
};
