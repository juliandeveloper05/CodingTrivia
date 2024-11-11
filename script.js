// Banco de preguntas
const questions = [
    {
        question: "Which of the following is the correct method to convert a string to a number in JavaScript?",
        options: [
            "Number.parseInt()",
            "Number(string)",
            "parseFloat()",
            "parseInt()"
        ],
        correctAnswer: 1,
        explanation: "Number(string) is the recommended way to convert a string to a number in JavaScript. It can handle both integers and floating-point numbers."
    },
    {
        question: "What's the output of this code?\n\nlet x = '5';\nlet y = +x;\nconsole.log(typeof y);",
        options: [
            "'string'",
            "'number'",
            "'undefined'",
            "'object'"
        ],
        correctAnswer: 1,
        explanation: "The unary plus operator (+) converts its operand to a number. When applied to a string containing a valid number, it converts it to a numeric type."
    },
    {
        question: "Which method correctly checks if a value is Not a Number?",
        options: [
            "isNotNumber(x)",
            "Number.isNaN(x)",
            "x.isNaN()",
            "isNaN(x)"
        ],
        correctAnswer: 1,
        explanation: "Number.isNaN() is the most reliable method to check if a value is NaN. Unlike global isNaN(), it doesn't do type coercion."
    }
];

// Variables de estado
let currentQuestionIndex = 0;
let score = 0;

// Referencias DOM
const questionScreen = document.getElementById('question-screen');
const gameOver = document.getElementById('game-over');
const instructions = document.getElementById('instructions');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const scoreDisplay = document.getElementById('score');
const questionCounter = document.getElementById('question-counter');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

// Funciones principales
function startGame() {
    score = 0;
    currentQuestionIndex = 0;
    showScreen(questionScreen);
    updateScore();
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    updateQuestionCounter();
    loadOptions(question);
}

function loadOptions(question) {
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const buttons = optionsContainer.getElementsByClassName('option-button');
    
    // Deshabilitar todos los botones
    Array.from(buttons).forEach(button => button.disabled = true);
    
    // Mostrar respuesta correcta e incorrecta
    buttons[question.correctAnswer].classList.add('correct');
    if (selectedIndex !== question.correctAnswer) {
        buttons[selectedIndex].classList.add('incorrect');
        score -= 1;
    } else {
        score += 2;
    }
    
    updateScore();
    
    // Esperar antes de la siguiente pregunta
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

function endGame() {
    const finalScore = document.getElementById('final-score');
    finalScore.textContent = `Final Score: ${score}`;
    showScreen(gameOver);
}

function restartGame() {
    showScreen(instructions);
}

// Funciones de utilidad
function showScreen(screen) {
    [questionScreen, gameOver, instructions].forEach(s => {
        s.classList.add('hidden');
    });
    screen.classList.remove('hidden');
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateQuestionCounter() {
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
}

// Inicialización
showScreen(instructions);
}

// Iniciar el juego
init();
