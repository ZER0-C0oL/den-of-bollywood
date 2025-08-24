export interface MovieHint {
  type: 'year' | 'director' | 'cast' | 'genre' | 'plot';
  text: string;
}

export interface MovieEntry {
  id: string;
  name: string;
  aliases?: string[];
  year: number;
  director: string;
  cast: string[];
  genre: string[];
  hints: MovieHint[];
}

export interface SearchableMovieEntry {
  name: string;
  aliases?: string[];
}

export const bollywoodMoviesData: MovieEntry[] = [
  {
    id: '1',
    name: 'Dilwale Dulhania Le Jayenge',
    aliases: ['DDLJ'],
    year: 1995,
    director: 'Aditya Chopra',
    cast: ['Shah Rukh Khan', 'Kajol', 'Amrish Puri'],
    genre: ['Romance', 'Drama'],
    hints: [
      { type: 'year', text: 'Released in 1995' },
      { type: 'director', text: 'Directed by Aditya Chopra' },
      { type: 'cast', text: 'Starring Shah Rukh Khan and Kajol' }
    ]
  },
  {
    id: '2',
    name: 'Satya',
    aliases: [],
    year: 1998,
    director: 'Ram Gopal Varma',
    cast: ['J. D. Chakravarthy', 'Urmila Matondkar', 'Manoj Bajpayee'],
    genre: ['Crime', 'Drama', 'Thriller'],
    hints: [
      { type: 'year', text: 'Released in 1998' },
      { type: 'director', text: 'Directed by Ram Gopal Varma' },
      { type: 'cast', text: 'Starring J. D. Chakravarthy and Urmila Matondkar' }
    ]
  },
  {
    id: '3',
    name: 'Zindagi Na Milegi Dobara',
    aliases: ['ZNMD'],
    year: 2011,
    director: 'Zoya Akhtar',
    cast: ['Hrithik Roshan', 'Farhan Akhtar', 'Abhay Deol'],
    genre: ['Adventure', 'Comedy', 'Drama'],
    hints: [
      { type: 'year', text: 'Released in 2011' },
      { type: 'director', text: 'Directed by Zoya Akhtar' },
      { type: 'cast', text: 'Starring Hrithik Roshan, Farhan Akhtar, and Abhay Deol' }
    ]
  },
  {
    id: '4',
    name: 'Ghajini',
    aliases: [],
    year: 2008,
    director: 'A. R. Murugadoss',
    cast: ['Aamir Khan', 'Asin', 'Jiah Khan'],
    genre: ['Action', 'Drama', 'Thriller'],
    hints: [
      { type: 'year', text: 'Released in 2008' },
      { type: 'director', text: 'Directed by A. R. Murugadoss' },
      { type: 'cast', text: 'Starring Aamir Khan and Asin' }
    ]
  },
  {
    id: '5',
    name: 'Dangal',
    aliases: [],
    year: 2016,
    director: 'Nitesh Tiwari',
    cast: ['Aamir Khan', 'Fatima Sana Shaikh', 'Sanya Malhotra'],
    genre: ['Biography', 'Drama', 'Sport'],
    hints: [
      { type: 'year', text: 'Released in 2016' },
      { type: 'director', text: 'Directed by Nitesh Tiwari' },
      { type: 'cast', text: 'Starring Aamir Khan, Fatima Sana Shaikh, and Sanya Malhotra' }
    ]
  },
  {
    id: '6',
    name: 'Dil Chahta Hai',
    aliases: ['DCH'],
    year: 2001,
    director: 'Farhan Akhtar',
    cast: ['Aamir Khan', 'Saif Ali Khan', 'Akshaye Khanna'],
    genre: ['Comedy', 'Drama', 'Romance'],
    hints: [
      { type: 'year', text: 'Released in 2001' },
      { type: 'director', text: 'Directed by Farhan Akhtar' },
      { type: 'cast', text: 'Starring Aamir Khan, Saif Ali Khan, and Akshaye Khanna' }
    ]
  },
  {
    id: '7',
    name: 'Rockstar',
    aliases: [],
    year: 2011,
    director: 'Imtiaz Ali',
    cast: ['Ranbir Kapoor', 'Nargis Fakhri'],
    genre: ['Drama', 'Music', 'Romance'],
    hints: [
      { type: 'year', text: 'Released in 2011' },
      { type: 'director', text: 'Directed by Imtiaz Ali' },
      { type: 'cast', text: 'Starring Ranbir Kapoor and Nargis Fakhri' }
    ]
  },
  {
    id: '8',
    name: 'Mujhse Shaadi Karogi',
    aliases: ['MSK'],
    year: 2004,
    director: 'David Dhawan',
    cast: ['Salman Khan', 'Akshay Kumar', 'Priyanka Chopra'],
    genre: ['Comedy', 'Romance'],
    hints: [
      { type: 'year', text: 'Released in 2004' },
      { type: 'director', text: 'Directed by David Dhawan' },
      { type: 'cast', text: 'Starring Salman Khan, Akshay Kumar, and Priyanka Chopra' }
    ]
  },
  {
    id: '9',
    name: 'Kabhi Khushi Kabhie Gham',
    aliases: ['K3G'],
    year: 2001,
    director: 'Karan Johar',
    cast: ['Amitabh Bachchan', 'Shah Rukh Khan', 'Kajol'],
    genre: ['Drama', 'Family', 'Musical'],
    hints: [
      { type: 'year', text: 'Released in 2001' },
      { type: 'director', text: 'Directed by Karan Johar' },
      { type: 'cast', text: 'Starring Amitabh Bachchan, Shah Rukh Khan, and Kajol' }
    ]
  },
  {
    id: '10',
    name: 'Tumhari Sulu',
    aliases: [],
    year: 2017,
    director: 'Suresh Triveni',
    cast: ['Vidya Balan', 'Manav Kaul'],
    genre: ['Comedy', 'Drama', 'Family'],
    hints: [
      { type: 'year', text: 'Released in 2017' },
      { type: 'director', text: 'Directed by Suresh Triveni' },
      { type: 'cast', text: 'Starring Vidya Balan and Manav Kaul' }
    ]
  },
  {
    id: '11',
    name: 'Chalte Chalte',
    aliases: [],
    year: 2003,
    director: 'Aziz Mirza',
    cast: ['Shah Rukh Khan', 'Rani Mukerji'],
    genre: ['Drama', 'Romance'],
    hints: [
      { type: 'year', text: 'Released in 2003' },
      { type: 'director', text: 'Directed by Aziz Mirza' },
      { type: 'cast', text: 'Starring Shah Rukh Khan and Rani Mukerji' }
    ]
  },
  {
    id: '12',
    name: 'Dil Bole Hadippa!',
    aliases: [],
    year: 2009,
    director: 'Anupam Sharma',
    cast: ['Rani Mukerji', 'Shahid Kapoor'],
    genre: ['Drama', 'Romance'],
    hints: [
      { type: 'year', text: 'Released in 2009' },
      { type: 'director', text: 'Directed by Anupam Sharma' },
      { type: 'cast', text: 'Starring Rani Mukerji and Shahid Kapoor' }
    ]
  }
];

// Additional movies for extended search (movies not in bollywoodMoviesData but available for search suggestions)
const additionalSearchMovies: SearchableMovieEntry[] = [
  { name: "Sholay" },
  { name: "3 Idiots" },
  { name: "Baahubali", aliases: ["Bahubali"] },
  { name: "Lagaan" },
  { name: "Mughal-E-Azam" },
  { name: "Anand" },
  { name: "Gol Maal", aliases: ["Golmaal"] },
  { name: "Amar Akbar Anthony", aliases: ["AAA"] },
  { name: "Queen" },
  { name: "Pink" },
  { name: "Andhadhun" },
  { name: "Article 15" },
  { name: "Uri: The Surgical Strike" },
  { name: "Gully Boy" },
  { name: "Kabir Singh" },
  { name: "War" },
  { name: "Super 30" },
  { name: "Mission Mangal" },
  { name: "Chhichhore" },
  { name: "Bala" },
  { name: "Good Newwz" },
  { name: "Tanhaji" },
  { name: "Thappad" },
  { name: "Gulabo Sitabo" },
  { name: "Lootcase" },
  { name: "Sadak 2" },
  { name: "Laxmii" },
  { name: "Coolie No. 1" },
  { name: "Roohi" },
  { name: "Mumbai Saga" },
  { name: "Radhe" },
  { name: "Sardar Udham" },
  { name: "Sooryavanshi" },
  { name: "Antim" },
  { name: "83" },
  { name: "Pushpa", aliases: ["Pushpa: The Rise"] },
  { name: "Spider-Man: No Way Home" },
  { name: "RRR" },
  { name: "The Kashmir Files" },
  { name: "K.G.F: Chapter 2", aliases: ["KGF 2", "KGF Chapter 2"] },
  { name: "Gangubai Kathiawadi" },
  { name: "Bhool Bhulaiyaa 2" },
  { name: "Jugjugg Jeeyo" },
  { name: "Vikram Vedha" },
  { name: "Brahmastra", aliases: ["Brahmastra Part One: Shiva"] },
  { name: "Drishyam 2" },
  { name: "An Action Hero" },
  { name: "Qala" },
  { name: "Chello Show" },
  { name: "Pathaan" },
  { name: "Tu Jhoothi Main Makkaar", aliases: ["TJMM"] },
  { name: "Shehzada" },
  { name: "Mrs. Chatterjee Vs Norway" },
  { name: "Bholaa" },
  { name: "The Archies" },
  { name: "Jawan" },
  { name: "Fukrey 3" },
  { name: "The Vaccine War" },
  { name: "Tiger 3" },
  { name: "Animal" },
  { name: "Sam Bahadur" },
  { name: "Dunki" },
  { name: "Salaar", aliases: ["Salaar: Part 1 - Ceasefire"] },
  { name: "Salaam Namaste" },
  { name: "Khel Khel Mein" },
  { name: "Stree 2", aliases: ["Stree 2: Sarkate Ka Aatank"] },
  { name: "Vedaa" },
  { name: "Bade Miyan Chote Miyan", aliases: ["BMCM"] },
  { name: "Maidaan" },
  { name: "Crew" },
  { name: "Yodha" },
  { name: "Teri Baaton Mein Aisa Uljha Jiya", aliases: ["TBMAUJ"] },
  { name: "Fighter" },
  { name: "Laapataa Ladies" },
  { name: "Article 370" },
  { name: "Swatantrya Veer Savarkar" },
  { name: "Munjya" },
  { name: "Chandu Champion" },
  { name: "Kalki 2898 AD", aliases: ["Kalki"] },
  { name: "Sarfira" },
  { name: "Auron Mein Kahan Dum Tha", aliases: ["AMKDT"] },
  { name: "Khiladi 1080" },
  { name: "Double XL" },
  { name: "Shamshera" },
  { name: "Laal Singh Chaddha", aliases: ["LSC"] },
  { name: "Raksha Bandhan" },
  { name: "Cuttputlli" },
  { name: "Darlings" },
  { name: "Liger" },
  { name: "Dobaaraa" },
  { name: "Ek Tha Raja" },
  { name: "Goodbye" },
  { name: "Doctor G" },
  { name: "Phone Bhoot" },
  { name: "Mili" },
  { name: "Thank God" },
  { name: "Ram Setu" },
  { name: "Rocket Boys" },
  { name: "Human" },
  { name: "Baby" },
  { name: "Hum Tum" },
  { name: "Dhoondte Reh Jaaoge" },
  { name: "Hum Dil De Chuke Sanam" },
  { name: "The Great Indian Murder" },
  { name: "Rocket Boys 2" },
  { name: "Taare Zameen Par", aliases: ["TZP"] },
  { name: "My Name is Khan", aliases: ["MNIK"] },
  { name: "Chak De! India" },
  { name: "Rang De Basanti", aliases: ["RDB"] },
  { name: "Swades" },
  { name: "Bhaag Milkha Bhaag", aliases: ["BMB"] },
  { name: "Mary Kom" },
  { name: "Neerja" },
  { name: "Toilet: Ek Prem Katha" },
  { name: "Padman" },
  { name: "Gold" },
  { name: "Kesari" },
  { name: "Chhapak" },
  { name: "Gunjan Saxena: The Kargil Girl" },
  { name: "Shershaah" },
  { name: "Chandigarh Kare Aashiqui" },
  { name: "Jersey" },
  { name: "Heropanti 2" },
  { name: "Bachchhan Paandey" },
  { name: "Attack" },
  { name: "Morbius" },
  { name: "Runway 34" },
  { name: "Jayeshbhai Jordaar" },
  { name: "Samrat Prithviraj" },
  { name: "Vikram" },
  { name: "Major" },
  { name: "Khuda Haafiz Chapter 2" },
  { name: "Rocketry: The Nambi Effect" },
  { name: "Toofaan" },
  { name: "Bell Bottom" },
  { name: "Pushpa: The Rise - Part 1", aliases: ["Pushpa"] },
  { name: "Atrangi Re" },
  { name: "Tadka" },
  { name: "Badhaai Do" },
  { name: "Gehraiyaan" },
  { name: "A Thursday" },
  { name: "Jalsa" },
  { name: "Dhaakad" },
  { name: "Border" },
  { name: "Border 2" }
];

// Generate searchable movies list from bollywoodMoviesData + additional movies
// This creates the combined list automatically from both sources
export const bollywoodMovies: SearchableMovieEntry[] = [
  // Convert bollywoodMoviesData to searchable format
  ...bollywoodMoviesData.map(movie => ({
    name: movie.name,
    aliases: movie.aliases?.length ? movie.aliases : undefined
  })),
  // Add additional movies not in the main data
  ...additionalSearchMovies
];

// More efficient getter function for real-time usage
export const getBollywoodMovies = (): SearchableMovieEntry[] => {
  return [
    ...bollywoodMoviesData.map(movie => ({
      name: movie.name,
      aliases: movie.aliases?.length ? movie.aliases : undefined
    })),
    ...additionalSearchMovies
  ];
};

// Helper function to get all searchable terms for a movie
export const getSearchableTerms = (movie: SearchableMovieEntry): string[] => {
  const terms = [movie.name.toLowerCase()];
  if (movie.aliases) {
    terms.push(...movie.aliases.map(alias => alias.toLowerCase()));
  }
  return terms;
};

// Function to search movies based on user input
export const searchMovies = (query: string, limit: number = 10): SearchableMovieEntry[] => {
  if (!query.trim()) return [];
  
  const queryLower = query.toLowerCase().trim();
  const matches: SearchableMovieEntry[] = [];
  
  for (const movie of bollywoodMovies) {
    const searchableTerms = getSearchableTerms(movie);
    const hasMatch = searchableTerms.some(term => term.includes(queryLower));
    
    if (hasMatch) {
      matches.push(movie);
      if (matches.length >= limit) break;
    }
  }
  
  return matches;
};

// Helper functions for getting movie data by ID
export const getMovieById = (movieId: string): MovieEntry | null => {
  return bollywoodMoviesData.find(movie => movie.id === movieId) || null;
};

export const getMovieHints = (movieId: string): MovieHint[] => {
  const movie = getMovieById(movieId);
  return movie?.hints || [];
};

export const getAllMovies = (): MovieEntry[] => {
  return bollywoodMoviesData;
};
