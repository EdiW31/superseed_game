let players = [];
let playerColors = [];
let currentPlayer = 0;
let quizGame;


document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const welcomeScreen = document.getElementById('welcome-screen');
    const gameScreen = document.getElementById('game-screen');
    const playerBtns = document.querySelectorAll('.player-btn');
    const playerColorsDiv = document.getElementById('player-colors');
    const rollButton = document.getElementById('roll-dice');
    
    // Player selection
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

    // Start game
    startButton.addEventListener('click', () => {
        if (!startButton.disabled) {
            welcomeScreen.classList.remove('active');
            gameScreen.classList.remove('hidden');
            initializeGame();
        }
    });

    // Roll dice
    rollButton.addEventListener('click', () => {
        rollDice();
    });
});

function setupColorPickers(numPlayers) {
    const container = document.getElementById('player-colors');
    container.innerHTML = '';
    
    for(let i = 0; i < numPlayers; i++) {
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

function checkColorSelection() {
    const selects = document.querySelectorAll('[id$="-color"]');
    const colors = Array.from(selects).map(s => s.value);
    const uniqueColors = new Set(colors);
    
    const startButton = document.getElementById('start-game');
    startButton.disabled = uniqueColors.size !== selects.length;
    
    if (!startButton.disabled) {
        playerColors = colors;
    }
}

function updatePropertyOwnership(spaceIndex, player) {
    const spaces = document.querySelectorAll('.space');
    const space = spaces[spaceIndex];
    if (space) {
        space.style.borderBottomColor = player.color;
        space.classList.add('space-owned');
    }
}

function initializeGame() {
    quizGame = new QuizGame();
    const numPlayers = playerColors.length;
    
    // Initialize players
    players = Array(numPlayers).fill().map((_, i) => ({
        cash: 2000,
        position: 0,
        properties: [],
        color: playerColors[i]
    }));
    
    // Create player tokens
    createPlayerTokens();
    
    // Update initial UI
    updateUI('Game started! Roll to play.');
    
    // Set current player
    currentPlayer = 0;
    
    // Enable roll button
    document.getElementById('roll-dice').disabled = false;
}

function createPlayerTokens() {
    const board = document.getElementById('board');
    const startSpace = board.querySelector('.space:first-child');
    
    players.forEach((player, index) => {
        const token = document.createElement('div');
        token.id = `p${index + 1}-token`;
        token.className = 'player-token';
        token.style.backgroundColor = player.color;
        startSpace.appendChild(token);
    });
}

const board = [
    { type: "start" },
    { type: "property", name: "Prop 1", price: 100, rent: 10, owner: null },
    { type: "property", name: "Prop 2", price: 150, rent: 15, owner: null },
    { type: "chance" },
    { type: "property", name: "Prop 3", price: 200, rent: 20, owner: null },
    { type: "property", name: "Prop 4", price: 250, rent: 25, owner: null },
    { type: "property", name: "Prop 5", price: 300, rent: 30, owner: null },
    { type: "property", name: "Prop 6", price: 350, rent: 35, owner: null },
    { type: "corner" },
    { type: "property", name: "Prop 7", price: 400, rent: 40, owner: null },
    { type: "property", name: "Prop 8", price: 450, rent: 45, owner: null },
    { type: "chance" },
    { type: "property", name: "Prop 9", price: 500, rent: 50, owner: null },
    { type: "jail" },
    { type: "property", name: "Prop 10", price: 550, rent: 55, owner: null },
    { type: "property", name: "Prop 11", price: 600, rent: 60, owner: null },
    { type: "chance" },
    { type: "property", name: "Prop 12", price: 650, rent: 65, owner: null },
    { type: "property", name: "Prop 13", price: 700, rent: 70, owner: null },
    { type: "property", name: "Prop 14", price: 750, rent: 75, owner: null },
    { type: "property", name: "Prop 15", price: 800, rent: 80, owner: null },
    { type: "corner" },
    { type: "property", name: "Prop 16", price: 850, rent: 85, owner: null },
    { type: "property", name: "Prop 17", price: 900, rent: 90, owner: null },
    { type: "chance" },
    { type: "property", name: "Prop 18", price: 950, rent: 95, owner: null }
];

async function rollDice() {
    let roll = Math.floor(Math.random() * 6) + 1;
    let player = players[currentPlayer];
    player.position = (player.position + roll) % board.length;

    let space = board[player.position];
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
        status += ` Paid $${space.rent} rent to Player ${space.owner + 1}.`;
    } else if (space.type === "chance") {
        player.cash += 50;
        status += " Chance: Gained $50!";
    } else if (space.type === "jail") {
        status += " In Jail, lose a turn.";
    }

    updateUI(status);
    checkWin();
    currentPlayer = (currentPlayer + 1) % players.length;
}

async function playRandomGame() {
    // Generate random number between 0 and 1
    const gameChoice = Math.random();
    
    // 50% chance for each game
    if (gameChoice < 0.5) {
        return await playFlappyBird();
    } else {
        return await playQuiz();
    }
}

async function playFlappyBird() {
    return new Promise((resolve) => {
        const modal = document.getElementById('flappyBirdModal');
        const canvas = document.getElementById('flappyBirdCanvas');
        const startButton = document.getElementById('startFlappy');
        const gameDiv = modal.querySelector('.modal-game');
        
        modal.classList.add('show');
        
        startButton.addEventListener('click', function startGame() {
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
        });
    });
}

async function playQuiz() {
    return new Promise((resolve) => {
        const modal = document.getElementById('quizModal');
        const startButton = document.getElementById('startQuiz');
        const gameDiv = modal.querySelector('.modal-game');
        const optionsDiv = document.getElementById('options');
        
        modal.classList.add('show');
        
        startButton.addEventListener('click', function startQuiz() {
            startButton.removeEventListener('click', startQuiz);
            gameDiv.classList.remove('hidden');
            startButton.style.display = 'none';
            
            const quiz = quizGame.getRandomQuiz();
            document.getElementById('question').textContent = quiz.question;
            
            // Clear previous options
            optionsDiv.innerHTML = '';
            
            // Create new option buttons
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
        });
    });
}

function updateUI(statusText) {
    const playersDiv = document.getElementById('players');
    playersDiv.innerHTML = players.map((player, i) => `
        <p style="color: ${player.color}">
            Player ${i + 1}: $${player.cash}<br>
            Properties: ${player.properties.join(", ") || "None"}
        </p>
    `).join('');
    
    document.getElementById("status").innerText = statusText;
    
    // Update token positions
    players.forEach((player, i) => {
        const token = document.getElementById(`p${i + 1}-token`);
        if (token.parentElement) {
            token.parentElement.removeChild(token);
        }
        const spaces = document.querySelectorAll('.space');
        spaces[player.position].appendChild(token);
    });
}

function checkWin() {
    if (players[0].cash <= 0) alert("Player 2 wins!");
    else if (players[1].cash <= 0) alert("Player 1 wins!");
}