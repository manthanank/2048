const BOARD_SIZE = 4;
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const newGameButton = document.getElementById('new-game-button');
const newGameButtonMessage = document.getElementById('new-game-button-message');
const gameMessage = document.getElementById('game-message');
const messageText = document.getElementById('message-text');

let board = [];
let score = 0;
let isGameOver = false;
let isGameWon = false;

// Touch event variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

/**
 * Initializes the game board and starts a new game.
 */
function initializeGame() {
    board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    score = 0;
    isGameOver = false;
    isGameWon = false;
    scoreDisplay.textContent = score;
    gameMessage.classList.remove('active'); // Hide any previous game messages
    addRandomTile();
    addRandomTile();
    renderBoard();
}

/**
 * Adds a new tile (2 or 4) to a random empty cell on the board.
 */
function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === 0) {
                emptyCells.push({ r, c });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { r, c } = emptyCells[randomIndex];
        board[r][c] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
    }
}

/**
 * Renders the current state of the board to the HTML.
 */
function renderBoard() {
    gameBoard.innerHTML = ''; // Clear existing tiles
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            // Create grid cell placeholder
            const gridCell = document.createElement('div');
            gridCell.classList.add('grid-cell');
            gameBoard.appendChild(gridCell);

            // Create tile if value is not 0
            if (board[r][c] !== 0) {
                const tile = document.createElement('div');
                tile.classList.add('tile', `tile-${board[r][c]}`);
                tile.textContent = board[r][c];
                // Add animation class for new tiles (only if it's a new tile, not after a move/merge)
                // This simple approach applies to all tiles on render, which is okay for this game.
                // For more complex animations, you'd track actual new/merged tiles.
                tile.classList.add('tile-new');
                gridCell.appendChild(tile);
            }
        }
    }
}

/**
 * Compresses the tiles in a row/column, moving non-zero tiles to one side.
 * @param {number[]} line - A single row or column of the board.
 * @returns {number[]} The compressed line.
 */
function compressLine(line) {
    let newLine = line.filter(val => val !== 0);
    while (newLine.length < BOARD_SIZE) {
        newLine.push(0);
    }
    return newLine;
}

/**
 * Merges adjacent identical tiles in a row/column.
 * @param {number[]} line - A single row or column of the board.
 * @returns {{newLine: number[], merged: boolean}} The merged line and a boolean indicating if a merge occurred.
 */
function mergeLine(line) {
    let merged = false;
    for (let i = 0; i < BOARD_SIZE - 1; i++) {
        if (line[i] !== 0 && line[i] === line[i + 1]) {
            line[i] *= 2;
            score += line[i];
            line[i + 1] = 0;
            merged = true;
            if (line[i] === 2048) {
                isGameWon = true;
            }
        }
    }
    return { newLine: line, merged: merged };
}

/**
 * Rotates the board clockwise or counter-clockwise.
 * This helps in simplifying movement logic for all directions.
 * @param {number[][]} currentBoard - The board to rotate.
 * @param {number} numRotations - Number of 90-degree clockwise rotations.
 * @returns {number[][]} The rotated board.
 */
function rotateBoard(currentBoard, numRotations) {
    let newBoard = currentBoard;
    for (let n = 0; n < numRotations; n++) {
        const rotated = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                rotated[c][BOARD_SIZE - 1 - r] = newBoard[r][c];
            }
        }
        newBoard = rotated;
    }
    return newBoard;
}

/**
 * Performs a move operation in a given direction.
 * @param {string} direction - 'up', 'down', 'left', 'right'.
 */
function move(direction) {
    if (isGameOver || isGameWon) return;

    let originalBoard = JSON.parse(JSON.stringify(board)); // Deep copy
    let moved = false;

    // Rotate board so that the desired movement direction becomes 'left'
    let rotatedBoard = board;
    let rotationsNeeded = 0;
    switch (direction) {
        case 'up':
            rotationsNeeded = 3; // Rotate 270 degrees clockwise (or 90 counter-clockwise)
            break;
        case 'right':
            rotationsNeeded = 2; // Rotate 180 degrees clockwise
            break;
        case 'down':
            rotationsNeeded = 1; // Rotate 90 degrees clockwise
            break;
        case 'left':
        default:
            rotationsNeeded = 0;
            break;
    }

    rotatedBoard = rotateBoard(board, rotationsNeeded);

    for (let r = 0; r < BOARD_SIZE; r++) {
        let line = rotatedBoard[r];
        let compressed = compressLine(line);
        let { newLine, merged } = mergeLine(compressed);
        let finalLine = compressLine(newLine); // Compress again after merging

        if (JSON.stringify(line) !== JSON.stringify(finalLine)) {
            moved = true;
        }
        rotatedBoard[r] = finalLine;
    }

    // Rotate board back to original orientation
    board = rotateBoard(rotatedBoard, (4 - rotationsNeeded) % 4); // Inverse rotation

    if (moved) {
        scoreDisplay.textContent = score;
        addRandomTile();
        renderBoard();
        checkGameStatus();
    } else {
        // If no tiles moved, check if game is over (only if no moves possible)
        checkGameStatus(true);
    }
}

/**
 * Checks if there are any available moves left on the board.
 * @returns {boolean} True if moves are available, false otherwise.
 */
function hasAvailableMoves() {
    // Check for empty cells
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === 0) {
                return true;
            }
        }
    }

    // Check for adjacent identical tiles horizontally
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE - 1; c++) {
            if (board[r][c] !== 0 && board[r][c] === board[r][c + 1]) {
                return true;
            }
        }
    }

    // Check for adjacent identical tiles vertically
    for (let r = 0; r < BOARD_SIZE - 1; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== 0 && board[r][c] === board[r + 1][c]) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Checks the current game status (win/lose).
 * @param {boolean} [forceCheckGameOver=false] - If true, forces a game over check even if no move occurred.
 */
function checkGameStatus(forceCheckGameOver = false) {
    if (isGameWon) {
        messageText.textContent = 'You Win!';
        gameMessage.classList.add('active');
        return;
    }

    if (!hasAvailableMoves()) {
        isGameOver = true;
        messageText.textContent = 'Game Over!';
        gameMessage.classList.add('active');
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        move('up');
    } else if (e.key === 'ArrowDown') {
        move('down');
    } else if (e.key === 'ArrowLeft') {
        move('left');
    } else if (e.key === 'ArrowRight') {
        move('right');
    }
});

newGameButton.addEventListener('click', initializeGame);
newGameButtonMessage.addEventListener('click', initializeGame);

// Touch event listeners for mobile swipe
gameBoard.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault(); // Prevent scrolling
}, { passive: false }); // Use passive: false to allow preventDefault

gameBoard.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent scrolling while swiping
}, { passive: false });

gameBoard.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Determine if it's a horizontal or vertical swipe
    if (Math.max(absDx, absDy) > 50) { // Minimum swipe distance
        if (absDx > absDy) {
            // Horizontal swipe
            if (dx > 0) {
                move('right');
            } else {
                move('left');
            }
        } else {
            // Vertical swipe
            if (dy > 0) {
                move('down');
            } else {
                move('up');
            }
        }
    }
});

// Initialize the game when the window loads
window.onload = initializeGame;