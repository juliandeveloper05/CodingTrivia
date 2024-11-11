// Banco de preguntas
const questions = [
    {
        code: `function suma(a, b) {
    retrun a + b;
}`,
        question: "¿Cuál es el error en este código?",
        options: [
            "La palabra clave 'retrun' está mal escrita, debería ser 'return'",
            "Falta el punto y coma después del return",
            "Los parámetros deberían tener tipos definidos",
            "La función necesita un tipo de retorno"
        ],
        correctAnswer: 0,
        explanation: "La palabra clave 'return' está mal escrita como 'retrun'. En JavaScript, la palabra clave correcta para devolver un valor es 'return'."
    },
    {
        code: `const array = [1, 2, 3, 4, 5];
for(let i = 0; i <= array.length; i++) {
    console.log(array[i]);
}`,
        question: "¿Cuál es el problema con este bucle for?",
        options: [
            "El operador de comparación debería ser '<' en lugar de '<='",
            "Falta declarar la variable i",
            "El array debería ser constante",
            "console.log no es la mejor forma de mostrar datos"
        ],
        correctAnswer: 0,
        explanation: "El bucle se ejecutará una vez más de lo necesario porque la condición usa '<='. Con un array de longitud 5, i llegará a 5, pero el último índice válido es 4. Esto causará que array[5] sea undefined."
    },
    {
        code: `let str = "123";
let num = str + 4;
console.log(num);`,
        question: "¿Cuál será el resultado de este código?",
        options: [
            "1234",
            "127",
            "Error",
            "NaN"
        ],
        correctAnswer: 0,
        explanation: "El operador + con strings realiza concatenación. Cuando un número se suma a un string, el número se convierte a string primero. Por lo tanto, '123' + 4 resulta en '1234'."
    },
    {
        code: `const obj = { name: "John" };
obj.name = "Jane";
obj = { name: "Mike" };`,
        question: "¿Por qué este código genera un error?",
        options: [
            "No se puede reasignar una constante",
            "Los objetos no pueden ser modificados",
            "El nombre debe ser una constante",
            "Falta un punto y coma"
        ],
        correctAnswer: 0,
        explanation: "Aunque podemos modificar las propiedades de un objeto constante, no podemos reasignar la variable constante a un nuevo objeto. La última línea intenta reasignar obj, lo cual no está permitido para constantes."
    },
    {
        code: `async function getData() {
    const response = await fetch('api/data');
    return response;
}
const data = getData();
console.log(data);`,
        question: "¿Qué problema hay con este código?",
        options: [
            "getData() devuelve una Promise, necesita usar await o .then()",
            "fetch no es una función válida",
            "async no es necesario aquí",
            "response no está definido"
        ],
        correctAnswer: 0,
        explanation: "getData es una función asíncrona que devuelve una Promise. Para obtener el valor real, necesitas usar await getData() o getData().then(data => console.log(data))."
    }
];

// Variables globales
let currentQuestionIndex = 0;
let score = 0;
let gameStarted = false;

// Elementos del DOM
const instructionsScreen = document.getElementById('instructions');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restart-button');
const codeSnippet = document.getElementById('code-snippet');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const scoreDisplay = document.getElementById('score');
const questionCounter = document.getElementById('question-counter');
const explanation = document.getElementById('explanation');
const loader = document.getElementById('loader');

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

// Funciones principales
function startGame() {
    gameStarted = true;
    currentQuestionIndex = 0;
    score = 0;
    updateScore();
    showScreen(gameScreen);
    loadQuestion();
}

function restartGame() {
    showScreen(instructionsScreen);
    resetGame();
}

function resetGame() {
    currentQuestionIndex = 0;
    score = 0;
    gameStarted = false;
    updateScore();
    explanation.classList.add('hidden');
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    const question = questions[currentQuestionIndex];
    codeSnippet.textContent = question.code;
    questionText.textContent = question.question;
    updateQuestionCounter();
    
    // Limpiar opciones anteriores
    optionsContainer.innerHTML = '';
    
    // Crear nuevos botones de opciones
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(index));
        optionsContainer.appendChild(button);
    });

    explanation.classList.add('hidden');
}

function checkAnswer(selectedIndex) {
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
    showExplanation(question.explanation);
    
    // Esperar antes de cargar la siguiente pregunta
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 3000);
}

function showExplanation(text) {
    explanation.textContent = text;
    explanation.classList.remove('hidden');
}

function endGame() {
    document.getElementById('final-score').textContent = `Final Score: ${score}`;
    document.getElementById('final-result').textContent = score > 0 ? 'You Win!' : 'Game Over!';
    showScreen(endScreen);
}

// Funciones de utilidad
function showScreen(screen) {
    // Ocultar todas las pantallas
    instructionsScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    
    // Mostrar la pantalla solicitada
    screen.classList.remove('hidden');
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateQuestionCounter() {
    questionCounter.textContent = `Question: ${currentQuestionIndex + 1}/${questions.length}`;
}

// Función para mostrar/ocultar el loader
function toggleLoader(show) {
    loader.classList.toggle('hidden', !show);
}

// Inicialización
function init() {
    showScreen(instructionsScreen);
    resetGame();
}

// Iniciar el juego
init();
