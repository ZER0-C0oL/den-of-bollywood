import { ConnectionsGameData } from '../types/gameTypes';

export const connectionsGamesData: ConnectionsGameData[] = [
  {
    id: 'connections-001',
    title: 'Bollywood Connections #1',
    description: 'Find groups of 4 related Bollywood items',
    type: 'connections',
    route: '/connections',
    date: '2025-07-25',
    groups: [
      {
        id: 'group1',
        category: 'Yash Raj Films',
        items: ['Dilwale Dulhania Le Jayenge', 'Dil To Pagal Hai', 'Veer-Zaara', 'Rab Ne Bana Di Jodi'],
        difficulty: 'easy',
        color: 'bg-green-500'
      },
      {
        id: 'group2',
        category: 'Shah Rukh Khan Movies',
        items: ['Kuch Kuch Hota Hai', 'My Name is Khan', 'Chennai Express', 'Happy New Year'],
        difficulty: 'medium',
        color: 'bg-yellow-500'
      },
      {
        id: 'group3',
        category: 'Movies with Deepika Padukone',
        items: ['Om Shanti Om', 'Cocktail', 'Yeh Jawaani Hai Deewani', 'Bajirao Mastani'],
        difficulty: 'hard',
        color: 'bg-orange-500'
      },
      {
        id: 'group4',
        category: 'Movies Released in 2019',
        items: ['Gully Boy', 'Kabir Singh', 'War', 'Chhichhore'],
        difficulty: 'expert',
        color: 'bg-red-500'
      }
    ]
  },
  {
    id: 'connections-002',
    title: 'Bollywood Connections #2',
    description: 'Find groups of 4 related Bollywood items',
    type: 'connections',
    route: '/connections',
    date: '2025-07-26',
    groups: [
      {
        id: 'group1',
        category: 'Rajkumar Hirani Films',
        items: ['3 Idiots', 'Munna Bhai MBBS', 'PK', 'Sanju'],
        difficulty: 'easy',
        color: 'bg-green-500'
      },
      {
        id: 'group2',
        category: 'Songs by A.R. Rahman',
        items: ['Jai Ho', 'Taal Se Taal', 'Kun Faya Kun', 'Rockstar'],
        difficulty: 'medium',
        color: 'bg-yellow-500'
      },
      {
        id: 'group3',
        category: 'Aamir Khan Productions',
        items: ['Lagaan', 'Taare Zameen Par', 'Dangal', 'Secret Superstar'],
        difficulty: 'hard',
        color: 'bg-orange-500'
      },
      {
        id: 'group4',
        category: 'Priyanka Chopra Movies',
        items: ['Bajirao Mastani', 'Mary Kom', 'Barfi!', 'The Sky Is Pink'],
        difficulty: 'expert',
        color: 'bg-red-500'
      }
    ]
  }
];

// Function to get today's connections game
export const getTodaysConnectionsGame = (): ConnectionsGameData | null => {
  const today = new Date().toISOString().split('T')[0];
  return connectionsGamesData.find(game => game.date === today) || connectionsGamesData[0];
};
