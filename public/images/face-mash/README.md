# Face Mash Game Images

This directory structure is designed to hold the face mash game images in a specific format:

## Directory Structure:
```
/public/images/face-mash/
├── 001/
│   ├── actor1.png    # First actor's image
│   ├── actor2.png    # Second actor's image
│   └── mashed.png    # Merged/mashed face image
├── 002/
│   ├── actor1.png
│   ├── actor2.png
│   └── mashed.png
└── ...
```

## Adding New Games:
1. Create a new numbered folder (003, 004, etc.)
2. Add the three required images:
   - `actor1.png` - Clear image of the first actor
   - `actor2.png` - Clear image of the second actor  
   - `mashed.png` - The merged face image
3. Update the `faceMashData.ts` file with the corresponding game data

## Image Requirements:
- Format: PNG preferred (JPG also acceptable)
- Size: 400x400px recommended for consistency
- Quality: High resolution for better game experience
- Background: Preferably neutral/transparent

## Hints File:
Each game should also have corresponding hint data in the `faceMashData.ts` file including:
- Gender
- Birth date/year
- Famous movies
- Initials
