# 2048 Game

A modern, responsive implementation of the popular 2048 puzzle game built with HTML, CSS, and JavaScript.

## 🎮 How to Play

- Use **arrow keys** (desktop) or **swipe gestures** (mobile) to move tiles
- When two tiles with the same number touch, they merge into one
- Try to create a tile with the number **2048** to win!
- The game ends when you can't make any more moves

## 🚀 Features

- **Responsive design** - Works on desktop, tablet, and mobile devices
- **Touch controls** - Full swipe gesture support for mobile
- **Smooth animations** - Tiles appear and merge with smooth transitions
- **Modern UI** - Clean, beautiful interface using Tailwind CSS
- **Game state management** - Win/lose detection and new game functionality
- **Score tracking** - Keep track of your current score

## 📁 Project Structure

```tree
2048/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── script.js       # Game logic and functionality
├── README.md       # Project documentation
└── LICENSE         # License file
```

## 🛠️ Technical Details

### Architecture

- **Modular design** - Separated HTML, CSS, and JavaScript for better maintainability
- **Clean code** - Well-documented functions with JSDoc comments
- **Mobile-first** - Touch events and responsive breakpoints

### Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Grid layout, animations, and responsive design
- **JavaScript (ES6+)** - Game logic, DOM manipulation, and event handling
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Google Fonts** - Inter font family for typography

### Key Features Implementation

- **Board rotation algorithm** - Simplifies movement logic for all directions
- **Tile merging system** - Handles combining identical adjacent tiles
- **Animation system** - CSS keyframes for smooth tile transitions
- **Touch gesture detection** - Custom swipe detection for mobile devices

## 🎯 Game Mechanics

### Movement Algorithm

1. **Compress** - Move all non-zero tiles to one side
2. **Merge** - Combine adjacent identical tiles
3. **Compress again** - Fill gaps after merging
4. **Add new tile** - Place a random 2 or 4 on the board

### Board Rotation

The game uses a clever rotation technique where all movements are converted to "left" movements by rotating the board, applying the movement logic, then rotating back.

## 🎨 Styling Features

- **Tile color scheme** - Distinctive colors for each tile value
- **Responsive typography** - Font sizes adapt to screen size
- **Smooth animations** - Scale-in for new tiles, pop effect for merges
- **Modern shadows** - Subtle box-shadows for depth
- **Mobile optimization** - Touch-friendly button sizes

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

### Mobile/Touch

- **Swipe Up** - Move tiles up
- **Swipe Down** - Move tiles down
- **Swipe Left** - Move tiles left
- **Swipe Right** - Move tiles right
- **Tap New Game** - Start a new game

## 🏆 Game Rules

1. Start with two random tiles (2 or 4)
2. Use directional inputs to slide tiles
3. When two tiles with the same number touch, they merge
4. Each move adds a new random tile (90% chance of 2, 10% chance of 4)
5. Win by creating a 2048 tile
6. Lose when no moves are possible

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
