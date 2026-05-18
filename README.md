# 2048 Game

A modern, responsive, and highly-featured implementation of the popular 2048 puzzle game built with HTML, CSS, and JavaScript.

## 🎮 How to Play

- Use **arrow keys** (desktop) or **swipe gestures** (mobile) to move tiles
- When two tiles with the same number touch, they merge into one
- Try to create a tile with the number **2048** to win!
- The game ends when you can't make any more moves

## 🚀 Features

- **Time Travel** - Full Undo and Redo functionality to reverse your mistakes and explore alternate timelines!
- **Challenge Modes** - Play Classic, Timed (race against the clock), or Limited Moves (strategize your path).
- **Auto-Save & Resume** - Your game state, including undo history and challenge timers, is saved to your browser. Close the tab and resume exactly where you left off.
- **Custom Themes** - Choose between Light, Dark, and a glowing Neon theme.
- **Dynamic Board Sizes** - Play on 3x3, 4x4, or 5x5 grids for varying difficulty.
- **Endless Mode** - Reached 2048? Hit "Keep Playing" to chase 4096, 8192, and beyond.
- **Leaderboard** - Tracks and saves your top 5 high scores locally.
- **Audio & Haptics** - Custom synthesizer sounds (Web Audio API) for slides, merges, and game over, plus mobile haptic feedback.
- **Share Score** - Easily share your high scores with friends using native Web Share API.
- **Responsive design** - Works seamlessly on desktop, tablet, and mobile devices.

## 📁 Project Structure

```tree
2048/
├── index.html      # Main HTML structure and UI
├── styles.css      # All styling, animations, and themes
├── script.js       # Game logic, state management, and audio engine
├── README.md       # Project documentation
└── LICENSE         # License file
```

## 🛠️ Technical Details

### Architecture

- **Modular design** - Separated HTML, CSS, and JavaScript for better maintainability
- **State Management** - Complex state handling that persists across sessions via `localStorage`
- **Native Audio** - Built-in procedural audio engine without any external audio files
- **Mobile-first** - Touch events and responsive breakpoints

### Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Grid layout, animations, theme variables, and responsive design
- **JavaScript (ES6+)** - Game logic, DOM manipulation, Web Audio API, Web Share API
- **Tailwind CSS** - Utility-first CSS framework for layout
- **Google Fonts** - Inter font family for typography

### Key Features Implementation

- **Board rotation algorithm** - Simplifies movement logic for all directions
- **Tile merging system** - Handles combining identical adjacent tiles
- **Audio Synthesizer** - Uses `AudioContext` oscillators for rich, dynamic sounds
- **State Serialization** - Deep copies game boards for the undo/redo stacks

## 🎯 Game Mechanics

### Movement Algorithm

1. **Compress** - Move all non-zero tiles to one side
2. **Merge** - Combine adjacent identical tiles
3. **Compress again** - Fill gaps after merging
4. **Add new tile** - Place a random 2 or 4 on the board

### Board Rotation

The game uses a clever rotation technique where all movements are converted to "left" movements by rotating the board, applying the movement logic, then rotating back.

## 🎨 Styling Features

- **Theme Engine** - Pure CSS overrides for instant theme switching (Light/Dark/Neon)
- **Responsive typography** - Font sizes adapt to screen size
- **Smooth animations** - Scale-in for new tiles, pop effect for merges
- **Modern shadows** - Subtle box-shadows for depth

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Start playing** using arrow keys or touch gestures

No build process or dependencies required - just open and play!

## 📱 Browser Compatibility

- **Modern browsers** - Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile browsers** - iOS Safari, Chrome Mobile, Samsung Internet
- **Touch support** - Full gesture support on touch devices

## 🎮 Controls

### Desktop

- **↑ Arrow Key** - Move tiles up
- **↓ Arrow Key** - Move tiles down
- **← Arrow Key** - Move tiles left
- **→ Arrow Key** - Move tiles right
- **New Game Button** - Start a new game
- **Undo Button** - Go back one move
- **Redo Button** - Go forward one move

### Mobile/Touch

- **Swipe Up** - Move tiles up
- **Swipe Down** - Move tiles down
- **Swipe Left** - Move tiles left
- **Swipe Right** - Move tiles right
- **Tap Buttons** - UI is fully optimized for touch

## 🏆 Game Rules

1. Start with two random tiles (2 or 4)
2. Use directional inputs to slide tiles
3. When two tiles with the same number touch, they merge
4. Each move adds a new random tile (90% chance of 2, 10% chance of 4)
5. Win by creating a 2048 tile (or keep playing to reach higher numbers)
6. Lose when no moves are possible (or time/moves run out in challenge modes)

## 📈 Scoring

- Score increases when tiles merge
- Points earned equal the value of the new merged tile
- Try to achieve the highest score possible!

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements:

- Bug fixes
- New features
- UI/UX enhancements
- Performance optimizations

## 📄 License

See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Inspired by the original 2048 game created by Gabriele Cirulli.
