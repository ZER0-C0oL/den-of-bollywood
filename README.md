# Den of Bollywood - Gaming Website

A React-based Bollywood gaming website featuring multiple daily games with a 12-hour cooldown system.

## 🎮 Games Available

### 1. Connections
- Find groups of 4 related Bollywood items (movies, actors, directors, etc.)
- Similar to NYT Connections but with Bollywood themes
- 5 attempts to find all 4 groups
- Hints provided through group difficulty levels

### 2. Face Mash
- Guess both actors from their merged/mashed faces
- Auto-complete suggestions for actor names
- 5 attempts with progressive hints (gender, birth date, movies, initials)
- Images to be placed in specific folder structure

## 🚀 Features

- **Daily Cooldown System**: Each game playable once every 12 hours
- **Local Storage**: Progress and stats saved locally
- **Progressive Hints**: Hints revealed after wrong attempts
- **Responsive Design**: Tailwind CSS for modern UI
- **Game Navigation**: Easy switching between games
- **Statistics Tracking**: Personal stats and streaks
- **Autocomplete**: Smart actor name suggestions

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
│   ├── ConnectionsGame.tsx    # Connections game logic
│   ├── FaceMashGame.tsx      # Face mash game logic
│   ├── GameLayout.tsx        # Shared layout component
│   ├── GameNavigation.tsx    # Navigation dropdown
│   └── HomePage.tsx          # Main landing page
├── constants/
│   └── gameConfig.ts         # Game constants and config
├── data/
│   ├── actorsData.ts         # Bollywood actors database
│   ├── connectionsData.ts    # Connections game data
│   └── faceMashData.ts       # Face mash game data
├── types/
│   └── gameTypes.ts          # TypeScript interfaces
├── utils/
│   └── gameStorage.ts        # localStorage utilities
└── App.tsx                   # Main app with routing
```

## 🎯 Adding New Games

### For Connections:
1. Edit `src/data/connectionsData.ts`
2. Add new game objects with 4 groups of 4 items each
3. Set appropriate difficulty levels and colors

### For Face Mash:
1. Add images to `public/images/face-mash/[game-number]/`
   - `actor1.png` - First actor
   - `actor2.png` - Second actor  
   - `mashed.png` - Merged face
2. Edit `src/data/faceMashData.ts` with game data and hints

### For New Game Types:
1. Create game component in `src/components/`
2. Add game type to `src/constants/gameConfig.ts`
3. Add data file in `src/data/`
4. Update navigation in `src/components/GameNavigation.tsx`
5. Add route in `src/App.tsx`

## ⚙️ Configuration

### Game Settings (in `src/constants/gameConfig.ts`):
- `COOLDOWN_PERIOD`: Time between games (default: 12 hours)
- `MAX_ATTEMPTS`: Maximum attempts per game (default: 5)
- `MAX_HINTS`: Maximum hints to show (default: 4)

### Customizing Colors:
Tailwind CSS custom colors defined in `tailwind.config.js`:
- `bollywood-gold`: #FFD700
- `bollywood-red`: #DC2626
- `bollywood-orange`: #EA580C

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
│   ├── actor1.png
│   ├── actor2.png
│   └── mashed.png
├── 002/
│   ├── actor1.png
│   ├── actor2.png
│   └── mashed.png
└── ...
```

**Image Requirements:**
- Format: PNG preferred
- Size: 400x400px recommended
- High quality for better recognition
- Neutral backgrounds work best

## 🔧 Development Notes

- **Local Storage**: All progress saved in browser localStorage
- **TypeScript**: Full TypeScript support for type safety
- **Responsive**: Mobile-first design approach
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized builds with code splitting

## 📝 Future Enhancements

- Add more game types (Word puzzles, Music quiz, etc.)
- User accounts and cloud sync
- Leaderboards and social features
- Push notifications for new games
- Offline mode support
- Multi-language support

## 🐛 Troubleshooting

- **Build fails**: Check Tailwind CSS version compatibility
- **Images not loading**: Verify correct folder structure in `public/images/`
- **Navigation issues**: Ensure React Router is properly configured
- **Storage issues**: Clear localStorage for fresh start

## 📜 License

This project is for personal use. All Bollywood content references are for educational/entertainment purposes.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
