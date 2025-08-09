import { FaceMashGameData } from '../types/gameTypes';

export const faceMashGamesData: FaceMashGameData[] = [
  {
    id: 'face-mash-001',
    title: 'Face Mash #1',
    description: 'Guess both actors from the merged face',
    type: 'face-mash',
    route: '/face-mash',
    date: '2025-08-01',
    actor1: {
      name: 'Shah Rukh Khan',
      image: '/images/face-mash/001/actor1.webp',
      hints: [
        { type: 'gender', content: 'Male' },
        { type: 'birth_year', content: '1965' },
        { type: 'famous_movies', content: 'Dilwale Dulhania Le Jayenge, My Name is Khan' },
        { type: 'initials', content: 'S.R.K.' }
      ]
    },
    actor2: {
      name: 'Aishwarya Rai',
      image: '/images/face-mash/001/actor2.jpg',
      hints: [
        { type: 'gender', content: 'Female' },
        { type: 'birth_year', content: '1973' },
        { type: 'famous_movies', content: 'Devdas, Jodha Akbar' },
        { type: 'initials', content: 'A.R' }
      ]
    },
    mashedImage: '/images/face-mash/001/morphed.png'
  },
  {
    id: 'face-mash-002',
    title: 'Face Mash #2',
    description: 'Guess both actors from the merged face',
    type: 'face-mash',
    route: '/face-mash',
    date: '2025-08-02',
    actor1: {
      name: 'Ranveer Singh',
      image: '/images/face-mash/002/actor1.jpg',
      hints: [
        { type: 'gender', content: 'Male' },
        { type: 'birth_year', content: '1985' },
        { type: 'famous_movies', content: 'Gully Boy, Padmaavat' },
        { type: 'initials', content: 'R.S.' }
      ]
    },
    actor2: {
      name: 'Deepika Padukone',
      image: '/images/face-mash/002/actor2.jpg',
      hints: [
        { type: 'gender', content: 'Female' },
        { type: 'birth_year', content: '1986' },
        { type: 'famous_movies', content: 'Om Shanti Om, Bajirao Mastani' },
        { type: 'initials', content: 'D.P.' }
      ]
    },
    mashedImage: '/images/face-mash/002/morphed.png'
  },
  {
    id: 'face-mash-003',
    title: 'Face Mash #3',
    description: 'Guess both actors from the merged face',
    type: 'face-mash',
    route: '/face-mash',
    date: '2025-08-03',
    actor1: {
      name: 'Aamir Khan',
      image: '/images/face-mash/003/actor1.jpg',
      hints: [
        { type: 'gender', content: 'Male' },
        { type: 'birth_year', content: '1965' },
        { type: 'famous_movies', content: 'Lagaan, 3 Idiots' },
        { type: 'initials', content: 'A.K.' }
      ]
    },
    actor2: {
      name: 'Kareena Kapoor',
      image: '/images/face-mash/003/actor2.jpg',
      hints: [
        { type: 'gender', content: 'Female' },
        { type: 'birth_year', content: '1980' },
        { type: 'famous_movies', content: 'Jab We Met, 3 Idiots' },
        { type: 'initials', content: 'K.K.' }
      ]
    },
    mashedImage: '/images/face-mash/003/morphed.png'
  },
  {
    id: 'face-mash-004',
    title: 'Face Mash #4',
    description: 'Guess both actors from the merged face',
    type: 'face-mash',
    route: '/face-mash',
    date: '2025-08-04',
    actor1: {
      name: 'Hrithik Roshan',
      image: '/images/face-mash/004/actor1.jpg',
      hints: [
        { type: 'gender', content: 'Male' },
        { type: 'birth_year', content: '1974' },
        { type: 'famous_movies', content: 'Kaho Naa... Pyaar Hai, War' },
        { type: 'initials', content: 'H.R.' }
      ]
    },
    actor2: {
      name: 'Priyanka Chopra',
      image: '/images/face-mash/004/actor2.jpg',
      hints: [
        { type: 'gender', content: 'Female' },
        { type: 'birth_year', content: '1982' },
        { type: 'famous_movies', content: 'Fashion, Barfi!' },
        { type: 'initials', content: 'P.C.' }
      ]
    },
    mashedImage: '/images/face-mash/004/morphed.png'
  },
  {
    id: 'face-mash-005',
    title: 'Face Mash #5',
    description: 'Guess both actors from the merged face',
    type: 'face-mash',
    route: '/face-mash',
    date: '2025-08-05',
    actor1: {
      name: 'Akshay Kumar',
      image: '/images/face-mash/005/actor1.jpg',
      hints: [
        { type: 'gender', content: 'Male' },
        { type: 'birth_year', content: '1967' },
        { type: 'famous_movies', content: 'Hera Pheri, Khiladi' },
        { type: 'initials', content: 'A.K.' }
      ]
    },
    actor2: {
      name: 'Katrina Kaif',
      image: '/images/face-mash/005/actor2.jpg',
      hints: [
        { type: 'gender', content: 'Female' },
        { type: 'birth_year', content: '1983' },
        { type: 'famous_movies', content: 'Zindagi Na Milegi Dobara, Tiger Zinda Hai' },
        { type: 'initials', content: 'K.K.' }
      ]
    },
    mashedImage: '/images/face-mash/005/morphed.png'
  }
];

// Function to get today's face mash game
export const getTodaysFaceMashGame = (): FaceMashGameData | null => {
  const today = new Date().toISOString().split('T')[0];
  return faceMashGamesData.find(game => game.date === today) || faceMashGamesData[0];
};

// Function to get face mash game by ID
export const getFaceMashGameById = (gameId: string): FaceMashGameData | null => {
  return faceMashGamesData.find(game => game.id === gameId) || null;
};

// Function to get all face mash games (for archive)
export const getAllFaceMashGames = (): FaceMashGameData[] => {
  return faceMashGamesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
