let BOARD_SIZE = 4;
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

let keepPlaying = false;
let challengeMode = 'classic';
let timeRemaining = 120;
let movesRemaining = 100;
let timerInterval = null;

// Touch event variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

let undoStack = [];
let redoStack = [];
let highScore = 0;

// Leaderboard logic
const LEADERBOARD_KEY = 'leaderboard';
const LEADERBOARD_SIZE = 5;
const leaderboardButton = document.getElementById('leaderboard-button');
const leaderboardModal = document.getElementById('leaderboard-modal');
const leaderboardList = document.getElementById('leaderboard-list');
const closeLeaderboard = document.getElementById('close-leaderboard');

function saveStateToStorage() {
    const gameState = {
        board, score, isGameOver, isGameWon, keepPlaying, 
        challengeMode, timeRemaining, movesRemaining, undoStack, redoStack
    };
    localStorage.setItem('2048-gameState', JSON.stringify(gameState));
}

function loadStateFromStorage() {
    const stateStr = localStorage.getItem('2048-gameState');
    if (stateStr) {
        const state = JSON.parse(stateStr);
        board = state.board;
        score = state.score;
        isGameOver = state.isGameOver;
        isGameWon = state.isGameWon;
        keepPlaying = state.keepPlaying || false;
        challengeMode = state.challengeMode || 'classic';
        timeRemaining = state.timeRemaining || 120;
        movesRemaining = state.movesRemaining || 100;
        undoStack = state.undoStack || [];
        redoStack = state.redoStack || [];
        document.getElementById('challenge-mode').value = challengeMode;
        return true;
    }
    return false;
}

/**
 * Initializes the game board and starts a new game.
 */
function initializeGame(fromStorage = false) {
    if (!fromStorage || !loadStateFromStorage()) {
        undoStack = [];
        redoStack = [];
        board = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
        score = 0;
        isGameOver = false;
        isGameWon = false;
        keepPlaying = false;
        
        challengeMode = document.getElementById('challenge-mode').value;
        if (challengeMode === 'timed') timeRemaining = 120;
        if (challengeMode === 'limited-moves') movesRemaining = 100;
        
        addRandomTile();
        addRandomTile();
    }
    
    scoreDisplay.textContent = score;
    gameMessage.classList.remove('active');
    document.getElementById('keep-playing-button').classList.add('hidden');
    document.getElementById('share-button').classList.add('hidden');
    
    updateChallengeStatus();
    renderBoard();
    loadHighScore();
    
    if (challengeMode === 'timed' && !isGameOver && !(isGameWon && !keepPlaying)) {
        startTimer();
    } else {
        stopTimer();
    }
    saveStateToStorage();
}

function updateChallengeStatus() {
    const container = document.getElementById('challenge-status-container');
    const statusText = document.getElementById('challenge-status');
    if (challengeMode === 'classic') {
        container.classList.add('hidden');
    } else {
        container.classList.remove('hidden');
        if (challengeMode === 'timed') {
            statusText.textContent = `Time Remaining: ${timeRemaining}s`;
        } else if (challengeMode === 'limited-moves') {
            statusText.textContent = `Moves Remaining: ${movesRemaining}`;
        }
    }
}

function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        if (timeRemaining > 0 && !isGameOver && !(isGameWon && !keepPlaying)) {
            timeRemaining--;
            updateChallengeStatus();
            saveStateToStorage();
            if (timeRemaining <= 0) {
                isGameOver = true;
                stopTimer();
                checkGameStatus();
            }
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
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
            const gridCell = document.createElement('div');
            gridCell.classList.add('grid-cell');
            gameBoard.appendChild(gridCell);

            if (board[r][c] !== 0) {
                const tile = document.createElement('div');
                tile.classList.add('tile', `tile-${board[r][c]}`);
                tile.textContent = board[r][c];
                tile.classList.add('tile-new');
                gridCell.appendChild(tile);
            }
        }
    }
}

function compressLine(line) {
    let newLine = line.filter(val => val !== 0);
    while (newLine.length < BOARD_SIZE) {
        newLine.push(0);
    }
    return newLine;
}

function mergeLine(line) {
    let merged = false;
    for (let i = 0; i < BOARD_SIZE - 1; i++) {
        if (line[i] !== 0 && line[i] === line[i + 1]) {
            line[i] *= 2;
            score += line[i];
            line[i + 1] = 0;
            merged = true;
            playSound('merge');
            if (line[i] === 2048 && !keepPlaying) {
                isGameWon = true;
            }
        }
    }
    return { newLine: line, merged: merged };
}

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

function move(direction) {
    if (isGameOver || (isGameWon && !keepPlaying)) return;
    saveState();

    let moved = false;
    let rotatedBoard = board;
    let rotationsNeeded = 0;
    
    switch (direction) {
        case 'up': rotationsNeeded = 3; break;
        case 'right': rotationsNeeded = 2; break;
        case 'down': rotationsNeeded = 1; break;
        case 'left': default: rotationsNeeded = 0; break;
    }

    rotatedBoard = rotateBoard(board, rotationsNeeded);

    for (let r = 0; r < BOARD_SIZE; r++) {
        let line = rotatedBoard[r];
        let compressed = compressLine(line);
        let { newLine, merged } = mergeLine(compressed);
        let finalLine = compressLine(newLine);

        if (JSON.stringify(line) !== JSON.stringify(finalLine)) {
            moved = true;
        }
        rotatedBoard[r] = finalLine;
    }

    board = rotateBoard(rotatedBoard, (4 - rotationsNeeded) % 4);

    if (moved) {
        redoStack = []; // Clear redo stack when a new move is made
        playSound('slide');
        if (navigator.vibrate) navigator.vibrate(50);
        
        if (challengeMode === 'limited-moves') {
            movesRemaining--;
            updateChallengeStatus();
            if (movesRemaining <= 0) {
                isGameOver = true;
            }
        }
        
        scoreDisplay.textContent = score;
        addRandomTile();
        renderBoard();
        checkGameStatus();
        updateHighScore();
        saveStateToStorage();
    } else {
        undoStack.pop();
        checkGameStatus(true);
    }
}

function hasAvailableMoves() {
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] === 0) return true;
        }
    }
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE - 1; c++) {
            if (board[r][c] !== 0 && board[r][c] === board[r][c + 1]) return true;
        }
    }
    for (let r = 0; r < BOARD_SIZE - 1; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            if (board[r][c] !== 0 && board[r][c] === board[r + 1][c]) return true;
        }
    }
    return false;
}

function checkGameStatus(forceCheckGameOver = false) {
    if (isGameWon && !keepPlaying) {
        messageText.textContent = 'You Win!';
        gameMessage.classList.add('active');
        document.getElementById('keep-playing-button').classList.remove('hidden');
        document.getElementById('share-button').classList.remove('hidden');
        playSound('win');
        stopTimer();
        return;
    }

    if (isGameOver || !hasAvailableMoves()) {
        isGameOver = true;
        messageText.textContent = 'Game Over!';
        gameMessage.classList.add('active');
        document.getElementById('share-button').classList.remove('hidden');
        playSound('lose');
        stopTimer();
    }
}

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') move('up');
    else if (e.key === 'ArrowDown') move('down');
    else if (e.key === 'ArrowLeft') move('left');
    else if (e.key === 'ArrowRight') move('right');
});

newGameButton.addEventListener('click', () => initializeGame(false));
newGameButtonMessage.addEventListener('click', () => initializeGame(false));

document.getElementById('challenge-mode').addEventListener('change', () => initializeGame(false));

document.getElementById('keep-playing-button').addEventListener('click', () => {
    keepPlaying = true;
    gameMessage.classList.remove('active');
    document.getElementById('keep-playing-button').classList.add('hidden');
    saveStateToStorage();
    if (challengeMode === 'timed') startTimer();
});

document.getElementById('share-button').addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: '2048 Game',
            text: `I scored ${score} in 2048! Can you beat my score?`,
            url: window.location.href
        }).catch(console.error);
    } else {
        alert(`Score: ${score}. (Web Share API not supported on this browser)`);
    }
});

gameBoard.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
}, { passive: false });

gameBoard.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

gameBoard.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 50) {
        if (Math.abs(dx) > Math.abs(dy)) {
            dx > 0 ? move('right') : move('left');
        } else {
            dy > 0 ? move('down') : move('up');
        }
    }
});

const undoButton = document.getElementById('undo-button');
if (undoButton) undoButton.addEventListener('click', undoMove);

const redoButton = document.getElementById('redo-button');
if (redoButton) redoButton.addEventListener('click', redoMove);

const themeSelect = document.getElementById('theme-select');
function applyTheme(theme) {
    document.body.classList.remove('dark-mode', 'theme-neon');
    if (theme === 'dark') document.body.classList.add('dark-mode');
    if (theme === 'neon') document.body.classList.add('theme-neon');
    localStorage.setItem('2048-theme', theme);
    if(themeSelect) themeSelect.value = theme;
}

if (themeSelect) {
    themeSelect.addEventListener('change', (e) => applyTheme(e.target.value));
}

function loadTheme() {
    const savedTheme = localStorage.getItem('2048-theme') || 'light';
    applyTheme(savedTheme);
}

const boardSizeSelect = document.getElementById('board-size');
boardSizeSelect.addEventListener('change', (e) => {
    BOARD_SIZE = parseInt(e.target.value);
    initializeGame(false);
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;
});

window.onload = function() {
    loadHighScore();
    loadTheme();
    BOARD_SIZE = parseInt(boardSizeSelect.value);
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;
    
    if (localStorage.getItem('2048-gameState')) {
        initializeGame(true);
    } else {
        initializeGame(false);
    }
};

function saveState() {
    undoStack.push({
        board: JSON.parse(JSON.stringify(board)),
        score: score,
        isGameOver: isGameOver,
        isGameWon: isGameWon,
        timeRemaining: timeRemaining,
        movesRemaining: movesRemaining
    });
    if (undoStack.length > 20) undoStack.shift();
}

function undoMove() {
    if (undoStack.length > 0) {
        // Push current state to redoStack before undoing
        redoStack.push({
            board: JSON.parse(JSON.stringify(board)),
            score: score,
            isGameOver: isGameOver,
            isGameWon: isGameWon,
            timeRemaining: timeRemaining,
            movesRemaining: movesRemaining
        });
        if (redoStack.length > 20) redoStack.shift();

        const prev = undoStack.pop();
        board = JSON.parse(JSON.stringify(prev.board));
        score = prev.score;
        isGameOver = prev.isGameOver;
        isGameWon = prev.isGameWon;
        timeRemaining = prev.timeRemaining;
        movesRemaining = prev.movesRemaining;
        
        scoreDisplay.textContent = score;
        renderBoard();
        updateChallengeStatus();
        gameMessage.classList.remove('active');
        saveStateToStorage();
    }
}

function redoMove() {
    if (redoStack.length > 0) {
        // Push current state to undoStack before redoing
        undoStack.push({
            board: JSON.parse(JSON.stringify(board)),
            score: score,
            isGameOver: isGameOver,
            isGameWon: isGameWon,
            timeRemaining: timeRemaining,
            movesRemaining: movesRemaining
        });
        if (undoStack.length > 20) undoStack.shift();

        const next = redoStack.pop();
        board = JSON.parse(JSON.stringify(next.board));
        score = next.score;
        isGameOver = next.isGameOver;
        isGameWon = next.isGameWon;
        timeRemaining = next.timeRemaining;
        movesRemaining = next.movesRemaining;
        
        scoreDisplay.textContent = score;
        renderBoard();
        updateChallengeStatus();
        gameMessage.classList.remove('active');
        saveStateToStorage();
    }
}

function getLeaderboard() {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
}

function saveLeaderboard(leaderboard) {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

function updateLeaderboard(newScore) {
    let leaderboard = getLeaderboard();
    leaderboard.push(newScore);
    leaderboard = leaderboard.sort((a, b) => b - a).slice(0, LEADERBOARD_SIZE);
    saveLeaderboard(leaderboard);
}

function renderLeaderboard() {
    const leaderboard = getLeaderboard();
    leaderboardList.innerHTML = '';
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<li>No scores yet.</li>';
    } else {
        leaderboard.forEach((score) => {
            const li = document.createElement('li');
            li.textContent = `${score}`;
            leaderboardList.appendChild(li);
        });
    }
}

leaderboardButton.addEventListener('click', () => {
    renderLeaderboard();
    leaderboardModal.classList.remove('hidden');
});

closeLeaderboard.addEventListener('click', () => {
    leaderboardModal.classList.add('hidden');
});

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        updateLeaderboard(highScore);
    }
    document.getElementById('high-score').textContent = highScore;
}

function loadHighScore() {
    highScore = parseInt(localStorage.getItem('highScore')) || 0;
    document.getElementById('high-score').textContent = highScore;
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (!audioCtx || audioCtx.state === 'suspended') {
        if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        return;
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'slide') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'merge') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(554, audioCtx.currentTime + 0.2);
        osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
    } else if (type === 'lose') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    }
}