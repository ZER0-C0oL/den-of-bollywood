# Den of Bollywood - Complete Codebase Documentation

## Table of Contents
1. [Overview](#overview)
2. [React Fundamentals for Beginners](#react-fundamentals-for-beginners)
3. [Project Architecture](#project-architecture)
4. [Component Structure](#component-structure)
5. [Data Flow & State Management](#data-flow--state-management)
6. [Game Implementation Details](#game-implementation-details)
7. [Adding New Games](#adding-new-games)
8. [File Structure Reference](#file-structure-reference)
9. [Development Workflow](#development-workflow)

## Overview

Den of Bollywood is a React-based web application featuring multiple daily Bollywood-themed games. The app implements a cooldown system where each game can only be played once every 12 hours, encouraging daily engagement.

### Key Features
- **Multiple Games**: Connections (find groups) and Face Mash (guess actors from merged photos)
- **Daily Cooldown System**: 12-hour wait between game sessions
- **Progressive Hints**: Hints unlock after wrong attempts
- **Local Storage**: Progress and statistics saved in browser
- **Responsive Design**: Works on desktop and mobile devices

## React Fundamentals for Beginners

Before diving into the codebase, here are essential React concepts used in this project:

### 1. Components
React applications are built using components - reusable pieces of UI code.

```tsx
// Functional Component (modern approach used in this project)
const MyComponent: React.FC = () => {
  return <div>Hello World</div>;
};
```

### 2. JSX (JavaScript XML)
JSX allows you to write HTML-like syntax in JavaScript:

```tsx
const element = <h1>Hello, {name}!</h1>;
```

### 3. Props
Props are how you pass data from parent to child components:

```tsx
// Parent component passes data
<GameLayout title="My Game" description="Fun game" />

// Child component receives and uses props
const GameLayout: React.FC<{title: string, description: string}> = ({ title, description }) => {
  return <div><h1>{title}</h1><p>{description}</p></div>;
};
```

### 4. State
State manages data that can change over time:

```tsx
const [count, setCount] = useState(0); // Creates state variable
setCount(count + 1); // Updates state
```

### 5. useEffect Hook
useEffect runs code when component mounts or when dependencies change:

```tsx
useEffect(() => {
  // This runs when component first loads
  loadGameData();
}, []); // Empty array means "run once when component mounts"

useEffect(() => {
  // This runs when 'gameId' changes
  loadSpecificGame(gameId);
}, [gameId]); // Runs when gameId changes
```

### 6. Event Handling
Handling user interactions:

```tsx
const handleClick = () => {
  console.log('Button clicked!');
};

return <button onClick={handleClick}>Click me</button>;
```

## Project Architecture

The application follows a modular React architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │      Data       │    │     Utils       │
│  (UI Logic)     │◄──►│   (Game Data)   │◄──►│  (Storage/Helpers)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │      Types      │
                    │ (TypeScript)    │
                    └─────────────────┘
```

### Architecture Layers

1. **App Layer** (`App.tsx`): Main router and application entry point
2. **Layout Layer** (`GameLayout.tsx`): Shared UI structure and navigation
3. **Game Components**: Individual game implementations
4. **Data Layer**: Game data and configuration
5. **Storage Layer**: Local storage management and persistence
6. **Type Layer**: TypeScript interfaces for type safety

## Component Structure

### 1. App.tsx - Application Router

```tsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/connections" element={<ConnectionsGame />} />
        <Route path="/face-mash" element={<FaceMashGame />} />
      </Routes>
    </Router>
  );
}
```

**Purpose**: Defines which component to show based on URL path.

### 2. HomePage.tsx - Landing Page

```
HomePage
├── Welcome Section
├── User Stats Overview (if games played)
├── Game Cards Grid
│   ├── Connections Card
│   │   ├── Game Description
│   │   ├── Personal Stats
│   │   ├── Cooldown Status
│   │   └── Play Button
│   └── Face Mash Card
│       ├── Game Description
│       ├── Personal Stats
│       ├── Cooldown Status
│       └── Play Button
└── How to Play Instructions
```

**Key Features**:
- Displays overall user statistics
- Shows cooldown status for each game
- Provides game descriptions and personal stats
- Links to individual games

### 3. GameLayout.tsx - Shared Layout

```
GameLayout
├── Header
│   ├── Game Title
│   ├── Game Description
│   └── Navigation Dropdown
├── Main Content Area (children)
└── Footer
```

**Purpose**: Provides consistent UI structure across all game pages.

### 4. ConnectionsGame.tsx - Connections Game Logic

```
ConnectionsGame
├── Game State Management
├── Item Grid (4x4 items to group)
├── Selection Logic (highlight 4 items)
├── Submit/Shuffle Controls
├── Solved Groups Display
├── Attempts Counter
├── Hints/Feedback System
└── Cooldown/Completion States
```

**Game Flow**:
1. Load today's connections puzzle
2. Display 16 shuffled items in a grid
3. User selects 4 items they think belong together
4. Validate selection and provide feedback
5. Track attempts and reveal groups when found
6. Show completion screen with results

### 5. FaceMashGame.tsx - Face Mash Game Logic

```
FaceMashGame
├── Game State Management
├── Merged Face Image Display
├── Actor Name Input (with autocomplete)
├── Progressive Hints System
├── Correct Actors Display
├── Attempts Counter
├── Submit Logic
└── Completion/Cooldown States
```

**Game Flow**:
1. Load today's face mash puzzle
2. Display merged/morphed face image
3. User types actor name (with suggestions)
4. Validate guess against both actors
5. Reveal hints after wrong attempts
6. Track found actors and remaining attempts
7. Show completion screen when both actors found

### 6. GameNavigation.tsx - Navigation Menu

```
GameNavigation
├── Dropdown Toggle Button
└── Game Links Menu
    ├── Home Link
    ├── Connections Link
    └── Face Mash Link
```

## Data Flow & State Management

### Local State vs Global State

The application uses **local component state** instead of global state management (like Redux) for simplicity:

- Each game component manages its own state
- Shared data is passed through props
- Persistence is handled through localStorage

### State Flow Diagram

```
┌─────────────────┐
│   localStorage  │
│   (Persistent)  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐
│  GameStorage    │◄──►│  Component      │
│   Manager       │    │    State        │
└─────────────────┘    └─────────────────┘
          │                      │
          ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│   Game Data     │    │   UI Updates    │
│  (Static JSON)  │    │  (Re-renders)   │
└─────────────────┘    └─────────────────┘
```

### Key State Variables

#### ConnectionsGame State:
```tsx
const [gameData, setGameData] = useState<ConnectionsGameData | null>(null);
const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
const [solvedGroups, setSolvedGroups] = useState<string[]>([]);
const [attempts, setAttempts] = useState(0);
const [gameCompleted, setGameCompleted] = useState(false);
const [cooldownTime, setCooldownTime] = useState(0);
```

#### FaceMashGame State:
```tsx
const [gameData, setGameData] = useState<FaceMashGameData | null>(null);
const [actorGuess, setActorGuess] = useState('');
const [attempts, setAttempts] = useState(0);
const [hintsRevealed, setHintsRevealed] = useState(0);
const [correctActors, setCorrectActors] = useState<string[]>([]);
const [gameCompleted, setGameCompleted] = useState(false);
```

## Game Implementation Details

### Connections Game Logic

#### 1. Data Structure
```typescript
interface ConnectionsGameData {
  id: string;
  title: string;
  groups: ConnectionsGroup[];
  date: string;
}

interface ConnectionsGroup {
  id: string;
  category: string;
  items: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  color: string;
}
```

#### 2. Core Game Functions

**Item Selection**:
```tsx
const handleItemClick = (item: string, groupId: string) => {
  if (gameCompleted || cooldownTime > 0) return;
  
  const itemIndex = selectedItems.findIndex(selected => selected.item === item);
  
  if (itemIndex >= 0) {
    // Deselect item
    setSelectedItems(selectedItems.filter((_, index) => index !== itemIndex));
  } else if (selectedItems.length < 4) {
    // Select item (max 4)
    setSelectedItems([...selectedItems, { item, groupId }]);
  }
};
```

**Answer Validation**:
```tsx
const handleSubmit = () => {
  // Check if all 4 selected items belong to same group
  const firstGroupId = selectedItems[0].groupId;
  const allSameGroup = selectedItems.every(item => item.groupId === firstGroupId);
  
  if (allSameGroup) {
    // Correct! Add to solved groups
    setSolvedGroups([...solvedGroups, firstGroupId]);
  } else {
    // Wrong - increment attempts and give feedback
    setAttempts(attempts + 1);
  }
};
```

### Face Mash Game Logic

#### 1. Data Structure
```typescript
interface FaceMashGameData {
  id: string;
  actor1: {
    name: string;
    image: string;
    hints: FaceMashHint[];
  };
  actor2: {
    name: string;
    image: string;
    hints: FaceMashHint[];
  };
  mashedImage: string;
}
```

#### 2. Core Game Functions

**Autocomplete System**:
```tsx
const handleInputChange = (value: string) => {
  setActorGuess(value);
  const suggestions = getActorSuggestions(value); // Filters actor names
  setActorSuggestions(suggestions);
  setShowSuggestions(suggestions.length > 0 && value.length > 0);
};
```

**Answer Validation**:
```tsx
const handleSubmit = () => {
  const guessLower = actorGuess.toLowerCase().trim();
  const actor1Correct = guessLower === gameData!.actor1.name.toLowerCase();
  const actor2Correct = guessLower === gameData!.actor2.name.toLowerCase();
  
  if (actor1Correct || actor2Correct) {
    // Correct guess - add to found actors
    const foundActor = actor1Correct ? gameData!.actor1.name : gameData!.actor2.name;
    setCorrectActors([...correctActors, foundActor]);
  } else {
    // Wrong guess - reveal next hint
    setAttempts(attempts + 1);
    revealNextHint();
  }
};
```

### Cooldown System

The cooldown system prevents users from playing the same game multiple times per day:

```typescript
// Check if game is on cooldown
static isGameOnCooldown(gameType: GameType): boolean {
  const lastPlayedData = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
  const lastPlayed: Record<GameType, number> = JSON.parse(lastPlayedData);
  const lastPlayedTime = lastPlayed[gameType];
  
  const now = Date.now();
  const timeDiff = now - lastPlayedTime;
  
  return timeDiff < GAME_CONFIG.COOLDOWN_PERIOD; // 12 hours
}
```

### Local Storage Management

All game progress is saved to browser's localStorage:

```typescript
// Save game progress
static saveGameProgress(gameId: string, progress: GameProgress): void {
  const allProgress: Record<string, GameProgress> = getStoredProgress();
  allProgress[gameId] = progress;
  localStorage.setItem(STORAGE_KEYS.GAME_PROGRESS, JSON.stringify(allProgress));
}

// Update user statistics
static updateUserStats(gameType: GameType, completed: boolean, attempts: number): void {
  const stats = getUserStats();
  stats.gameStats[gameType].played++;
  if (completed) {
    stats.gameStats[gameType].completed++;
    stats.streakCount++;
  }
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
}
```

## Adding New Games

### Step-by-Step Guide

#### 1. Create Game Data Structure

First, define your game's data structure in `src/types/gameTypes.ts`:

```typescript
// Add new game type
export interface MyNewGameData extends BaseGame {
  type: 'my-new-game';
  question: string;
  options: string[];
  correctAnswer: string;
  hints: string[];
  date: string;
}
```

#### 2. Add Game Configuration

Update `src/constants/gameConfig.ts`:

```typescript
export const GAME_CONFIG = {
  // ... existing config
  GAMES: {
    CONNECTIONS: 'connections',
    FACE_MASH: 'face-mash',
    MY_NEW_GAME: 'my-new-game' // Add your game
  }
} as const;
```

#### 3. Create Game Data File

Create `src/data/myNewGameData.ts`:

```typescript
import { MyNewGameData } from '../types/gameTypes';

export const myNewGamesData: MyNewGameData[] = [
  {
    id: 'my-new-game-001',
    title: 'My New Game #1',
    description: 'Description of the game',
    type: 'my-new-game',
    route: '/my-new-game',
    date: '2025-07-25',
    question: 'What is the capital of India?',
    options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'],
    correctAnswer: 'Delhi',
    hints: ['It\'s in North India', 'It\'s the political center']
  }
  // Add more games...
];

export const getTodaysMyNewGame = (): MyNewGameData | null => {
  // Logic to get today's game based on date
  return myNewGamesData[0]; // Simplified
};
```

#### 4. Create Game Component

Create `src/components/MyNewGameComponent.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
import GameLayout from './GameLayout';
import { MyNewGameData } from '../types/gameTypes';
import { getTodaysMyNewGame } from '../data/myNewGameData';
import { GameStorageManager } from '../utils/gameStorage';

const MyNewGame: React.FC = () => {
  const [gameData, setGameData] = useState<MyNewGameData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  useEffect(() => {
    const game = getTodaysMyNewGame();
    if (game) {
      setGameData(game);
      
      // Check cooldown and load progress
      if (GameStorageManager.isGameOnCooldown('my-new-game')) {
        setCooldownTime(GameStorageManager.getRemainingCooldownTime('my-new-game'));
      }
    }
  }, []);

  const handleSubmit = () => {
    if (!selectedAnswer || gameCompleted || cooldownTime > 0) return;
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (selectedAnswer === gameData!.correctAnswer) {
      // Correct answer - complete game
      setGameCompleted(true);
      GameStorageManager.updateLastPlayed('my-new-game');
      GameStorageManager.updateUserStats('my-new-game', true, newAttempts);
    } else {
      // Wrong answer - maybe show hint
      if (newAttempts >= 5) {
        // Game over
        setGameCompleted(true);
        GameStorageManager.updateUserStats('my-new-game', false, newAttempts);
      }
    }
  };

  if (!gameData) return <div>Loading...</div>;

  return (
    <GameLayout title={gameData.title} description={gameData.description}>
      <div className="max-w-2xl mx-auto">
        {cooldownTime > 0 ? (
          <div className="text-center">
            <p>Game is on cooldown. Try again later.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl mb-4">{gameData.question}</h2>
            
            <div className="space-y-2 mb-6">
              {gameData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full p-3 text-left border rounded ${
                    selectedAnswer === option ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || gameCompleted}
              className="w-full bg-blue-500 text-white p-3 rounded disabled:opacity-50"
            >
              Submit Answer
            </button>
            
            <div className="mt-4 text-center">
              <p>Attempts: {attempts}/5</p>
            </div>
          </div>
        )}
      </div>
    </GameLayout>
  );
};

export default MyNewGame;
```

#### 5. Add Route to App.tsx

Update `src/App.tsx`:

```tsx
import MyNewGame from './components/MyNewGameComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/connections" element={<ConnectionsGame />} />
        <Route path="/face-mash" element={<FaceMashGame />} />
        <Route path="/my-new-game" element={<MyNewGame />} /> {/* Add this */}
      </Routes>
    </Router>
  );
}
```

#### 6. Update Navigation

Update `src/components/GameNavigation.tsx`:

```tsx
const gameLinks = [
  { name: 'Home', path: '/' },
  { name: 'Connections', path: '/connections' },
  { name: 'Face Mash', path: '/face-mash' },
  { name: 'My New Game', path: '/my-new-game' } // Add this
];
```

#### 7. Update HomePage

Add your game card to `src/components/HomePage.tsx`:

```tsx
const gameCards = [
  // ... existing games
  {
    title: 'My New Game',
    description: 'Description of your new game',
    route: '/my-new-game',
    gameType: 'my-new-game' as const,
    onCooldown: GameStorageManager.isGameOnCooldown('my-new-game'),
    stats: userStats.gameStats['my-new-game']
  }
];
```

### Game Development Best Practices

1. **State Management**: Use useState for component-level state
2. **Effect Management**: Use useEffect for loading data and side effects
3. **Error Handling**: Always handle loading states and errors
4. **Accessibility**: Add proper ARIA labels and keyboard navigation
5. **Mobile Responsiveness**: Test on different screen sizes
6. **Performance**: Avoid unnecessary re-renders with proper dependencies

## File Structure Reference

```
src/
├── components/           # React Components
│   ├── HomePage.tsx           # Landing page with game selection
│   ├── GameLayout.tsx         # Shared layout wrapper
│   ├── GameNavigation.tsx     # Navigation dropdown menu
│   ├── ConnectionsGame.tsx    # Connections game implementation
│   └── FaceMashGame.tsx       # Face mash game implementation
│
├── constants/           # Configuration Constants
│   └── gameConfig.ts          # Game settings and constants
│
├── data/               # Static Game Data
│   ├── actorsData.ts          # Bollywood actors database
│   ├── connectionsData.ts     # Connections game puzzles
│   └── faceMashData.ts        # Face mash game data
│
├── types/              # TypeScript Definitions
│   └── gameTypes.ts           # Interface definitions
│
├── utils/              # Utility Functions
│   ├── gameStorage.ts         # localStorage management
│   └── faceMorphing/          # Face morphing utilities (if used)
│       ├── config.ts
│       ├── facialLandmarks.ts
│       ├── index.ts
│       ├── morphingEngine.ts
│       └── useFaceMorphing.ts
│
├── App.tsx             # Main app with routing
├── App.css             # Global styles
├── index.tsx           # React app entry point
└── index.css           # Base CSS imports
```

### Key Files Explained

#### `App.tsx` - Application Root
- Sets up React Router for navigation
- Defines all page routes
- Wraps entire application

#### `components/GameLayout.tsx` - Shared Layout
- Provides consistent header, navigation, and footer
- Wraps all game pages
- Handles responsive design structure

#### `utils/gameStorage.ts` - Data Persistence
- Manages all localStorage operations
- Handles game progress saving/loading
- Manages cooldown timers and user statistics

#### `constants/gameConfig.ts` - Configuration
- Defines game settings (cooldown time, max attempts)
- Sets storage keys for localStorage
- Defines game types and constants

#### `types/gameTypes.ts` - Type Definitions
- TypeScript interfaces for all game data
- Ensures type safety across the application
- Defines component prop types

## Development Workflow

### Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```
   This opens the app at `http://localhost:3000`

3. **Development Process**:
   - Make changes to files
   - Browser automatically refreshes with changes
   - Check browser console for any errors

### Adding New Game Content

#### For Connections Game:
1. Edit `src/data/connectionsData.ts`
2. Add new game object with 4 groups of 4 items each
3. Set appropriate difficulty levels and colors

```typescript
{
  id: 'connections-003',
  title: 'Bollywood Connections #3',
  date: '2025-07-27',
  groups: [
    {
      id: 'group1',
      category: 'Movies by Karan Johar',
      items: ['Kuch Kuch Hota Hai', 'Kabhi Khushi Kabhie Gham', 'My Name is Khan', 'Student of the Year'],
      difficulty: 'medium',
      color: 'bg-yellow-500'
    }
    // ... 3 more groups
  ]
}
```

#### For Face Mash Game:
1. Add images to `public/images/face-mash/[game-number]/`
   - `actor1.png` - First actor's photo
   - `actor2.png` - Second actor's photo  
   - `mashed.png` - Merged/morphed face

2. Edit `src/data/faceMashData.ts`:

```typescript
{
  id: 'face-mash-002',
  title: 'Face Mash #2',
  date: '2025-07-26',
  actor1: {
    name: 'Ranveer Singh',
    image: '/images/face-mash/002/actor1.png',
    hints: [
      { type: 'gender', content: 'Male' },
      { type: 'birth_year', content: 'Born in 1985' },
      { type: 'famous_movies', content: 'Known for: Gully Boy, Padmaavat' },
      { type: 'initials', content: 'R.S.' }
    ]
  },
  actor2: {
    name: 'Deepika Padukone',
    image: '/images/face-mash/002/actor2.png',
    hints: [
      { type: 'gender', content: 'Female' },
      { type: 'birth_year', content: 'Born in 1986' },
      { type: 'famous_movies', content: 'Known for: Padmaavat, Cocktail' },
      { type: 'initials', content: 'D.P.' }
    ]
  },
  mashedImage: '/images/face-mash/002/mashed.png'
}
```

### Testing Changes

1. **Visual Testing**: Play through games to ensure they work correctly
2. **Browser DevTools**: Check console for errors
3. **Responsive Testing**: Test on different screen sizes
4. **Storage Testing**: Clear localStorage to test fresh user experience

### Building for Production

```bash
npm run build
```

This creates optimized production files in the `build/` folder.

### Deployment to GitHub Pages

```bash
npm run deploy
```

This builds and deploys the app to GitHub Pages automatically.

## Common Development Tasks

### 1. Debugging Game Issues

**Check Browser Console**:
- Press F12 to open DevTools
- Look for red error messages in Console tab
- Check Network tab for failed image loads

**Common Issues**:
- Images not loading: Check file paths and folder structure
- State not updating: Verify useState and setter functions
- Navigation broken: Check route definitions in App.tsx

### 2. Adding New Actor Data

Edit `src/data/actorsData.ts` to add new actors for autocomplete:

```typescript
export const actorsData = [
  { name: 'Shah Rukh Khan', aliases: ['SRK', 'King Khan'] },
  { name: 'Deepika Padukone', aliases: ['DP'] },
  // Add new actors here
];
```

### 3. Customizing Styles

The project uses Tailwind CSS. Common customizations:

**Colors** (in `tailwind.config.js`):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'bollywood-gold': '#FFD700',
        'bollywood-red': '#DC2626',
        'bollywood-orange': '#EA580C',
        // Add custom colors here
      }
    }
  }
}
```

**Component Styles** (in component files):
```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
  Custom styled element
</div>
```

### 4. Managing Game Difficulty

Game difficulty affects hint timing and feedback:

**Connections Difficulty Levels**:
- `easy`: Green color, obvious connections
- `medium`: Yellow color, moderate difficulty  
- `hard`: Orange color, requires more thought
- `expert`: Red color, very challenging

**Face Mash Hint Progression**:
- Wrong answer 1: Gender hint
- Wrong answer 2: Birth date hint
- Wrong answer 3: Famous movies hint
- Wrong answer 4: Initials hint

---

This documentation should give you a comprehensive understanding of the Den of Bollywood codebase. The modular architecture makes it easy to add new games and features while maintaining code quality and user experience.

For questions or contributions, refer to the inline code comments and TypeScript type definitions for additional context.
