class QuizGame {
    constructor() {
        // Validate quiz modal existence
        if (!document.getElementById('quizModal')) {
            console.error('Quiz modal not found!');
            return;
        }

        // Quiz data with SuperSeed-themed questions
        this.quizzes = [
            {
                question: "When did the SuperSeed Supersale start?",
                options: ["November 1, 2024", "December 9, 2024", "January 1, 2025", "February 14, 2025"],
                correct: 1 // December 9, 2024
                // Source: Cointelegraph (Jan 6, 2025) - https://cointelegraph.com/press-releases/superseed-foundations-ongoing-supersale-hits-4m-signaling-the-end-of-vc-reliance
            },
            {
                question: "How much money had the SuperSeed Supersale raised by January 6, 2025?",
                options: ["$2 million", "$3 million", "$4 million", "$5 million"],
                correct: 2 // $4 million
                // Source: GlobeNewswire (Jan 6-7, 2025) - https://www.globenewswire.com/news-release/2025/01/07/300 IMD0NjAw/superseed-foundation-s-ongoing-supersale-hits-4m-signaling-the-end-of-vc-reliance.html
            },
            {
                question: "What is SuperSeed’s primary focus as a blockchain?",
                options: ["Gaming", "Self-repaying loans", "Privacy", "Cross-chain bridging"],
                correct: 1 // Self-repaying loans
                // Source: SuperSeed site, BeInCrypto (Nov 18, 2024) - https://www.superseed.xyz/, https://beincrypto.com/superseed-the-first-blockchain-to-repay-your-debt/
            },
            {
                question: "Which technology stack does SuperSeed use to operate as an Ethereum Layer 2?",
                options: ["Polygon", "zkSync", "OP Stack", "Arbitrum"],
                correct: 2 // OP Stack
                // Source: SuperSeed Docs, L2BEAT - https://docs.superseed.xyz/, https://l2beat.com/scaling/projects/superseed
            },
            {
                question: "What unique feature allows SuperSeed users to borrow without paying interest?",
                options: ["Proof of Stake", "Supercollateral", "Dynamic Vault", "Sequencer Fees"],
                correct: 1 // Supercollateral
                // Source: Blocmates (Mar 31, 2025) - https://www.blocmates.com/blog/superseed-overview-what-is-superseed-the-blockchain-that-repays-your-debt
            },
            {
                question: "How much of SuperSeed’s total token supply was offered in the Supersale?",
                options: ["10%", "15%", "20%", "25%"],
                correct: 2 // 20%
                // Source: Chainwire (Dec 5, 2024) - https://www.chainwire.org/view/the-superseed-token-powering-a-self-repaying-loan-network-8c3e58e8
            },
            {
                question: "What is the name of SuperSeed’s mechanism that rewards users for helping repay loans?",
                options: ["Proof of Work", "Proof of Repayment", "Super Auction", "Debt Burn"],
                correct: 1 // Proof of Repayment
                // Source: SuperSeed site, The Crypto Basic (Dec 5, 2024) - https://www.superseed.xyz/, https://thecryptobasic.com/2024/12/05/the-superseed-token-powering-a-self-repaying-loan-network/
            },
            {
                question: "What is the minimum over-collateralization ratio for Supercollateral loans to be repaid automatically?",
                options: ["150%", "300%", "400%", "500%"],
                correct: 3 // 500%
                // Source: Blocmates (Mar 31, 2025) - https://www.blocmates.com/blog/superseed-overview-what-is-superseed-the-blockchain-that-repays-your-debt
            },
            {
                question: "What is the correct order of events following the SuperSeed Mainnet Launch as of April 2025?",
                options: [
                    "Genesis Passport Mint, Seeds, Token Generation Event (TGE)",
                    "Token Generation Event (TGE), Genesis Passport Mint, Seeds",
                    "Seeds, Genesis Passport Mint, Token Generation Event (TGE)",
                    "Genesis Passport Mint, Token Generation Event (TGE), Seeds"
                ],
                correct: 0 // A) Genesis Passport Mint, Seeds, Token Generation Event (TGE)
            },
            {
                question: "What is the correct order of events leading up to and including the SuperSeed Mainnet Launch as of December 2024?",
                options: [
                    "Mainnet Launch, Supersale, Token Generation Event (TGE)",
                    "Supersale, Mainnet Launch, Token Generation Event (TGE)",
                    "Token Generation Event (TGE), Supersale, Mainnet Launch",
                    "Supersale, Token Generation Event (TGE), Mainnet Launch"
                ],
                correct: 1 // A) Supersale, Mainnet Launch, Token Generation Event (TGE)
            }
        ];

        // Game state
        this.currentQuiz = 0;
        this.score = 0;
    }

    // Get a random quiz question
    getRandomQuiz() {
        this.currentQuiz = Math.floor(Math.random() * this.quizzes.length);
        return this.quizzes[this.currentQuiz];
    }

    // Check if the selected answer is correct
    checkAnswer(answer) {
        return answer === this.quizzes[this.currentQuiz].correct;
    }
}