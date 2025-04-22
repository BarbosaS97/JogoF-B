// Game data
const gameData = [
    {
        round: 1,
        situation: "Você está confusa sobre seus sentimentos...",
        options: [
            {
                text: "Continuar conversando com o Fellipe",
                correct: true,
                result: "Você sente uma conexão especial quando conversam... isso pode ser o início de algo lindo. 💕"
            },
            {
                text: "Voltar com o ex",
                correct: false,
                result: "Algo não parece certo nessa decisão... será que é a melhor escolha? 😔"
            }
        ]
    },
    {
        round: 2,
        situation: "Fellipe te chama pra sair. Só vocês dois.",
        options: [
            {
                text: "Aceitar e sair com ele",
                correct: true,
                result: "Durante o encontro, você percebe o quanto ele é atencioso... isso te faz sorrir. 😊"
            },
            {
                text: "Recusar dizendo que prefere sair em grupo",
                correct: false,
                result: "Você sente um vazio depois dessa decisão... será que perdeu uma chance? 😟"
            }
        ]
    },
    {
        round: 3,
        situation: "Ele manda 'Tava pensando em você'.",
        options: [
            {
                text: "Responder 'Eu também'",
                correct: true,
                result: "A conversa flui naturalmente e você sente borboletas no estômago. 🦋"
            },
            {
                text: "Mandar só um emoji",
                correct: false,
                result: "O clima esfria um pouco... você sente que poderia ter sido mais amorosa. ❄️"
            }
        ]
    },
    {
        round: 4,
        situation: "Fellipe te chama pra conversar sério.",
        options: [
            {
                text: "Ouvir com carinho",
                correct: true,
                result: "Ele abre o coração e você sente que esse momento é especial... ✨"
            },
            {
                text: "Dizer que não é o momento",
                correct: false,
                result: "Você percebe uma mudança no comportamento dele... será que esperou demais? ⏳"
            }
        ]
    },
    {
        round: 5,
        situation: "Ele te convida pra dar um passeio só vocês dois.",
        options: [
            {
                text: "Aceitar e ir",
                correct: true,
                result: `<div class="final-image animate__animated animate__bounceIn">💖</div>
                <p>No fim do passeio, Fellipe segura sua mão e olha profundamente nos seus olhos...</p>
                <div class="final-message animate__animated animate__heartBeat animate__infinite">"Bianca... eu te amo."</div>
                <p class="animate__animated animate__fadeIn">Seu coração acelera e você percebe que essa é a melhor decisão que já tomou.</p>`
            },
            {
                text: "Dizer que está sem tempo",
                correct: false,
                result: "O tempo passa e as oportunidades se perdem... será que era a pessoa certa? 😢"
            }
        ]
    }
];

// DOM elements
const roundTitle = document.getElementById('round-title');
const situationText = document.getElementById('situation-text');
const optionsContainer = document.getElementById('options-container');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const continueBtn = document.getElementById('continue-btn');
const restartBtn = document.getElementById('restart-btn');
const pointsDisplay = document.getElementById('points');

// Audio elements
const clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');
const correctSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
const wrongSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
const winSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
const romanticSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-romantic-sigh-1711.mp3');

// Game state
let currentRound = 0;
let points = 0;

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    loadRound(currentRound);
    createFloatingHearts();
});

continueBtn.addEventListener('click', nextRound);
restartBtn.addEventListener('click', restartGame);

function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.fontSize = (10 + Math.random() * 20) + 'px';
        heart.style.animationDuration = (5 + Math.random() * 15) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(heart);
    }
}

function loadRound(roundIndex) {
    const round = gameData[roundIndex];
    
    // Animate round title
    roundTitle.classList.remove('animate__fadeInDown');
    void roundTitle.offsetWidth; // Trigger reflow
    roundTitle.classList.add('animate__fadeInDown');
    roundTitle.textContent = `Rodada ${round.round}`;
    
    // Animate situation text
    situationText.classList.remove('animate__fadeIn');
    void situationText.offsetWidth;
    situationText.classList.add('animate__fadeIn');
    situationText.textContent = round.situation;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    resultContainer.classList.add('hidden');
    
    // Shuffle options
    const shuffledOptions = [...round.options].sort(() => Math.random() - 0.5);
    
    // Add new options with animation
    shuffledOptions.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn animate__animated animate__fadeInUp';
        button.style.animationDelay = `${index * 0.1}s`;
        button.textContent = option.text;
        
        button.addEventListener('click', () => {
            showResult(roundIndex, option);
        });
        
        optionsContainer.appendChild(button);
    });
}

function showResult(roundIndex, option) {
    playSound(clickSound);
    
    // Disable all options
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('animate__pulse');
    });
    
    // Show result with animation
    resultText.innerHTML = option.result;
    resultContainer.classList.remove('hidden');
    resultContainer.classList.add('animate__fadeIn');
    
    if (option.correct) {
        playSound(correctSound);
        points += 20;
        pointsDisplay.textContent = points;
        pointsDisplay.classList.add('animate__rubberBand');
        setTimeout(() => {
            pointsDisplay.classList.remove('animate__rubberBand');
        }, 1000);
        
        if (roundIndex === gameData.length - 1) {
            playSound(winSound);
            playSound(romanticSound);
            createConfetti();
            continueBtn.style.display = 'none';
            restartBtn.textContent = 'Jogar novamente';
        } else {
            playSound(romanticSound);
            continueBtn.style.display = 'inline-block';
        }
        restartBtn.style.display = 'none';
    } else {
        playSound(wrongSound);
        continueBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
    }
}

function createConfetti() {
    const container = document.querySelector('.floating-hearts');
    container.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'heart';
        confetti.innerHTML = ['❤️', '💖', '💕', '💗', '💓'][Math.floor(Math.random() * 5)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-50px';
        confetti.style.fontSize = (15 + Math.random() * 25) + 'px';
        confetti.style.animation = `confettiFall ${3 + Math.random() * 4}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(confetti);
    }
}

function nextRound() {
    playSound(clickSound);
    currentRound++;
    
    if (currentRound < gameData.length) {
        loadRound(currentRound);
    } else {
        restartGame();
    }
}

function restartGame() {
    playSound(clickSound);
    
    if (currentRound < gameData.length - 1) {
        loadRound(currentRound);
    } else {
        currentRound = 0;
        points = 0;
        pointsDisplay.textContent = points;
        loadRound(currentRound);
    }
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play prevented:", e));
}