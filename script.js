// Global variables
let players = [];
let playerColors = [];
let currentPlayer = 0;
let quizGame;

// Game board definition
const board = [
    { type: "start" },
    { type: "property", name: "Seedling Vault", price: 100, rent: 10, owner: null },
    { type: "property", name: "Optimism Hub", price: 150, rent: 15, owner: null },
    { type: "chance" },
    { type: "property", name: "Stablecoin Alley", price: 200, rent: 20, owner: null },
    { type: "property", name: "Auction Lane", price: 250, rent: 25, owner: null },
    { type: "property", name: "Collateral Corner", price: 300, rent: 30, owner: null },
    { type: "property", name: "Layer 2 Plaza", price: 350, rent: 35, owner: null },
    { type: "corner" },
    { type: "property", name: "Sequencer Street", price: 400, rent: 40, owner: null },
    { type: "property", name: "Debt Burn Bridge", price: 450, rent: 45, owner: null },
    { type: "chance" },
    { type: "property", name: "Superchain Square", price: 500, rent: 50, owner: null },
    { type: "jail" },
    { type: "property", name: "CDP Market", price: 550, rent: 55, owner: null },
    { type: "property", name: "Repayment Row", price: 600, rent: 60, owner: null },
    { type: "chance" },
    { type: "property", name: "Rollup Road", price: 650, rent: 65, owner: null },
    { type: "property", name: "Yield Fields", price: 700, rent: 70, owner: null },
    { type: "property", name: "Protocol Park", price: 750, rent: 75, owner: null },
    { type: "property", name: "Supercollateral Towers", price: 800, rent: 80, owner: null },
    { type: "corner" },
    { type: "property", name: "EVM District", price: 850, rent: 85, owner: null },
    { type: "property", name: "Foundation Avenue", price: 900, rent: 90, owner: null },
    { type: "chance" },
    { type: "property", name: "Debt-Free Estate", price: 950, rent: 95, owner: null }
];

// Event listeners setup on DOM load
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameScreen = document.getElementById('game-screen');
    const playerBtns = document.querySelectorAll('.player-btn');
    const playerColorsDiv = document.getElementById('player-colors');
    const rollButton = document.getElementById('roll-dice');

    // Handle player selection
    playerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playerBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const numPlayers = parseInt(btn.dataset.players);
            setupColorPickers(numPlayers);
            playerColorsDiv.classList.remove('hidden');
            startButton.disabled = true;
            checkColorSelection();
        });
    });

    // Start game on button click
    startButton.addEventListener('click', () => {
        if (!startButton.disabled) {
            welcomeScreen.classList.remove('active');
            gameScreen.classList.remove('hidden');
            initializeGame();
        }
    });

    // Roll dice on button click
    rollButton.addEventListener('click', rollDice);
});

// Set up color pickers for each player
function setupColorPickers(numPlayers) {
    const container = document.getElementById('player-colors');
    container.innerHTML = '';

    for (let i = 0; i < numPlayers; i++) {
        const div = document.createElement('div');
        div.className = 'color-picker';
        div.innerHTML = `
            <label>Player ${i + 1} Color:</label>
            <select id="p${i + 1}-color" onchange="checkColorSelection()">
                <option value="#ff69b4">Pink</option>
                <option value="#e91e63">Rose</option>
                <option value="#9c27b0">Purple</option>
                <option value="#3f51b5">Indigo</option>
                <option value="#2196f3">Blue</option>
                <option value="#00bcd4">Cyan</option>
                <option value="#4caf50">Green</option>
                <option value="#ff9800">Orange</option>
            </select>
        `;
        container.appendChild(div);
    }
}

// Validate unique color selections
function checkColorSelection() {
    const selects = document.querySelectorAll('[id$="-color"]');
    const colors = Array.from(selects).map(select => select.value);
    const uniqueColors = new Set(colors);
    const startButton = document.getElementById('start-game');

    startButton.disabled = uniqueColors.size !== selects.length;
    if (!startButton.disabled) {
        playerColors = colors;
    }
}

// Initialize game state
function initializeGame() {
    quizGame = new QuizGame();
    const numPlayers = playerColors.length;

    players = Array(numPlayers).fill().map((_, i) => ({
        cash: 3500, // Starting with 3500 SUPR
        position: 0,
        properties: [],
        color: playerColors[i]
    }));

    createPlayerTokens();
    updateUI('Game started! Roll to play.');
    currentPlayer = 0;
    document.getElementById('roll-dice').disabled = false;
}

// Create player tokens on the board
function createPlayerTokens() {
    const boardElement = document.getElementById('board');
    const startSpace = boardElement.querySelector('.space:first-child');

    players.forEach((player, index) => {
        const token = document.createElement('div');
        token.id = `p${index + 1}-token`;
        token.className = 'player-token';
        token.style.backgroundColor = player.color;
        startSpace.appendChild(token);
    });
}

// Handle dice roll and game logic
async function rollDice() {
    const roll = Math.floor(Math.random() * 6) + 1;
    const player = players[currentPlayer];
    player.position = (player.position + roll) % board.length;

    const space = board[player.position];
    let status = `Player ${currentPlayer + 1} rolled ${roll}, landed on ${space.name || space.type}.`;

    if (space.type === "property" && space.owner === null) {
        if (player.cash >= space.price) {
            status += " Playing a mini-game to win the property...";
            updateUI(status);

            const won = await playRandomGame();
            if (won) {
                player.cash -= space.price;
                space.owner = currentPlayer;
                player.properties.push(space.name);
                updatePropertyOwnership(player.position, player);
                status += ` Won the mini-game and bought ${space.name}!`;
            } else {
                status += " Failed the mini-game. Property not purchased.";
            }
        }
    } else if (space.type === "property" && space.owner !== null && space.owner !== currentPlayer) {
        player.cash -= space.rent;
        players[space.owner].cash += space.rent;
        status += ` Paid ${space.rent} SUPR rent to Player ${space.owner + 1}.`;
    } else if (space.type === "chance") {
        player.cash += 50;
        status += " Chance: Gained 50 SUPR!";
    } else if (space.type === "jail") {
        status += " In Jail, lose a turn.";
    }

    updateUI(status);
    checkWin();
    currentPlayer = (currentPlayer + 1) % players.length;
}

// Update property ownership visuals
function updatePropertyOwnership(spaceIndex, player) {
    const spaces = document.querySelectorAll('.space');
    const space = spaces[spaceIndex];
    if (space) {
        space.style.borderBottomColor = player.color;
        space.classList.add('space-owned');
    }
}

// Randomly select and play a mini-game
async function playRandomGame() {
    const gameChoice = Math.random();
    return gameChoice < 0.5 ? await playFlappyBird() : await playQuiz();
}

// Play Flappy Bird mini-game
async function playFlappyBird() {
    return new Promise((resolve) => {
        const modal = document.getElementById('flappyBirdModal');
        const canvas = document.getElementById('flappyBirdCanvas');
        const startButton = document.getElementById('startFlappy');
        const gameDiv = modal.querySelector('.modal-game');

        modal.classList.add('show');

        const startGame = () => {
            startButton.removeEventListener('click', startGame);
            gameDiv.classList.remove('hidden');
            startButton.style.display = 'none';

            const game = new FlappyBird(canvas);
            game.start();

            const checkScore = setInterval(() => {
                if (game.gameOver) {
                    clearInterval(checkScore);
                    setTimeout(() => {
                        modal.classList.remove('show');
                        gameDiv.classList.add('hidden');
                        startButton.style.display = 'block';
                        resolve(game.score >= 10);
                    }, 1000);
                }
            }, 100);
        };

        startButton.addEventListener('click', startGame);
    });
}

// Play Quiz mini-game
async function playQuiz() {
    return new Promise((resolve) => {
        const modal = document.getElementById('quizModal');
        const startButton = document.getElementById('startQuiz');
        const gameDiv = modal.querySelector('.modal-game');
        const optionsDiv = document.getElementById('options');

        modal.classList.add('show');

        const startQuiz = () => {
            startButton.removeEventListener('click', startQuiz);
            gameDiv.classList.remove('hidden');
            startButton.style.display = 'none';

            const quiz = quizGame.getRandomQuiz();
            document.getElementById('question').textContent = quiz.question;

            optionsDiv.innerHTML = '';
            quiz.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'quiz-option';
                button.textContent = option;
                button.onclick = () => {
                    const correct = quizGame.checkAnswer(index);
                    modal.classList.remove('show');
                    gameDiv.classList.add('hidden');
                    startButton.style.display = 'block';
                    resolve(correct);
                };
                optionsDiv.appendChild(button);
            });
        };

        startButton.addEventListener('click', startQuiz);
    });
}

// Update game UI
function updateUI(statusText) {
    const playersDiv = document.getElementById('players');
    playersDiv.innerHTML = players.map((player, i) => `
        <p style="color: ${player.color}">
            Player ${i + 1}: ${player.cash} SUPR<br>
            Properties: ${player.properties.join(", ") || "None"}
        </p>
    `).join('');

    document.getElementById('status').innerText = statusText;

    players.forEach((player, i) => {
        const token = document.getElementById(`p${i + 1}-token`);
        if (token.parentElement) {
            token.parentElement.removeChild(token);
        }
        const spaces = document.querySelectorAll('.space');
        spaces[player.position].appendChild(token);
    });
}

// Check for a winner
function checkWin() {
    const activePlayers = players.filter(player => player.cash > 0);
    if (activePlayers.length === 1) {
        alert(`Player ${players.indexOf(activePlayers[0]) + 1} wins!`);
    }
}