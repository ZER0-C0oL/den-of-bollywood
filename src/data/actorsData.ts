import { Actor } from '../types/gameTypes';

export interface DetailedActor extends Actor {
  birthYear: number;
  knownFor: string[]; // Famous movies/shows
  initials: string;
  image?: string; // Profile image path
}

export const bollywoodActors: DetailedActor[] = [
  { 
    id: '1', 
    name: 'Shah Rukh Khan', 
    aliases: ['SRK', 'King Khan'], 
    gender: 'male',
    birthYear: 1965,
    knownFor: ['Dilwale Dulhania Le Jayenge', 'My Name is Khan', 'Chennai Express', 'Jawan'],
    initials: 'S.R.K.'
  },
  { 
    id: '2', 
    name: 'Salman Khan', 
    aliases: ['Bhai'], 
    gender: 'male',
    birthYear: 1965,
    knownFor: ['Bajrangi Bhaijaan', 'Tiger Zinda Hai', 'Sultan', 'Dabangg'],
    initials: 'S.K.'
  },
  { 
    id: '3', 
    name: 'Aamir Khan', 
    aliases: ['Mr. Perfectionist'], 
    gender: 'male',
    birthYear: 1965,
    knownFor: ['Lagaan', '3 Idiots', 'Dangal', 'PK'],
    initials: 'A.K.'
  },
  { 
    id: '4', 
    name: 'Akshay Kumar', 
    aliases: ['Khiladi Kumar'], 
    gender: 'male',
    birthYear: 1967,
    knownFor: ['Toilet: Ek Prem Katha', 'Padman', 'Mission Mangal', 'Bala'],
    initials: 'A.K.'
  },
  { 
    id: '5', 
    name: 'Hrithik Roshan', 
    aliases: ['Greek God'], 
    gender: 'male',
    birthYear: 1974,
    knownFor: ['Kaho Naa... Pyaar Hai', 'Zindagi Na Milegi Dobara', 'War', 'Super 30'],
    initials: 'H.R.'
  },
  { 
    id: '6', 
    name: 'Ranbir Kapoor', 
    gender: 'male',
    birthYear: 1982,
    knownFor: ['Rockstar', 'Yeh Jawaani Hai Deewani', 'Sanju', 'Brahmastra'],
    initials: 'R.K.'
  },
  { 
    id: '7', 
    name: 'Ranveer Singh', 
    gender: 'male',
    birthYear: 1985,
    knownFor: ['Gully Boy', 'Padmaavat', 'Bajirao Mastani', 'Band Baaja Baaraat'],
    initials: 'R.S.'
  },
  { 
    id: '8', 
    name: 'Varun Dhawan', 
    gender: 'male',
    birthYear: 1987,
    knownFor: ['Student of the Year', 'Humpty Sharma Ki Dulhania', 'Badlapur', 'October'],
    initials: 'V.D.'
  },
  { 
    id: '9', 
    name: 'Tiger Shroff', 
    gender: 'male',
    birthYear: 1990,
    knownFor: ['Heropanti', 'Baaghi', 'War', 'Student of the Year 2'],
    initials: 'T.S.'
  },
  { 
    id: '10', 
    name: 'Kartik Aaryan', 
    gender: 'male',
    birthYear: 1990,
    knownFor: ['Pyaar Ka Punchnama', 'Sonu Ke Titu Ki Sweety', 'Luka Chuppi', 'Bhool Bhulaiyaa 2'],
    initials: 'K.A.'
  },
  { 
    id: '11', 
    name: 'Deepika Padukone', 
    gender: 'female',
    birthYear: 1986,
    knownFor: ['Om Shanti Om', 'Bajirao Mastani', 'Padmaavat', 'Chhapaak'],
    initials: 'D.P.'
  },
  { 
    id: '12', 
    name: 'Priyanka Chopra', 
    aliases: ['PC'], 
    gender: 'female',
    birthYear: 1982,
    knownFor: ['Fashion', 'Barfi!', 'Mary Kom', 'The Sky Is Pink'],
    initials: 'P.C.'
  },
  { 
    id: '13', 
    name: 'Kareena Kapoor', 
    aliases: ['Bebo'], 
    gender: 'female',
    birthYear: 1980,
    knownFor: ['Jab We Met', '3 Idiots', 'Veere Di Wedding', 'Good Newwz'],
    initials: 'K.K.'
  },
  { 
    id: '14', 
    name: 'Katrina Kaif', 
    gender: 'female',
    birthYear: 1983,
    knownFor: ['Zindagi Na Milegi Dobara', 'Tiger Zinda Hai', 'Bharat', 'Sooryavanshi'],
    initials: 'K.K.'
  },
  { 
    id: '15', 
    name: 'Alia Bhatt', 
    gender: 'female',
    birthYear: 1993,
    knownFor: ['Highway', 'Udta Punjab', 'Raazi', 'Gangubai Kathiawadi'],
    initials: 'A.B.'
  },
  { 
    id: '16', 
    name: 'Anushka Sharma', 
    gender: 'female',
    birthYear: 1988,
    knownFor: ['Band Baaja Baaraat', 'PK', 'Sultan', 'Zero'],
    initials: 'A.S.'
  },
  { 
    id: '17', 
    name: 'Shraddha Kapoor', 
    gender: 'female',
    birthYear: 1987,
    knownFor: ['Aashiqui 2', 'Ek Villain', 'Stree', 'Chhichhore'],
    initials: 'S.K.'
  },
  { 
    id: '18', 
    name: 'Kriti Sanon', 
    gender: 'female',
    birthYear: 1990,
    knownFor: ['Heropanti', 'Bareilly Ki Barfi', 'Luka Chuppi', 'Mimi'],
    initials: 'K.S.'
  },
  { 
    id: '19', 
    name: 'Jacqueline Fernandez', 
    gender: 'female',
    birthYear: 1985,
    knownFor: ['Murder 2', 'Housefull 2', 'Kick', 'Race 3'],
    initials: 'J.F.'
  },
  { 
    id: '20', 
    name: 'Disha Patani', 
    gender: 'female',
    birthYear: 1992,
    knownFor: ['M.S. Dhoni: The Untold Story', 'Baaghi 2', 'Bharat', 'Malang'],
    initials: 'D.P.'
  },
  { 
    id: '21', 
    name: 'Amitabh Bachchan', 
    aliases: ['Big B', 'Shahenshah'], 
    gender: 'male',
    birthYear: 1942,
    knownFor: ['Sholay', 'Deewaar', 'Don', 'Piku'],
    initials: 'A.B.'
  },
  { 
    id: '22', 
    name: 'Ajay Devgn', 
    gender: 'male',
    birthYear: 1969,
    knownFor: ['Zakhm', 'The Legend of Bhagat Singh', 'Tanhaji', 'Drishyam'],
    initials: 'A.D.'
  },
  { 
    id: '23', 
    name: 'Vidya Balan', 
    gender: 'female',
    birthYear: 1979,
    knownFor: ['The Dirty Picture', 'Kahaani', 'Tumhari Sulu', 'Sherni'],
    initials: 'V.B.'
  },
  { 
    id: '24', 
    name: 'Kangana Ranaut', 
    gender: 'female',
    birthYear: 1987,
    knownFor: ['Queen', 'Tanu Weds Manu', 'Manikarnika', 'Thalaivii'],
    initials: 'K.R.'
  },
  { 
    id: '25', 
    name: 'Tabu', 
    gender: 'female',
    birthYear: 1971,
    knownFor: ['Maachis', 'Chandni Bar', 'Haider', 'Andhadhun'],
    initials: 'T.'
  },
  { 
    id: '26', 
    name: 'Madhuri Dixit', 
    aliases: ['Dhak Dhak Girl'], 
    gender: 'female',
    birthYear: 1967,
    knownFor: ['Tezaab', 'Dil', 'Hum Aapke Hain Koun..!', 'Devdas'],
    initials: 'M.D.'
  },
  { 
    id: '27', 
    name: 'Sridevi', 
    gender: 'female',
    birthYear: 1963,
    knownFor: ['Mr. India', 'Chandni', 'Lamhe', 'English Vinglish'],
    initials: 'S.'
  },
  { 
    id: '28', 
    name: 'Aishwarya Rai', 
    aliases: ['Ash'], 
    gender: 'female',
    birthYear: 1973,
    knownFor: ['Devdas', 'Jodha Akbar', 'Guru', 'Ae Dil Hai Mushkil'],
    initials: 'A.R.'
  },
  { 
    id: '29', 
    name: 'John Abraham', 
    gender: 'male',
    birthYear: 1972,
    knownFor: ['Dhoom', 'New York', 'Madras Cafe', 'Batla House'],
    initials: 'J.A.'
  },
  { 
    id: '30', 
    name: 'Arjun Kapoor', 
    gender: 'male',
    birthYear: 1985,
    knownFor: ['Ishaqzaade', '2 States', 'Ki & Ka', 'India\'s Most Wanted'],
    initials: 'A.K.'
  }
];

// Function to get actor by ID
export const getActorById = (id: string): DetailedActor | undefined => {
  return bollywoodActors.find(actor => actor.id === id);
};

// Function to filter actors based on input
export const getActorSuggestions = (input: string, limit: number = 10): DetailedActor[] => {
  if (!input.trim()) return [];
  
  const searchTerm = input.toLowerCase();
  
  return bollywoodActors
    .filter(actor => 
      actor.name.toLowerCase().includes(searchTerm) ||
      actor.aliases?.some(alias => alias.toLowerCase().includes(searchTerm))
    )
    .slice(0, limit);
};

// Helper function to get hints for an actor (for Face Mash game)
export const getActorHints = (actorId: string) => {
  const actor = getActorById(actorId);
  if (!actor) return [];

  return [
    { type: 'gender' as const, content: actor.gender === 'male' ? 'Male' : 'Female' },
    { type: 'birth_year' as const, content: actor.birthYear.toString() },
    { type: 'famous_movies' as const, content: actor.knownFor.slice(0, 2).join(', ') },
    { type: 'initials' as const, content: actor.initials }
  ];
};
