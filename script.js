// Constants and Configuration
const CONFIG = {
    CANVAS: {
        FONT: '16px Arial',
        TEXT_COLOR: '#00ff00',
        PADDING: 20,
        LINE_HEIGHT: 25
    },
    SCORE: {
        CORRECT_POINTS: 1,
        INCORRECT_POINTS: 0
    }
};

// Game Data
const GAME_DATA = {
    congratulationsMessages: {
        es: "¡Feliz Día del Programador!",
        cn: "程序员节快乐！",
        ru: "С Днем программиста!",
        en: "Happy Programmer's Day!",
        de: "Frohen Programmierertag!"
    },
    motivationalQuotes: [
        "¡Lo estás haciendo bien, sigue así!",
        "Cada desafío te acerca más a tu objetivo.",
        "La perseverancia es la clave del éxito.",
        "Cada error es una lección aprendida.",
        "Estás un paso más cerca de tu victoria.",
        "Confía en tu capacidad para superar cada nivel.",
        "El éxito es la suma de pequeños esfuerzos repetidos.",
        "La determinación es la puerta al triunfo.",
        "Nunca subestimes el poder de la persistencia."
    ]
};

// Game State Management
class GameState {
    constructor() {
        this.currentLineIndex = 0;
        this.score = 0;
        this.questions = [];
    }

    incrementScore() {
        this.score += CONFIG.SCORE.CORRECT_POINTS;
        return this.score;
    }

    nextQuestion() {
        if (this.currentLineIndex < this.questions.length - 1) {
            this.currentLineIndex++;
            return true;
        }
        return false;
    }

    getCurrentQuestion() {
        return this.questions[this.currentLineIndex];
    }

    isLastQuestion() {
        return this.currentLineIndex === this.questions.length - 1;
    }
}

// UI Manager
class UIManager {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.factDiv = document.getElementById("fact");
        this.optionsDiv = document.getElementById("options");
        this.instructionsDiv = document.getElementById("instructions");
        this.explanationDiv = document.getElementById("explanation");
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateScore(score) {
        this.factDiv.innerText = `Puntaje: ${score}`;
    }

    displayQuestion(question) {
        this.clearCanvas();
        this.setupCanvasContext();
        this.drawQuestionText(question.text);
        this.createOptionButtons(question);
    }

    setupCanvasContext() {
        this.ctx.font = CONFIG.CANVAS.FONT;
        this.ctx.fillStyle = CONFIG.CANVAS.TEXT_COLOR;
    }

    drawQuestionText(text) {
        TextRenderer.wrapText(
            this.ctx,
            text,
            10,
            50,
            this.canvas.width - CONFIG.CANVAS.PADDING,
            CONFIG.CANVAS.LINE_HEIGHT
        );
    }

    createOptionButtons(question) {
        this.optionsDiv.innerHTML = '';
        question.options.forEach((option) => {
            const button = document.createElement("button");
            button.innerHTML = option;
            button.onclick = () => this.handleOptionClick(option, question);
            this.optionsDiv.appendChild(button);
        });
    }

    handleOptionClick(selectedOption, question) {
        const isCorrect = selectedOption === question.correctOption;
        game.handleAnswerSelection(isCorrect);
    }

    showGameOver() {
        this.factDiv.style.display = "none";
        this.optionsDiv.innerHTML = "";
        CreditsManager.displayCredits(this.optionsDiv);
    }
}

// Text Renderer Utility
class TextRenderer {
    static wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(" ");
        let line = "";

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " ";
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + " ";
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }
}

// Credits Manager
class CreditsManager {
    static get skillsList() {
        return [
            { skill: "HTML", icon: "fab fa-html5" },
            { skill: "CSS", icon: "fab fa-css3-alt" },
            { skill: "Bootstrap", icon: "fab fa-bootstrap" },
            { skill: "Javascript", icon: "fab fa-js" },
            { skill: "React", icon: "fab fa-react" },
            { skill: "SQL", icon: "fas fa-database" },
            { skill: "Java", icon: "fab fa-java" },
            { skill: "Python", icon: "fab fa-python" }
        ];
    }

    static get contactLinks() {
        return [
            {
                name: "LinkedIn",
                url: "https://www.linkedin.com/in/full-stack-julian-soto/",
                icon: "fab fa-linkedin"
            },
            {
                name: "Facebook",
                url: "https://facebook.com/paalecode",
                icon: "fab fa-facebook"
            },
            {
                name: "Instagram",
                url: "https://instagram.com/pale_codepunk",
                icon: "fab fa-instagram"
            },
            {
                name: "Spotify",
                url: "https://open.spotify.com/user/31ibu52f5hdmgv3lqpoq5kvb3h24",
                icon: "fab fa-spotify"
            },
            {
                name: "Gmail (Desarrollo)",
                url: "mailto:juliansoto.dev@gmail.com",
                icon: "fas fa-envelope"
            },
            {
                name: "Gmail (Producción)",
                url: "mailto:paleproductions17@gmail.com",
                icon: "fas fa-envelope"
            }
        ];
    }

    static displayCredits(container) {
        const creditsDiv = document.createElement("div");
        creditsDiv.classList.add("credits-container");

        this.addBioSection(creditsDiv);
        this.addSkillsSection(creditsDiv);
        this.addContactSection(creditsDiv);

        container.appendChild(creditsDiv);
    }

    static addBioSection(container) {
        const title = document.createElement("h2");
        title.classList.add("credits-title");
        title.innerText = "Sobre pale_codepunk";

        const bio = document.createElement("p");
        bio.classList.add("credits-bio");
        bio.innerText = `Hola, soy pale_codepunk. Desde una temprana edad, me sumergí en el fascinante mundo de la programación. Esta pasión me ha llevado a embarcarme en innumerables aventuras creativas, desde el desarrollo web hasta la creación de soluciones tecnológicas innovadoras.`;

        container.appendChild(title);
        container.appendChild(bio);
    }

    static addSkillsSection(container) {
        const skillsTitle = document.createElement("h3");
        skillsTitle.classList.add("credits-skills-title");
        skillsTitle.innerText = "Skills:";

        const skillsUl = document.createElement("ul");
        skillsUl.classList.add("credits-skills-list");

        this.skillsList.forEach(item => {
            const li = document.createElement("li");
            if (item.icon) {
                const icon = document.createElement("i");
                icon.className = item.icon;
                li.appendChild(icon);
                li.innerHTML += ` ${item.skill}`;
            } else {
                li.innerText = item.skill;
            }
            skillsUl.appendChild(li);
        });

        container.appendChild(skillsTitle);
        container.appendChild(skillsUl);
    }

    static addContactSection(container) {
        const linksTitle = document.createElement("h3");
        linksTitle.classList.add("credits-links-title");
        linksTitle.innerText = "Estas son mis redes sociales:";

        const linksUl = document.createElement("ul");
        linksUl.classList.add("credits-links-list");

        this.contactLinks.forEach(link => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = link.url;
            a.target = "_blank";

            if (link.icon) {
                const icon = document.createElement("i");
                icon.className = link.icon;
                a.appendChild(icon);
                a.innerHTML += ` ${link.name}`;
            } else {
                a.innerText = link.name;
            }

            li.appendChild(a);
            linksUl.appendChild(li);
        });

        container.appendChild(linksTitle);
        container.appendChild(linksUl);
    }
}

// Main Game Class
class TriviaGame {
    constructor() {
        this.state = new GameState();
        this.ui = new UIManager();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById("startButton").onclick = () => this.startGame();
    }

    startGame() {
        this.ui.instructionsDiv.style.display = "none";
        this.ui.canvas.style.display = "block";
        this.ui.factDiv.style.display = "block";
        this.ui.optionsDiv.style.display = "block";

        this.ui.updateScore(this.state.score);
        this.displayCurrentChallenge();
    }

    displayCurrentChallenge() {
        const currentQuestion = this.state.getCurrentQuestion();
        this.ui.explanationDiv.innerText = "";
        this.ui.displayQuestion(currentQuestion);
    }

    handleAnswerSelection(isCorrect) {
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    handleCorrectAnswer() {
        this.state.incrementScore();
        this.ui.updateScore(this.state.score);

        if (this.state.isLastQuestion()) {
            this.showCongratulations();
        } else {
            this.showNextQuestionButton();
        }
    }

    handleIncorrectAnswer() {
        const currentQuestion = this.state.getCurrentQuestion();
        this.ui.explanationDiv.innerText = currentQuestion.explanation;
        this.showRetryButton();
    }

    showNextQuestionButton() {
        this.ui.optionsDiv.innerHTML = "";
        const btn = document.createElement("button");
        btn.innerHTML = "Pasar al siguiente nivel";
        btn.onclick = () => {
            this.state.nextQuestion();
            this.displayCurrentChallenge();
        };
        this.ui.optionsDiv.appendChild(btn);
    }

    showRetryButton() {
        this.ui.optionsDiv.innerHTML = "";
        const btn = document.createElement("button");
        btn.innerHTML = "Reintentar";
        btn.onclick = () => this.displayCurrentChallenge();
        this.ui.optionsDiv.appendChild(btn);
    }

    showCongratulations() {
        this.ui.optionsDiv.innerHTML = "";
        const btn = document.createElement("button");
        btn.innerHTML = "¡Has ganado!";
        btn.onclick = () => this.ui.showGameOver();
        this.ui.optionsDiv.appendChild(btn);

        this.displayCongratulationsMessages();
    }

    displayCongratulationsMessages() {
        this.ui.clearCanvas();
        let yOffset = 50;
        for (let lang in GAME_DATA.congratulationsMessages) {
            this.ui.ctx.fillText(GAME_DATA.congratulationsMessages[lang], 10, yOffset);
            yOffset += 30;
        }
    }
}

// Questions Database
const QUESTIONS_DB = [
    {
        category: "JavaScript",
        text: "¿Cuál de los siguientes es el método correcto para convertir una cadena en un número en JavaScript?",
        options: [
            "Number.parseInt(string)",
            "Number(string)",
            "Parse.stringToNum(string)",
            "parseInt(string)"
        ],
        correctOption: "Number(string)",
        explanation: "Mientras que 'parseInt(string)' y 'Number.parseInt(string)' también pueden convertir cadenas en números, 'Number(string)' es una forma más directa de hacerlo."
    },
    {
        category: "Python",
        text: "En Python, ¿cómo creas una lista vacía?",
        options: ["list[]", "[]", "new list()", "list()"],
        correctOption: "[]",
        explanation: "En Python, las listas vacías se crean simplemente con '[]'. 'list()' es otra forma válida de hacerlo."
    },
    {
        category: "Historia",
        text: "¿Quién es conocido como el padre de la computación?",
        options: ["Steve Jobs", "Alan Turing", "Bill Gates", "Charles Babbage"],
        correctOption: "Alan Turing",
        explanation: "Alan Turing es ampliamente reconocido como el padre de la computación teórica. Aunque Charles Babbage también es a menudo citado debido a su trabajo en la Máquina Analítica."
    },
    {
        category: "Java",
        text: "¿Cuál es la declaración correcta para main en Java?",
        options: [
            "public static void main(String[] args)",
            "public void main(String[] args)",
            "public static main(String[] args)",
            "public static void main(String args[])"
        ],
        correctOption: "public static void main(String[] args)",
        explanation: "Esta es la declaración estándar para el método main en Java que sirve como punto de entrada para la aplicación."
    },
    {
        category: "SQL",
        text: "¿Cuál de los siguientes es el comando SQL para seleccionar todos los registros de una tabla llamada 'Clientes'?",
        options: [
            "SELECT * FROM Clientes",
            "SELECT ALL FROM Clientes",
            "SELECT Clientes",
            "GET * FROM Clientes"
        ],
        correctOption: "SELECT * FROM Clientes",
        explanation: "El comando 'SELECT * FROM [TableName]' se utiliza para seleccionar todos los registros de una tabla."
    }
];

// Error Handler
class ErrorHandler {
    static handleError(error) {
        console.error('Game Error:', error);
        // Aquí podrías agregar lógica adicional para manejar errores
        // como mostrar un mensaje al usuario o reiniciar el juego
    }
}

// Game Initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Crear instancia del juego
        const game = new TriviaGame();
        
        // Cargar preguntas en el estado del juego
        game.state.questions = QUESTIONS_DB;
        
        // Ocultar todas las pantallas excepto las instrucciones
        game.ui.hideAllScreens();
        game.ui.instructionsDiv.style.display = "block";
        
        // Configurar manejo de errores global
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            ErrorHandler.handleError({
                message: msg,
                url: url,
                line: lineNo,
                column: columnNo,
                error: error
            });
            return false;
        };

        // Agregar al objeto window para debugging si es necesario
        if (process.env.NODE_ENV === 'development') {
            window.gameInstance = game;
        }
        
    } catch (error) {
        ErrorHandler.handleError(error);
    }
});

// Export para uso en módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TriviaGame,
        GameState,
        UIManager,
        TextRenderer,
        CreditsManager,
        CONFIG,
        GAME_DATA,
        QUESTIONS_DB
    };
}
