class FlappyBird {
    constructor(canvas) {
        if (!canvas) {
            console.error('Canvas element not found!');
            return;
        }

        // Core properties
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bird = { x: 50, y: 150, velocity: 0 };
        this.pipes = [];
        this.score = 0;
        this.gameOver = false;

        // Game constants
        this.gravity = 0.5;
        this.jump = -8;
        this.pipeGap = 130;
        this.birdSize = 30;
        this.birdRotation = 0;
        this.trail = [];
        this.maxTrailLength = 5;

        // Initialize game assets and events
        this.loadImages();
        this.addPipe();
        this.setupEventListeners();
    }

    // Load game images
    loadImages() {
        this.logoImg = new Image();
        this.logoImg.src = './images/logo.png';
        this.logoImg.onload = () => {
            this.logoLoaded = true;
        };

        this.pipeTopImg = this.createPipeTexture('#4CAF50', '#3E8E41');
        this.pipeBottomImg = this.createPipeTexture('#795548', '#5D4037');
    }

    // Create textured pipe images
    createPipeTexture(mainColor, shadowColor) {
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = 50;
        textureCanvas.height = 400;
        const textureCtx = textureCanvas.getContext('2d');

        textureCtx.fillStyle = mainColor;
        textureCtx.fillRect(0, 0, 50, 400);

        textureCtx.fillStyle = shadowColor;
        for (let i = 0; i < 400; i += 20) {
            textureCtx.fillRect(0, i, 50, 2);
        }

        textureCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        textureCtx.fillRect(5, 0, 10, 400);

        return textureCanvas;
    }

    // Set up input event listeners
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.flap();
        });
        this.canvas.addEventListener('click', () => this.flap());
    }

    // Add a new pipe to the game
    addPipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight;
        const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

        this.pipes.push({
            x: this.canvas.width,
            height: height,
            passed: false
        });
    }

    // Handle bird flap action
    flap() {
        if (!this.gameOver) {
            this.bird.velocity = this.jump;
            this.trail.push({
                x: this.bird.x - 5,
                y: this.bird.y + this.birdSize / 2,
                alpha: 1
            });

            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }
    }

    // Update game state
    update() {
        if (this.gameOver) return;

        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;
        this.birdRotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.bird.velocity * 0.1));

        this.trail.forEach((particle, i) => {
            particle.alpha -= 0.1;
            if (particle.alpha <= 0) {
                this.trail.splice(i, 1);
            }
        });

        if (this.bird.y < 0 || this.bird.y > this.canvas.height) {
            this.gameOver = true;
        }

        this.pipes.forEach(pipe => {
            pipe.x -= 2;

            if (this.bird.x + this.birdSize > pipe.x &&
                this.bird.x < pipe.x + 50 &&
                (this.bird.y < pipe.height || this.bird.y + this.birdSize > pipe.height + this.pipeGap)) {
                this.gameOver = true;
            }

            if (!pipe.passed && pipe.x < this.bird.x) {
                pipe.passed = true;
                this.score++;
            }
        });

        this.pipes = this.pipes.filter(pipe => pipe.x > -50);
        if (this.pipes[this.pipes.length - 1].x < this.canvas.width - 300) {
            this.addPipe();
        }
    }

    // Draw game elements
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E0F7FA');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw clouds
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.drawCloud(100, 50, 30);
        this.drawCloud(300, 80, 40);

        // Draw bird
        if (this.logoLoaded) {
            this.ctx.save();
            this.ctx.translate(this.bird.x + this.birdSize / 2, this.bird.y + this.birdSize / 2);
            this.ctx.rotate(this.birdRotation);
            this.ctx.drawImage(this.logoImg, -this.birdSize / 2, -this.birdSize / 2, this.birdSize, this.birdSize);
            this.ctx.restore();
        }

        // Draw trail
        this.trail.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.drawImage(this.logoImg, particle.x, particle.y, 15, 15);
            this.ctx.restore();
        });

        // Draw pipes
        this.pipes.forEach(pipe => {
            this.ctx.drawImage(this.pipeTopImg, pipe.x, 0, 50, pipe.height);
            this.ctx.drawImage(
                this.pipeBottomImg,
                pipe.x,
                pipe.height + this.pipeGap,
                50,
                this.canvas.height - (pipe.height + this.pipeGap)
            );
        });

        // Draw score
        this.ctx.fillStyle = '#1a4c8a';
        this.ctx.font = 'bold 24px Poppins';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }

    // Draw a cloud shape
    drawCloud(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.arc(x + size, y, size * 0.8, 0, Math.PI * 2);
        this.ctx.arc(x - size, y, size * 0.8, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Start the game loop
    start() {
        this.gameLoop();
    }

    // Main game loop
    gameLoop() {
        this.update();
        this.draw();
        if (!this.gameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
        return this.score;
    }

    // Method to check if player wins (used in script.js)
    hasWon() {
        return this.score >= 5; // Changed from 10 to 5
    }
}