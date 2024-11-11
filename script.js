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
        explanation: "Number(string) is the recommended way to convert a string to a number as it can handle both integers and decimals."
    },
    {
        question: "What's wrong with this code?\n\nfunction suma(a, b) {\n    retrun a + b;\n}",
        options: [
            "'retrun' is misspelled, should be 'return'",
            "Missing semicolon after return",
            "Parameters should be typed",
            "Function needs a return type"
        ],
        correctAnswer: 0,
        explanation: "The keyword 'return' is misspelled as 'retrun'. In JavaScript, the correct keyword is 'return'."
    },
    {
        question: "What's the output?\n\nconst arr = [1, 2, 3];\nconsole.log(arr[3]);",
        options: [
            "undefined",
            "null",
            "3",
            "ReferenceError"
        ],
        correctAnswer: 0,
        explanation: "Array indexing starts at 0, so arr[3] tries to access the fourth element, which doesn't exist, returning undefined."
    },
    {
        question: "How do you properly check if a variable is undefined?",
        options: [
            "if (variable === undefined)",
            "if (typeof variable === 'undefined')",
            "if (variable == null)",
            "if (!variable)"
        ],
        correctAnswer: 1,
        explanation: "Using typeof is the safest way to check for undefined as it works even if the variable hasn't been declared."
    },
    {
        question: "What's wrong with this async code?\n\nasync function getData() {\n    return await fetch('/api');\n}\nconst data = getData();\nconsole.log(data);",
        options: [
            "Missing await when calling getData()",
            "fetch is not a function",
            "Cannot use await in async function",
            "Return statement is incorrect"
        ],
        correctAnswer: 0,
        explanation: "When calling an async function, you need to await its result or use .then() to handle the Promise."
    }
];

// Variables de estado
let currentQuestionIndex = 0;
let score = 0;
let isAnswerSelected = false;

// Referencias DOM
const instructionsScreen = document.getElementById('instructions-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const scoreDisplay = document.getElementById('score');
const questionCounter = document.getElementById('question-counter');
const finalScore = document.getElementById('final-score');

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', () => {
    hideAllScreens();
    showScreen(instructionsScreen);
});

// Funciones principales
function startGame() {
    score = 0;
    currentQuestionIndex = 0;
    hideAllScreens();
    showScreen(gameScreen);
    loadQuestion();
    updateScore();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    isAnswerSelected = false;
    const question = questions[currentQuestionIndex];
    
    // Cargar pregunta
    questionText.textContent = question.question;
    
    // Actualizar contadores
    updateQuestionCounter();
    
    // Limpiar y cargar opciones
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
    if (isAnswerSelected) return;
    isAnswerSelected = true;

    const question = questions[currentQuestionIndex];
    const buttons = optionsContainer.getElementsByClassName('option-button');
    
    // Marcar respuesta correcta e incorrecta
    buttons[question.correctAnswer].classList.add('correct');
    if (selectedIndex !== question.correctAnswer) {
        buttons[selectedIndex].classList.add('incorrect');
        score -= 1;
    } else {
        score += 2;
    }
    
    // Deshabilitar todos los botones
    Array.from(buttons).forEach(button => {
        button.disabled = true;
        button.style.cursor = 'default';
    });
    
    updateScore();
    
    // Temporizador para siguiente pregunta
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

function endGame() {
    hideAllScreens();
    showScreen(gameOverScreen);
    finalScore.textContent = `Final Score: ${score}`;
}

// Funciones de utilidad
function hideAllScreens() {
    instructionsScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
}

function showScreen(screen) {
    screen.classList.remove('hidden');
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateQuestionCounter() {
    questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
}

// Animaciones y efectos visuales
function addFadeInEffect(element) {
    element.classList.add('fade-in');
    element.addEventListener('animationend', () => {
        element.classList.remove('fade-in');
    });
}

// Manejo de errores
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ', msg, '\nURL: ', url, '\nLine: ', lineNo, '\nColumn: ', columnNo, '\nError object: ', error);
    return false;
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    hideAllScreens();
    showScreen(instructionsScreen);
});
