class QuizGame {
    constructor() {
        if (!document.getElementById('quizModal')) {
            console.error('Quiz modal not found!');
            return;
        }
        this.quizzes = [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                correct: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                correct: 1
            },
            {
                question: "What is 8 × 7?",
                options: ["54", "56", "58", "62"],
                correct: 1
            },
            {
                question: "Who painted the Mona Lisa?",
                options: ["Van Gogh", "Da Vinci", "Picasso", "Monet"],
                correct: 1
            }
        ];
        this.currentQuiz = 0;
        this.score = 0;
    }

    getRandomQuiz() {
        this.currentQuiz = Math.floor(Math.random() * this.quizzes.length);
        return this.quizzes[this.currentQuiz];
    }

    checkAnswer(answer) {
        return answer === this.quizzes[this.currentQuiz].correct;
    }
}