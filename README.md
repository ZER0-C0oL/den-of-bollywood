# Den of Bollywood - Gaming Website

A React-based Bollywood gaming website featuring multiple daily games with a 12-hour cooldown system and replay functionality.

## 🎮 Games Available

### 1. Connections
- Find groups of 4 related Bollywood items*This is a React-based progressive web application built with TypeScript, Tailwind CSS, and modern React patterns. Each game is designed to be modular, reusable, and extensible for future development.*ovies, actors, directors, etc.)
- Similar to NYT Connections but with Bollywood themes
- 4 attempts to find all 4 groups
- Color-coded difficulty levels with visual feedback
- **Location**: `src/components/games/connections/`

### 2. Face Mash
- Guess both actors from their merged/mashed faces
- Auto-complete suggestions for actor names
- 10 attempts with progressive hints (gender, birth date, movies, initials)
- Gender-specific unknown actor placeholders
- Duplicate guess prevention and smart assignment
- **Location**: `src/components/games/facemash/`

## 🚀 Features

- **Replay System**: Restart games immediately, bypassing cooldown
- **Smart Cooldown**: 12-hour cooldown with visual countdown timer
- **Reusable Components**: Modular game components for code reuse
- **Local Storage**: Progress and stats saved locally with proper cleanup
- **Progressive Hints**: Context-aware hints revealed after wrong attempts
- **Responsive Design**: Tailwind CSS with mobile-first approach
- **Game Navigation**: Easy switching between games from any state
- **Share Functionality**: Share game results with formatted text
- **Error Prevention**: Duplicate guess detection and validation

## 🛠 Installation & Setup

1. **Clone and navigate to the project:**
   ```bash
   cd /Users/msankhere/Documents/den-of-bollywood
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── GameLayout.tsx           # Shared layout wrapper
│   ├── GameNavigation.tsx       # Game selection dropdown
│   ├── HomePage.tsx            # Main landing page with game cards
│   ├── ShareModal.tsx          # Reusable share modal component
│   └── games/
│       ├── connections/        # Connections game components
│       │   ├── ConnectionsGame.tsx
│       │   ├── ConnectionsControls.tsx
│       │   ├── ConnectionsCooldownView.tsx
│       │   ├── ConnectionsGameService.ts
│       │   ├── ConnectionsGrid.tsx
│       │   └── SolvedGroups.tsx
│       └── facemash/          # Face Mash game components
│           ├── FaceMashGame.tsx
│           ├── FaceMashActorFrame.tsx
│           ├── FaceMashControls.tsx
│           ├── FaceMashCooldownView.tsx
│           ├── FaceMashGameService.ts
│           ├── FaceMashGuessHistory.tsx
│           └── FaceMashHints.tsx
├── constants/
│   └── gameConfig.ts           # Game constants and configuration
├── data/
│   ├── actorsData.ts          # Bollywood actors database with search
│   ├── connectionsData.ts     # Daily connections puzzles
│   └── faceMashData.ts        # Face mash game data and hints
├── services/
│   ├── cooldownService.ts     # Game cooldown management
│   ├── gameCalculationService.ts  # Score calculations
│   └── gameStateService.ts    # Game state management
├── types/
│   └── gameTypes.ts           # TypeScript interfaces and types
├── utils/
│   ├── gameStorage.ts         # localStorage utilities and management
│   └── shareUtils.ts          # Share text generation utilities
└── App.tsx                    # Main app with routing and navigation
```

## 🎯 Adding New Games

### For Connections:
1. Edit `src/data/connectionsData.ts`
2. Add new game objects with 4 groups of 4 items each
3. Set appropriate difficulty levels and colors
4. Game components are modular and reusable

### For Face Mash:
1. Add images to `public/images/face-mash/[game-number]/`
   - `actor1.webp` or `actor1.jpg` - First actor
   - `actor2.webp` or `actor2.jpg` - Second actor  
   - `morphed.png` - Merged face image
2. Edit `src/data/faceMashData.ts` with game data and hints
3. Ensure actor names exist in `actorsData.ts` for autocomplete

### For New Game Types:
1. Create game folder in `src/components/games/[game-name]/`
2. Follow the modular component pattern (Game, Controls, CooldownView, GameService)
3. Add game type to `src/constants/gameConfig.ts`
4. Add data file in `src/data/`
5. Update navigation in `src/components/GameNavigation.tsx`
6. Add route in `src/App.tsx`
7. Implement replay functionality and cooldown management

## ⚙️ Configuration

### Game Settings (in `src/constants/gameConfig.ts`):
- `COOLDOWN_PERIOD`: Time between games (default: 12 hours)
- `MAX_ATTEMPTS`: Maximum attempts per game (Connections: 4, Face Mash: 10)
- `MAX_HINTS`: Maximum hints to show per actor (default: 4)

### Storage Management:
- Game progress automatically saved and restored
- Cooldown state persists across browser sessions
- Replay functionality clears both progress and cooldown
- Clean storage management prevents data bloat

### Customizing Colors:
Tailwind CSS custom colors defined in `tailwind.config.js`:
- `bollywood-gold`: #FFD700
- `bollywood-red`: #DC2626
- `bollywood-orange`: #EA580C
- `bollywood-teal`: #14B8A6

## 🚀 Deployment

The project is configured for GitHub Pages deployment:

1. **Set up repository:**
   - Ensure the repository is named `den-of-bollywood`
   - Update homepage in `package.json` if different

2. **Deploy:**
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings > Pages
   - Select `gh-pages` branch as source

## 🎨 Adding Images for Face Mash

Place images in this structure:
```
public/images/face-mash/
├── 001/
│   ├── actor1.webp (or .jpg)
│   ├── actor2.jpg (or .webp)
│   └── morphed.png
├── 002/
│   ├── actor1.webp
│   ├── actor2.jpg
│   └── morphed.png
└── ...
```

**Image Requirements:**
- Format: WebP, JPG, or PNG supported
- Size: 400x400px recommended for actors, any size for morphed
- High quality for better recognition
- Neutral backgrounds work best
- Actor images should be clear headshots

**Unknown Actor Placeholders:**
- Male unknown: `public/images/icons/male-unknown.png`
- Female unknown: `public/images/icons/female-unknown.png`

## 🔧 Development Notes

- **Modular Architecture**: Games are organized in separate folders with reusable components
- **Local Storage**: All progress saved in browser localStorage with cleanup utilities
- **TypeScript**: Full TypeScript support for type safety across all components
- **Responsive**: Mobile-first design approach with Tailwind CSS
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized builds with code splitting and lazy loading
- **Code Reuse**: Shared components (Controls, CooldownView) reduce duplication
- **Error Handling**: Comprehensive error handling and user feedback
- **State Management**: Centralized game state services for consistency

## 🎮 Game Features

### Connections Game:
- Visual feedback with color-coded groups
- One-away detection for near misses
- Shuffle functionality for better visibility
- Solution reveal in cooldown view
- Reusable grid and solved groups components

### Face Mash Game:
- Gender-aware unknown actor placeholders
- Visual feedback for correct/incorrect guesses
- Progressive hint system with context
- Guess history with proper alignment
- Auto-suggestion with fuzzy matching
- Duplicate guess prevention

## 📝 Future Enhancements

- Add more game types (Word puzzles, Music quiz, Movie timeline)
- User accounts and cloud sync for cross-device play
- Leaderboards and social features
- Push notifications for new daily games
- Offline mode support with service workers
- Multi-language support (Hindi, English)
- Analytics and user behavior tracking
- Advanced sharing with visual game boards

## 🐛 Troubleshooting

- **Build fails**: Check Tailwind CSS version compatibility and TypeScript errors
- **Images not loading**: Verify correct folder structure in `public/images/`
- **Navigation issues**: Ensure React Router is properly configured
- **Storage issues**: Clear localStorage for fresh start using browser dev tools
- **Cooldown not working**: Check `CooldownService` and localStorage permissions
- **Replay button issues**: Ensure game progress and cooldown are properly cleared
- **Share modal not showing**: Verify ShareModal props and state management
- **Game state inconsistency**: Use browser dev tools to inspect localStorage data

## 📜 License

This project is for personal use. All Bollywood content references are for educational/entertainment purposes.

---

*This is a React-based progressive web application built with TypeScript, Tailwind CSS, and modern React patterns. Each game is designed to be modular, reusable, and extensible for future development.*
