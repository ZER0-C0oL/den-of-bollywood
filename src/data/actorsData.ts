import { Actor } from '../types/gameTypes';

export const bollywoodActors: Actor[] = [
  { id: '1', name: 'Shah Rukh Khan', aliases: ['SRK', 'King Khan'] },
  { id: '2', name: 'Salman Khan', aliases: ['Bhai'] },
  { id: '3', name: 'Aamir Khan', aliases: ['Mr. Perfectionist'] },
  { id: '4', name: 'Akshay Kumar', aliases: ['Khiladi Kumar'] },
  { id: '5', name: 'Hrithik Roshan', aliases: ['Greek God'] },
  { id: '6', name: 'Ranbir Kapoor' },
  { id: '7', name: 'Ranveer Singh' },
  { id: '8', name: 'Varun Dhawan' },
  { id: '9', name: 'Tiger Shroff' },
  { id: '10', name: 'Kartik Aaryan' },
  { id: '11', name: 'Deepika Padukone' },
  { id: '12', name: 'Priyanka Chopra', aliases: ['PC'] },
  { id: '13', name: 'Kareena Kapoor', aliases: ['Bebo'] },
  { id: '14', name: 'Katrina Kaif' },
  { id: '15', name: 'Alia Bhatt' },
  { id: '16', name: 'Anushka Sharma' },
  { id: '17', name: 'Shraddha Kapoor' },
  { id: '18', name: 'Kriti Sanon' },
  { id: '19', name: 'Jacqueline Fernandez' },
  { id: '20', name: 'Disha Patani' },
  { id: '21', name: 'Amitabh Bachchan', aliases: ['Big B', 'Shahenshah'] },
  { id: '22', name: 'Ajay Devgn' },
  { id: '23', name: 'Vidya Balan' },
  { id: '24', name: 'Kangana Ranaut' },
  { id: '25', name: 'Tabu' },
  { id: '26', name: 'Madhuri Dixit', aliases: ['Dhak Dhak Girl'] },
  { id: '27', name: 'Sridevi' },
  { id: '28', name: 'Aishwarya Rai', aliases: ['Ash'] },
  { id: '29', name: 'John Abraham' },
  { id: '30', name: 'Arjun Kapoor' }
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
