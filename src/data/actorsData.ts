import { Actor } from '../types/gameTypes';

export const bollywoodActors: Actor[] = [
  { id: '1', name: 'Shah Rukh Khan', aliases: ['SRK', 'King Khan'], gender: 'male' },
  { id: '2', name: 'Salman Khan', aliases: ['Bhai'], gender: 'male' },
  { id: '3', name: 'Aamir Khan', aliases: ['Mr. Perfectionist'], gender: 'male' },
  { id: '4', name: 'Akshay Kumar', aliases: ['Khiladi Kumar'], gender: 'male' },
  { id: '5', name: 'Hrithik Roshan', aliases: ['Greek God'], gender: 'male' },
  { id: '6', name: 'Ranbir Kapoor', gender: 'male' },
  { id: '7', name: 'Ranveer Singh', gender: 'male' },
  { id: '8', name: 'Varun Dhawan', gender: 'male' },
  { id: '9', name: 'Tiger Shroff', gender: 'male' },
  { id: '10', name: 'Kartik Aaryan', gender: 'male' },
  { id: '11', name: 'Deepika Padukone', gender: 'female' },
  { id: '12', name: 'Priyanka Chopra', aliases: ['PC'], gender: 'female' },
  { id: '13', name: 'Kareena Kapoor', aliases: ['Bebo'], gender: 'female' },
  { id: '14', name: 'Katrina Kaif', gender: 'female' },
  { id: '15', name: 'Alia Bhatt', gender: 'female' },
  { id: '16', name: 'Anushka Sharma', gender: 'female' },
  { id: '17', name: 'Shraddha Kapoor', gender: 'female' },
  { id: '18', name: 'Kriti Sanon', gender: 'female' },
  { id: '19', name: 'Jacqueline Fernandez', gender: 'female' },
  { id: '20', name: 'Disha Patani', gender: 'female' },
  { id: '21', name: 'Amitabh Bachchan', aliases: ['Big B', 'Shahenshah'], gender: 'male' },
  { id: '22', name: 'Ajay Devgn', gender: 'male' },
  { id: '23', name: 'Vidya Balan', gender: 'female' },
  { id: '24', name: 'Kangana Ranaut', gender: 'female' },
  { id: '25', name: 'Tabu', gender: 'female' },
  { id: '26', name: 'Madhuri Dixit', aliases: ['Dhak Dhak Girl'], gender: 'female' },
  { id: '27', name: 'Sridevi', gender: 'female' },
  { id: '28', name: 'Aishwarya Rai', aliases: ['Ash'], gender: 'female' },
  { id: '29', name: 'John Abraham', gender: 'male' },
  { id: '30', name: 'Arjun Kapoor', gender: 'male' }
];

// Function to filter actors based on input
export const getActorSuggestions = (input: string, limit: number = 10): Actor[] => {
  if (!input.trim()) return [];
  
  const searchTerm = input.toLowerCase();
  
  return bollywoodActors
    .filter(actor => 
      actor.name.toLowerCase().includes(searchTerm) ||
      actor.aliases?.some(alias => alias.toLowerCase().includes(searchTerm))
    )
    .slice(0, limit);
};
