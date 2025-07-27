import { FaceMashGameData } from '../types/gameTypes';

export const faceMashGamesData: FaceMashGameData[] = [
  {
    id: 'face-mash-001',
    title: 'Face Mash #1',
    description: 'Guess both actors from the merged face',
    type: 'face-mash',
    route: '/face-mash',
    date: '2025-07-25',
    actor1: {
      name: 'Shah Rukh Khan',
      image: '/images/face-mash/001/actor1.webp',
      hints: [
        { type: 'gender', content: 'Male' },
        { type: 'birth_date', content: 'Born in 1965' },
        { type: 'famous_movies', content: 'Known for: Dilwale Dulhania Le Jayenge, My Name is Khan' },
        { type: 'initials', content: 'S.R.K.' }
      ]
    },
    actor2: {
      name: 'Aishwarya Rai',
      image: '/images/face-mash/001/actor2.jpg',
      hints: [
        { type: 'gender', content: 'Female' },
        { type: 'birth_date', content: 'Born in 1973' },
        { type: 'famous_movies', content: 'Known for: Devdas, Jodha Akbar' },
        { type: 'initials', content: 'A.R' }
      ]
    },
    mashedImage: '/images/face-mash/morphed.png'
  }
  // {
  //   id: 'face-mash-002',
  //   title: 'Face Mash #2',
  //   description: 'Guess both actors from the merged face',
  //   type: 'face-mash',
  //   route: '/face-mash',
  //   date: '2025-07-26',
  //   actor1: {
  //     name: 'Ranveer Singh',
  //     image: '/images/face-mash/001/actor1.webp',
  //     hints: [
  //       { type: 'gender', content: 'Male' },
  //       { type: 'birth_date', content: 'Born in 1985' },
  //       { type: 'famous_movies', content: 'Known for: Gully Boy, Padmaavat' },
  //       { type: 'initials', content: 'R.S.' }
  //     ]
  //   },
  //   actor2: {
  //     name: 'Alia Bhatt',
  //     image: '/images/face-mash/001/actor2.jpg',
  //     hints: [
  //       { type: 'gender', content: 'Female' },
  //       { type: 'birth_date', content: 'Born in 1993' },
  //       { type: 'famous_movies', content: 'Known for: Highway, Raazi' },
  //       { type: 'initials', content: 'A.B.' }
  //     ]
  //   },
  //   mashedImage: '/images/face-mash/002/mashed.png'
  // }
];

// Function to get today's face mash game
export const getTodaysFaceMashGame = (): FaceMashGameData | null => {
  const today = new Date().toISOString().split('T')[0];
  return faceMashGamesData.find(game => game.date === today) || faceMashGamesData[0];
};
