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
        name: 'Dilwale Dulhania Le Jayenge',
        hints: [
          { type: 'year', text: 'Released in 1995' },
          { type: 'director', text: 'Directed by Aditya Chopra' },
          { type: 'cast', text: 'Starring Shah Rukh Khan and Kajol' }
        ]
      },
      movie2: {
        name: 'Satya',
        hints: [
          { type: 'year', text: 'Released in 1998' },
          { type: 'director', text: 'Directed by Ram Gopal Varma' },
          { type: 'cast', text: 'Starring J. D. Chakravarthy and Urmila Matondkar' }
        ]
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
        name: 'Zindagi Na Milegi Dobara',
        hints: [
          { type: 'year', text: 'Released in 2011' },
          { type: 'director', text: 'Directed by Zoya Akhtar' },
          { type: 'cast', text: 'Starring Hrithik Roshan, Farhan Akhtar, and Abhay Deol' }
        ]
      },
      movie2: {
        name: 'Ghajini',
        hints: [
          { type: 'year', text: 'Released in 2008' },
          { type: 'director', text: 'Directed by A. R. Murugadoss' },
          { type: 'cast', text: 'Starring Aamir Khan and Asin' }
        ]
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
        name: 'Dangal',
        hints: [
          { type: 'year', text: 'Released in 2016' },
          { type: 'director', text: 'Directed by Nitesh Tiwari' },
          { type: 'cast', text: 'Starring Aamir Khan, Fatima Sana Shaikh, and Sanya Malhotra' }
        ]
      },
      movie2: {
        name: 'Dil Chahta Hai',
        hints: [
          { type: 'year', text: 'Released in 2001' },
          { type: 'director', text: 'Directed by Farhan Akhtar' },
          { type: 'cast', text: 'Starring Aamir Khan, Saif Ali Khan, and Akshaye Khanna' }
        ]
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
        name: 'Rockstar',
        hints: [
          { type: 'year', text: 'Released in 2011' },
          { type: 'director', text: 'Directed by Imtiaz Ali' },
          { type: 'cast', text: 'Starring Ranbir Kapoor and Nargis Fakhri' }
        ]
      },
      movie2: {
        name: 'Mujhse Shaadi Karogi',
        hints: [
          { type: 'year', text: 'Released in 2004' },
          { type: 'director', text: 'Directed by David Dhawan' },
          { type: 'cast', text: 'Starring Salman Khan, Akshay Kumar, and Priyanka Chopra' }
        ]
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
        name: 'Kabhi Khushi Kabhie Gham',
        hints: [
          { type: 'year', text: 'Released in 2001' },
          { type: 'director', text: 'Directed by Karan Johar' },
          { type: 'cast', text: 'Starring Amitabh Bachchan, Shah Rukh Khan, and Kajol' }
        ]
      },
      movie2: {
        name: 'Tumhari Sulu',
        hints: [
          { type: 'year', text: 'Released in 2017' },
          { type: 'director', text: 'Directed by Suresh Triveni' },
          { type: 'cast', text: 'Starring Vidya Balan and Manav Kaul' }
        ]
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
