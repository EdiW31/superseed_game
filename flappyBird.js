class FlappyBird {
    constructor(canvas) {
        if (!canvas) {
            console.error('Canvas element not found!');
            return;
        }
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bird = { x: 50, y: 150, velocity: 0 };
        this.pipes = [];
        this.score = 0;
        this.gameOver = false;
        this.gravity = 0.5;
        this.jump = -8;
        this.pipeGap = 130;
        this.birdSize = 20;
        
        this.addPipe();
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') this.flap();
        });
        
        canvas.addEventListener('click', () => this.flap());
    }

    addPipe() {
        let minHeight = 50;
        let maxHeight = this.canvas.height - this.pipeGap - minHeight;
        let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        
        this.pipes.push({
            x: this.canvas.width,
            height: height,
            passed: false
        });
    }

    flap() {
        if (!this.gameOver) {
            this.bird.velocity = this.jump;
        }
    }

    update() {
        if (this.gameOver) return;

        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;

        if (this.bird.y < 0 || this.bird.y > this.canvas.height) {
            this.gameOver = true;
        }

        this.pipes.forEach(pipe => {
            pipe.x -= 2;

            if (this.bird.x + this.birdSize > pipe.x && 
                this.bird.x < pipe.x + 50 && 
                (this.bird.y < pipe.height || 
                this.bird.y + this.birdSize > pipe.height + this.pipeGap)) {
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

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bird
        this.ctx.fillStyle = '#1a4c8a';
        this.ctx.fillRect(this.bird.x, this.bird.y, this.birdSize, this.birdSize);

        // Draw pipes
        this.pipes.forEach(pipe => {
            this.ctx.fillStyle = '#2d6bb7';
            this.ctx.fillRect(pipe.x, 0, 50, pipe.height);
            this.ctx.fillRect(pipe.x, pipe.height + this.pipeGap, 
                            50, this.canvas.height);
        });

        // Draw score
        this.ctx.fillStyle = '#1a4c8a';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }

    start() {
        this.gameLoop();
    }

    gameLoop() {
        this.update();
        this.draw();
        if (!this.gameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
        return this.score;
    }
}