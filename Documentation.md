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

Den of Bollywood is a React-based web application featuring multiple daily Bollywood-themed games. The app implements a cooldown system where each game can only be played once every 12 hours, encouraging daily engagement. The application features a modular architecture with reusable components, comprehensive share functionality, and replay capabilities.

### Key Features
- **Multiple Games**: Connections (find groups) and Face Mash (guess actors from merged photos)
- **Replay System**: Restart games immediately, bypassing cooldown restrictions
- **Smart Cooldown System**: 12-hour wait between game sessions with visual countdown
- **Progressive Hints**: Context-aware hints unlock after wrong attempts
- **Code Reuse**: Modular components shared across games and views
- **Local Storage**: Progress and statistics saved with proper cleanup utilities
- **Share Functionality**: Generate formatted share text for game results
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Prevention**: Duplicate guess detection and smart validation

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

The application follows a modular React architecture with clear separation of concerns and reusable components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │    Services     │    │     Utils       │
│  (UI Logic)     │◄──►│  (Game Logic)   │◄──►│  (Storage/Share)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │   Data & Types  │
                    │ (Game Data/TS)  │
                    └─────────────────┘
```

### Architecture Layers

1. **App Layer** (`App.tsx`): Main router and application entry point
2. **Layout Layer** (`GameLayout.tsx`): Shared UI structure and navigation  
3. **Game Components**: Modular game implementations with reusable sub-components
4. **Service Layer**: Game logic, cooldown management, and state services
5. **Data Layer**: Game data and configuration
6. **Storage & Utils Layer**: Local storage management, share utilities, and persistence
7. **Type Layer**: TypeScript interfaces for type safety

### Modular Component Structure

Games are now organized in separate folders with reusable components:
- **Game Components**: Main game logic and state management
- **Controls Components**: Reusable input/action controls  
- **Cooldown Views**: Shared cooldown display logic
- **Service Files**: Centralized game logic and calculations

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
│   │   ├── Status Display (Play Now/Continue/View Solution/View Attempt)
│   │   └── Always Clickable Game Button
│   └── Face Mash Card
│       ├── Game Description
│       ├── Personal Stats
│       ├── Status Display (Play Now/Continue/View Solution/View Attempt)
│       └── Always Clickable Game Button
└── How to Play Instructions
```

**Key Features**:
- Displays overall user statistics
- Shows dynamic status for each game (4 possible states)
- Provides game descriptions and personal stats
- Game buttons are always clickable (no disabled state)
- Clean status text without "On Cooldown" labels

### 3. GameLayout.tsx - Shared Layout

```
GameLayout
├── Header
│   ├── Game Title
│   ├── Game Description
│   └── Navigation Dropdown
├── Main Content Area (children)
└── ShareModal Integration
```

**Purpose**: Provides consistent UI structure across all game pages with integrated share functionality.

### 4. ConnectionsGame.tsx - Connections Game Logic

```
ConnectionsGame
├── Game State Management
├── ConnectionsGrid Component (4x4 items with visual feedback)
├── Selection Logic (highlight 4 items with validation)
├── ConnectionsControls Component (Submit/Shuffle/Share/Replay)
├── SolvedGroups Component (color-coded group display)
├── Attempts Counter with "One Away" detection
├── Visual Feedback System (colors, animations)
├── ConnectionsCooldownView (with reused controls)
└── ShareModal Integration
```

**Game Flow**:
1. Load today's connections puzzle
2. Display 16 shuffled items in a responsive grid
3. User selects 4 items they think belong together
4. Validate selection with "one away" feedback for near misses
5. Track attempts and reveal groups when found
6. Show completion screen with reusable controls
7. Enable replay functionality that bypasses cooldown
8. Integrated share functionality with formatted results

**Enhanced Features**:
- **Visual Feedback**: Color-coded difficulty levels and group reveals
- **One Away Detection**: Special feedback when 3/4 items are correct
- **Reusable Components**: Controls shared between game and cooldown views
- **Replay System**: Complete state reset with cooldown bypass

### 5. FaceMashGame.tsx - Face Mash Game Logic

```
FaceMashGame
├── Game State Management
├── FaceMashImage Component (merged face display)
├── FaceMashActorFrame Components (gender-specific unknown placeholders)
├── FaceMashHints Components (progressive hint system)
├── FaceMashGuessHistory Components (aligned guess display)
├── FaceMashControls Component (input/share/replay)
├── Autocomplete System with fuzzy matching
├── Duplicate Guess Prevention
├── Smart Guess Assignment (auto-assigns to correct actor)
├── FaceMashCooldownView (with reused components)
└── ShareModal Integration
```

**Game Flow**:
1. Load today's face mash puzzle
2. Display merged/morphed face image
3. Show unknown actor placeholders (gender-specific)
4. User types actor name with autocomplete suggestions
5. Prevent duplicate guesses and validate against both actors
6. Auto-assign correct guesses to appropriate actor
7. Reveal progressive hints after wrong attempts
8. Track found actors with visual feedback
9. Show completion screen with reusable controls
10. Enable replay functionality with complete state reset

**Enhanced Features**:
- **Gender-Specific Placeholders**: Male/female unknown actor images
- **Duplicate Prevention**: Block repeated guesses with feedback
- **Smart Assignment**: Correct guesses automatically assigned to right actor
- **Visual Feedback**: Large question mark overlay for unknown actors
- **Aligned History**: Right-aligned guess history for actor2
- **Progressive Hints**: Context-aware hints (gender, birth year, movies, initials)

### 6. GameNavigation.tsx - Navigation Menu

```
GameNavigation
├── Dropdown Toggle Button
└── Game Links Menu
    ├── Home Link
    ├── Connections Link
    └── Face Mash Link
```

### 7. ShareModal.tsx - Reusable Share Component

```
ShareModal
├── Modal Overlay
├── Game Result Display
├── Formatted Share Text
├── Copy to Clipboard Functionality
└── Close/Cancel Actions
```

**Purpose**: Centralized share functionality used across all games and cooldown views.

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
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  GameStorage    │◄──►│  Component      │◄──►│   Services      │
│   Manager       │    │    State        │    │ (Game Logic)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Game Data     │    │   UI Updates    │    │  Share Utils    │
│  (Static JSON)  │    │  (Re-renders)   │    │ (Text Generation)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key State Variables

#### ConnectionsGame State:
```tsx
const [gameData, setGameData] = useState<ConnectionsGameData | null>(null);
const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
const [shuffledItems, setShuffledItems] = useState<SelectedItem[]>([]);
const [solvedGroups, setSolvedGroups] = useState<string[]>([]);
const [attempts, setAttempts] = useState(0);
const [gameCompleted, setGameCompleted] = useState(false);
const [gameOver, setGameOver] = useState(false);
const [attemptResults, setAttemptResults] = useState<('correct' | 'one_away' | 'wrong')[]>([]);
const [errorMessage, setErrorMessage] = useState('');
const [cooldownState, setCooldownState] = useState<CooldownState>({
  isOnCooldown: false,
  remainingTime: 0,
  formattedTime: ''
});
const [showShareModal, setShowShareModal] = useState(false);
```

#### FaceMashGame State:
```tsx
const [gameData, setGameData] = useState<FaceMashGameData | null>(null);
const [gameState, setGameState] = useState<FaceMashGameState>({
  actor1State: FaceMashGameService.initializeActorState(),
  actor2State: FaceMashGameService.initializeActorState(),
  attempts: 0,
  gameCompleted: false,
  gameWon: false,
  showAnswers: false,
  currentTarget: null
});
const [cooldownTime, setCooldownTime] = useState(0);
const [showShareModal, setShowShareModal] = useState(false);
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

**Item Selection with Visual Feedback**:
```tsx
const handleItemClick = (item: string, groupId: string) => {
  if (gameCompleted || gameOver || cooldownState.isOnCooldown) return;
  
  const itemIndex = selectedItems.findIndex(selected => selected.item === item);
  
  if (itemIndex >= 0) {
    // Deselect item
    setSelectedItems(selectedItems.filter((_, index) => index !== itemIndex));
  } else if (selectedItems.length < 4) {
    // Select item (max 4) with visual feedback
    setSelectedItems([...selectedItems, { item, groupId }]);
  }
};
```

**Answer Validation with "One Away" Detection**:
```tsx
const handleSubmit = () => {
  const result = ConnectionsGameService.validateSelection(selectedItems, gameData);
  
  if (result.isCorrect) {
    // Correct! Add to solved groups with visual feedback
    setSolvedGroups([...solvedGroups, result.groupId]);
    setAttemptResults([...attemptResults, 'correct']);
  } else if (result.isOneAway) {
    // One away - special feedback
    setErrorMessage('One away! Try a different combination.');
    setAttemptResults([...attemptResults, 'one_away']);
  } else {
    // Wrong - increment attempts and give feedback
    setAttempts(attempts + 1);
    setAttemptResults([...attemptResults, 'wrong']);
  }
  
  // Clear selection after each attempt
  setSelectedItems([]);
};
```

**Replay Functionality**:
```tsx
const handleReplay = () => {
  if (!gameData) return;
  
  // Clear game progress from storage
  GameStorageManager.clearGameProgress(gameData.id);
  
  // Clear cooldown state to allow immediate replay
  GameStorageManager.clearGameCooldown('connections');
  setCooldownState({
    isOnCooldown: false,
    remainingTime: 0,
    formattedTime: ''
  });
  
  // Reset all game state to initial values
  setSelectedItems([]);
  setShuffledItems(ConnectionsGameService.initializeShuffledItems(gameData));
  setSolvedGroups([]);
  setAttempts(0);
  setGameCompleted(false);
  setGameOver(false);
  setAttemptResults([]);
  
  // Close share modal if open
  setShowShareModal(false);
};
```

### Face Mash Game Logic

#### 1. Data Structure
```typescript
interface FaceMashGameData {
  id: string;
  title: string;
  date: string;
  actor1: {
    name: string;
    image: string;
    gender: 'male' | 'female';
    hints: FaceMashHint[];
  };
  actor2: {
    name: string;
    image: string;
    gender: 'male' | 'female';
    hints: FaceMashHint[];
  };
  mashedImage: string;
}

interface FaceMashGameState {
  actor1State: FaceMashActorState;
  actor2State: FaceMashActorState;
  attempts: number;
  gameCompleted: boolean;
  gameWon: boolean;
  showAnswers: boolean;
  currentTarget: 'actor1' | 'actor2' | null;
}

interface FaceMashActorState {
  found: boolean;
  guesses: string[];
  hintsRevealed: number;
}
```

#### 2. Core Game Functions

**Autocomplete System with Fuzzy Matching**:
```tsx
const handleInputChange = (value: string) => {
  setActorGuess(value);
  const suggestions = getActorSuggestions(value); // Fuzzy matching with aliases
  setActorSuggestions(suggestions);
  setShowSuggestions(suggestions.length > 0 && value.length > 0);
};
```

**Duplicate Prevention and Smart Assignment**:
```tsx
const handleSubmitGuess = (guess: string) => {
  if (!gameData || gameState.gameCompleted || cooldownTime > 0) return;
  
  // Check for duplicate guess before processing
  const guessLower = guess.toLowerCase().trim();
  const allGuesses = [
    ...gameState.actor1State.guesses,
    ...gameState.actor2State.guesses
  ];
  const isDuplicateGuess = allGuesses.some(prevGuess => 
    prevGuess.toLowerCase().trim() === guessLower
  );
  
  if (isDuplicateGuess) {
    console.log('Duplicate guess detected:', guess);
    return;
  }
  
  // Process guess with smart assignment
  const { newState, isCorrect, target } = FaceMashGameService.processGuess(guess, gameData, gameState);
  
  // Visual feedback for correct guesses
  if (target) {
    newState.currentTarget = target;
    setTimeout(() => {
      setGameState(prev => ({ ...prev, currentTarget: null }));
    }, isCorrect ? 1500 : 1000);
  }
  
  setGameState(newState);
  
  // Save progress with score calculation
  const hintsUsed = newState.actor1State.hintsRevealed + newState.actor2State.hintsRevealed;
  const score = FaceMashGameService.calculateScore(newState.attempts, newState.gameWon, hintsUsed);
  FaceMashGameService.saveGameProgress(gameData.id, newState, newState.gameWon, score);
};
```

**Replay Functionality with Complete Reset**:
```tsx
const handleReplay = () => {
  if (!gameData) return;
  
  // Clear game progress from storage
  FaceMashGameService.clearGameProgress(gameData.id);
  
  // Clear cooldown state to allow immediate replay
  GameStorageManager.clearGameCooldown('face-mash');
  setCooldownTime(0);
  CooldownService.clearTimer('face-mash');
  
  // Reset game state to initial values
  setGameState({
    actor1State: FaceMashGameService.initializeActorState(),
    actor2State: FaceMashGameService.initializeActorState(),
    attempts: 0,
    gameCompleted: false,
    gameWon: false,
    showAnswers: false,
    currentTarget: null
  });
  
  // Close share modal if open
  setShowShareModal(false);
};
```

### Cooldown System

The enhanced cooldown system includes visual countdown and replay bypass functionality:

```typescript
// Check if game is on cooldown
static isGameOnCooldown(gameType: GameType): boolean {
  const lastPlayedData = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
  if (!lastPlayedData) return false;
  
  const lastPlayed: Record<GameType, number> = JSON.parse(lastPlayedData);
  const lastPlayedTime = lastPlayed[gameType];
  
  if (!lastPlayedTime) return false;
  
  const now = Date.now();
  const timeDiff = now - lastPlayedTime;
  
  return timeDiff < GAME_CONFIG.COOLDOWN_PERIOD; // 12 hours
}

// Clear cooldown for immediate replay
static clearGameCooldown(gameType: GameType): void {
  const lastPlayedData = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
  if (!lastPlayedData) return;
  
  const lastPlayed: Record<GameType, number> = JSON.parse(lastPlayedData);
  delete lastPlayed[gameType];
  localStorage.setItem(STORAGE_KEYS.LAST_PLAYED, JSON.stringify(lastPlayed));
}

// Get formatted countdown time
static getCooldownState(gameType: GameType): CooldownState {
  const isOnCooldown = GameStorageManager.isGameOnCooldown(gameType);
  const remainingTime = isOnCooldown ? GameStorageManager.getRemainingCooldownTime(gameType) : 0;
  
  return {
    isOnCooldown,
    remainingTime,
    formattedTime: formatTimeRemaining(remainingTime)
  };
}
```

### Local Storage Management

Enhanced storage management with cleanup utilities and proper state handling:

```typescript
// Save game progress with detailed state
static saveGameProgress(gameId: string, progress: GameProgress): void {
  const allProgress: Record<string, GameProgress> = getStoredProgress();
  allProgress[gameId] = progress;
  localStorage.setItem(STORAGE_KEYS.GAME_PROGRESS, JSON.stringify(allProgress));
}

// Clear specific game progress for replay
static clearGameProgress(gameId: string): void {
  const progressData = localStorage.getItem(STORAGE_KEYS.GAME_PROGRESS);
  if (!progressData) return;
  
  const allProgress: Record<string, GameProgress> = JSON.parse(progressData);
  delete allProgress[gameId];
  localStorage.setItem(STORAGE_KEYS.GAME_PROGRESS, JSON.stringify(allProgress));
}

// Update user statistics with enhanced tracking
static updateUserStats(gameType: GameType, completed: boolean, attempts: number): void {
  const stats = getUserStats();
  stats.gameStats[gameType].played++;
  if (completed) {
    stats.gameStats[gameType].completed++;
    stats.streakCount++;
    // Update best scores and averages
    const currentStats = stats.gameStats[gameType];
    currentStats.bestScore = Math.max(currentStats.bestScore, calculateScore(attempts, completed));
    currentStats.averageAttempts = calculateAverageAttempts(currentStats);
  } else {
    stats.streakCount = 0; // Reset streak on failure
  }
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
}

// Generate formatted share text
generateShareText(shareData: ShareData): string {
  const gameNumber = SHARE_CONFIG.getGameNumber(shareData.gameId);
  const statusLine = shareData.gameWon ? '🎉 Success!' : '😔 Failed';
  const attemptsLine = `Attempts: ${shareData.totalAttempts}/${shareData.maxAttempts}`;
  
  return `${statusLine}\n${attemptsLine}\n#DenOfBollywood #${shareData.gameType}`;
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
├── components/              # React Components
│   ├── HomePage.tsx              # Landing page with enhanced game cards
│   ├── GameLayout.tsx            # Shared layout wrapper with navigation
│   ├── GameNavigation.tsx        # Navigation dropdown menu
│   ├── ShareModal.tsx            # Reusable share modal component
│   └── games/                    # Modular game implementations
│       ├── connections/          # Connections game components
│       │   ├── ConnectionsGame.tsx           # Main game component
│       │   ├── ConnectionsControls.tsx      # Reusable controls (submit/shuffle/share/replay)
│       │   ├── ConnectionsCooldownView.tsx  # Cooldown view with shared components
│       │   ├── ConnectionsGameService.ts    # Game logic and validation
│       │   ├── ConnectionsGrid.tsx          # 4x4 item grid with selection
│       │   └── SolvedGroups.tsx            # Color-coded solved groups display
│       └── facemash/             # Face Mash game components
│           ├── FaceMashGame.tsx             # Main game component
│           ├── FaceMashActorFrame.tsx       # Actor display with gender-specific placeholders
│           ├── FaceMashControls.tsx        # Input controls with autocomplete and actions
│           ├── FaceMashCooldownView.tsx    # Cooldown view with reused components
│           ├── FaceMashGameService.ts      # Game logic and guess processing
│           ├── FaceMashGuessHistory.tsx    # Aligned guess history display
│           ├── FaceMashHints.tsx           # Progressive hint system
│           └── FaceMashImage.tsx           # Merged face image component
│
├── constants/              # Configuration Constants
│   └── gameConfig.ts               # Enhanced game settings and constants
│
├── data/                   # Static Game Data
│   ├── actorsData.ts               # Enhanced Bollywood actors database with search
│   ├── connectionsData.ts          # Connections game puzzles with difficulty levels
│   └── faceMashData.ts             # Face mash game data with gender info
│
├── services/               # Business Logic Services
│   ├── cooldownService.ts          # Cooldown management with timer utilities
│   ├── gameCalculationService.ts   # Score calculations and statistics
│   └── gameStateService.ts         # Game state management utilities
│
├── types/                  # TypeScript Definitions
│   └── gameTypes.ts                # Enhanced interface definitions
│
├── utils/                  # Utility Functions
│   ├── gameStorage.ts              # Enhanced localStorage management
│   └── shareUtils.ts               # Share text generation utilities
│
├── App.tsx                 # Main app with routing
├── App.css                 # Global styles
├── index.tsx               # React app entry point
└── index.css               # Base CSS with Tailwind imports
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

#### `utils/gameStorage.ts` - Enhanced Data Persistence
- Manages all localStorage operations with cleanup utilities
- Handles game progress saving/loading with detailed state
- Manages cooldown timers and user statistics with averages/streaks
- Provides replay functionality with proper state reset
- Includes methods for clearing specific game data

#### `utils/shareUtils.ts` - Share Functionality
- Generates formatted share text for different games
- Handles different game result states and statistics
- Creates shareable content with proper formatting
- Supports game-specific share data structures

#### `services/cooldownService.ts` - Cooldown Management
- Provides cooldown state checking and timer management
- Handles countdown formatting and visual updates
- Manages cooldown bypass for replay functionality
- Includes cleanup utilities for timer management

#### `constants/gameConfig.ts` - Enhanced Configuration
- Defines game settings (cooldown time, max attempts per game)
- Sets storage keys for localStorage with proper namespacing
- Defines game types, routes, and UI constants
- Includes share configuration and color themes

#### `types/gameTypes.ts` - Comprehensive Type Definitions
- TypeScript interfaces for all game data with enhanced properties
- Ensures type safety across modular components
- Defines component prop interfaces for reusable components
- Includes service interfaces and utility type definitions

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
3. Set appropriate difficulty levels and colors for visual feedback

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
    // ... 3 more groups with varying difficulty levels
  ]
}
```

#### For Face Mash Game:
1. Add images to `public/images/face-mash/[game-number]/`
   - `actor1.webp` or `actor1.jpg` - First actor's photo
   - `actor2.webp` or `actor2.jpg` - Second actor's photo  
   - `morphed.png` - Merged/morphed face

2. Edit `src/data/faceMashData.ts` with gender information:

```typescript
{
  id: 'face-mash-002',
  title: 'Face Mash #2',
  date: '2025-07-26',
  actor1: {
    name: 'Ranveer Singh',
    image: '/images/face-mash/002/actor1.webp',
    gender: 'male',
    hints: [
      { type: 'gender', content: 'Male' },
      { type: 'birth_year', content: 'Born in 1985' },
      { type: 'famous_movies', content: 'Known for: Gully Boy, Padmaavat' },
      { type: 'initials', content: 'R.S.' }
    ]
  },
  actor2: {
    name: 'Deepika Padukone',
    image: '/images/face-mash/002/actor2.jpg',
    gender: 'female',
    hints: [
      { type: 'gender', content: 'Female' },
      { type: 'birth_year', content: 'Born in 1986' },
      { type: 'famous_movies', content: 'Known for: Padmaavat, Cocktail' },
      { type: 'initials', content: 'D.P.' }
    ]
  },
  mashedImage: '/images/face-mash/002/morphed.png'
}
```

3. Ensure actor names exist in `src/data/actorsData.ts` for autocomplete functionality

### Testing Changes

1. **Functional Testing**: 
   - Play through games to ensure core functionality works
   - Test replay functionality and cooldown bypass
   - Verify share modal functionality across all states
   - Test duplicate guess prevention and smart assignment

2. **Browser DevTools**: 
   - Check console for errors and warnings
   - Monitor localStorage for proper state management
   - Verify network requests for image loading

3. **Responsive Testing**: 
   - Test on different screen sizes using browser dev tools
   - Ensure touch interactions work on mobile devices
   - Verify game grid layouts adapt properly

4. **Storage Testing**: 
   - Clear localStorage to test fresh user experience
   - Test replay functionality with existing progress
   - Verify cooldown state persistence across browser sessions

5. **Component Testing**:
   - Test reusable components in different contexts
   - Verify proper prop passing between components
   - Test error states and edge cases

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
- Monitor Application tab for localStorage issues

**Common Issues**:
- **Images not loading**: Check file paths, folder structure, and supported formats (WebP, JPG, PNG)
- **State not updating**: Verify useState and setter functions, check for proper dependencies in useEffect
- **Navigation broken**: Check route definitions in App.tsx and component imports
- **Replay not working**: Verify cooldown clearing and state reset in handleReplay functions
- **Share modal issues**: Check modal state management and props passing
- **Duplicate guess issues**: Verify duplicate detection logic and guess processing

### 2. Adding New Actor Data

Edit `src/data/actorsData.ts` to add new actors for autocomplete with aliases and search terms:

```typescript
export const actorsData = [
  { 
    name: 'Shah Rukh Khan', 
    aliases: ['SRK', 'King Khan', 'Shahrukh Khan'],
    searchTerms: ['bollywood', 'king', 'dilwale', 'ddlj']
  },
  { 
    name: 'Deepika Padukone', 
    aliases: ['DP', 'Deepika'],
    searchTerms: ['padmaavat', 'cocktail', 'ram leela']
  },
  // Add new actors with comprehensive search data
];

// Function for fuzzy matching and alias support
export const getActorSuggestions = (query: string): ActorData[] => {
  if (!query || query.length < 2) return [];
  
  const queryLower = query.toLowerCase();
  return actorsData.filter(actor => 
    actor.name.toLowerCase().includes(queryLower) ||
    actor.aliases.some(alias => alias.toLowerCase().includes(queryLower)) ||
    actor.searchTerms.some(term => term.toLowerCase().includes(queryLower))
  ).slice(0, 10); // Limit suggestions
};
```

### 3. Customizing Styles

The project uses Tailwind CSS with custom color palette. Common customizations:

**Colors** (in `tailwind.config.js`):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'bollywood-gold': '#FFD700',
        'bollywood-red': '#DC2626',
        'bollywood-orange': '#EA580C',
        'bollywood-teal': '#14B8A6',
        // Add custom colors for new games
      }
    }
  }
}
```

**Component Styles** (using Tailwind classes):
```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">
  Custom styled element with hover effects
</div>
```

**Game-Specific Styling**:
```tsx
// Connections difficulty colors
const difficultyColors = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500', 
  hard: 'bg-orange-500',
  expert: 'bg-red-500'
};

// Face Mash visual feedback
const feedbackClasses = {
  correct: 'border-green-500 bg-green-50',
  wrong: 'border-red-500 bg-red-50',
  selected: 'border-blue-500 bg-blue-50'
};
```

### 4. Managing Game Difficulty and Features

**Game Configuration Updates**:

**Connections Difficulty Levels**:
- `easy`: Green color, obvious connections (movies by same director)
- `medium`: Yellow color, moderate difficulty (actors in same movie)
- `hard`: Orange color, requires more thought (thematic connections)
- `expert`: Red color, very challenging (subtle or wordplay connections)

**Face Mash Enhanced Features**:
- **Progressive Hint System**: 4 levels of hints with context-aware content
- **Gender-Specific Placeholders**: Male/female unknown actor images
- **Smart Guess Assignment**: Automatically assigns correct guesses to appropriate actor
- **Visual Feedback**: Target highlighting and success animations
- **Duplicate Prevention**: Blocks repeated guesses with user feedback

**Attempt Limits**:
```typescript
// In gameConfig.ts
export const GAME_CONFIG = {
  MAX_ATTEMPTS: {
    CONNECTIONS: 4,    // 4 attempts to find all groups
    FACE_MASH: 10     // 10 attempts to find both actors
  },
  COOLDOWN_PERIOD: 12 * 60 * 60 * 1000, // 12 hours
  HINT_PROGRESSION: {
    FACE_MASH: ['gender', 'birth_year', 'famous_movies', 'initials']
  }
};
```

**Replay System Configuration**:
- Clears both game progress and cooldown state
- Resets all component state to initial values
- Maintains user statistics for tracking
- Closes any open modals or overlays

---

This documentation reflects the enhanced Den of Bollywood codebase with modular architecture, comprehensive component reuse, and advanced game features. The application now provides a more polished user experience with replay functionality, enhanced visual feedback, and robust error handling.

### Recent Major Improvements (2025):
- **Modular Component Architecture**: Games organized in separate folders with reusable sub-components
- **Replay System**: Complete game restart with cooldown bypass functionality  
- **Enhanced UI/UX**: Gender-specific placeholders, visual feedback, aligned layouts
- **Smart Game Logic**: Duplicate prevention, auto-assignment, "one away" detection
- **Share Integration**: Comprehensive share functionality across all game states
- **Code Reuse**: Controls and cooldown views shared between games
- **Robust State Management**: Enhanced localStorage utilities and cleanup functions

For questions or contributions, refer to the inline code comments, TypeScript type definitions, and component prop interfaces for additional context. The modular structure makes it easy to extend with new games while maintaining code quality and consistency.
