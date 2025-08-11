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
      actorId: '1', // Shah Rukh Khan
      name: 'Shah Rukh Khan',
      image: '/images/face-mash/001/actor1.webp'
    },
    actor2: {
      actorId: '28', // Aishwarya Rai
      name: 'Aishwarya Rai',
      image: '/images/face-mash/001/actor2.jpg'
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
      actorId: '7', // Ranveer Singh
      name: 'Ranveer Singh',
      image: '/images/face-mash/002/actor1.jpg'
    },
    actor2: {
      actorId: '11', // Deepika Padukone
      name: 'Deepika Padukone',
      image: '/images/face-mash/002/actor2.jpg'
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
      actorId: '3', // Aamir Khan
      name: 'Aamir Khan',
      image: '/images/face-mash/003/actor1.jpg'
    },
    actor2: {
      actorId: '13', // Kareena Kapoor
      name: 'Kareena Kapoor',
      image: '/images/face-mash/003/actor2.jpg'
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
      actorId: '5', // Hrithik Roshan
      name: 'Hrithik Roshan',
      image: '/images/face-mash/004/actor1.jpg'
    },
    actor2: {
      actorId: '12', // Priyanka Chopra
      name: 'Priyanka Chopra',
      image: '/images/face-mash/004/actor2.jpg'
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
      actorId: '2', // Salman Khan
      name: 'Salman Khan',
      image: '/images/face-mash/005/actor1.jpg'
    },
    actor2: {
      actorId: '14', // Katrina Kaif
      name: 'Katrina Kaif',
      image: '/images/face-mash/005/actor2.jpg'
    },
    mashedImage: '/images/face-mash/005/morphed.png'
  }
];

// Function to get today's Face Mash game
export const getTodaysFaceMashGame = (): FaceMashGameData | null => {
  const today = new Date().toISOString().split('T')[0];
  return faceMashGamesData.find(game => game.date === today) || faceMashGamesData[0];
};

// Function to get Face Mash game by ID
export const getFaceMashGameById = (gameId: string): FaceMashGameData | null => {
  return faceMashGamesData.find(game => game.id === gameId) || null;
};

// Function to get all Face Mash games for archive
export const getAllFaceMashGames = (): FaceMashGameData[] => {
  return faceMashGamesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
