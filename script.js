const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const factDiv = document.getElementById("fact");
const optionsDiv = document.getElementById("options");
const instructionsDiv = document.getElementById("instructions");
let currentLineIndex = 0;
let score = 0;

const codeLines = [
  {
    category: "JavaScript",
    text: "¿Cuál de los siguientes es el método correcto para convertir una cadena en un número en JavaScript?",
    options: [
      "Number.parseInt(string)",
      "Number(string)",
      "Parse.stringToNum(string)",
      "parseInt(string)",
    ],
    correctOption: "Number(string)",
    explanation:
      "Mientras que 'parseInt(string)' y 'Number.parseInt(string)' también pueden convertir cadenas en números, 'Number(string)' es una forma más directa de hacerlo.",
  },
  {
    category: "Python",
    text: "En Python, ¿cómo creas una lista vacía?",
    options: ["list[]", "[]", "new list()", "list()"],
    correctOption: "[]",
    explanation:
      "En Python, las listas vacías se crean simplemente con '[]'. 'list()' es otra forma válida de hacerlo.",
  },
  {
    category: "Historia",
    text: "¿Quién es conocido como el padre de la computación?",
    options: ["Steve Jobs", "Alan Turing", "Bill Gates", "Charles Babbage"],
    correctOption: "Alan Turing",
    explanation:
      "Alan Turing es ampliamente reconocido como el padre de la computación teórica. Aunque Charles Babbage también es a menudo citado debido a su trabajo en la Máquina Analítica.",
  },
  {
    category: "Java",
    text: "¿Cuál es la declaración correcta para main en Java?",
    options: [
      "public static void main(String[] args)",
      "public void main(String[] args)",
      "public static main(String[] args)",
      "public static void main(String args[])",
    ],
    correctOption: "public static void main(String[] args)",
    explanation:
      "Esta es la declaración estándar para el método main en Java que sirve como punto de entrada para la aplicación.",
  },
  {
    category: "SQL",
    text: "¿Cuál de los siguientes es el comando SQL para seleccionar todos los registros de una tabla llamada 'Clientes'?",
    options: [
      "SELECT * FROM Clientes",
      "SELECT ALL FROM Clientes",
      "SELECT Clientes",
      "GET * FROM Clientes",
    ],
    correctOption: "SELECT * FROM Clientes",
    explanation:
      "El comando 'SELECT * FROM [TableName]' se utiliza para seleccionar todos los registros de una tabla.",
  },
  {
    category: "Historia",
    text: "¿En qué década se creó el primer lenguaje de programación de alto nivel, Fortran?",
    options: ["1940s", "1950s", "1960s", "1970s"],
    correctOption: "1950s",
    explanation:
      "Fortran, que significa 'Formula Translation', fue creado en la década de 1950.",
  },
  {
    category: "HTML",
    text: "¿Qué etiqueta HTML se utiliza para definir un encabezado?",
    options: [
      "&lt;head&gt;",
      "&lt;h1&gt;",
      "&lt;header&gt;",
      "&lt;heading&gt;",
    ],
    correctOption: "&lt;h1&gt;",
    explanation:
      "La etiqueta '&lt;h1&gt;' se utiliza para definir el encabezado más importante en HTML. Hay seis niveles de encabezados, desde '&lt;h1&gt;' hasta '&lt;h6&gt;'.",
  },
  {
    category: "C++",
    text: "¿Qué palabra clave en C++ se usa para definir una constante?",
    options: ["static", "const", "define", "final"],
    correctOption: "const",
    explanation:
      "La palabra clave 'const' en C++ se utiliza para definir una variable como constante, lo que significa que su valor no puede ser cambiado después de su inicialización.",
  },
  {
    category: "Historia",
    text: "¿Qué lenguaje de programación fue desarrollado primero?",
    options: ["C", "Python", "Lisp", "Fortran"],
    correctOption: "Lisp",
    explanation: "Lisp fue creado en 1958, antes que C y Python.",
  },
  {
    category: "PHP",
    text: "¿Qué función en PHP se usa para enviar datos a la base de datos?",
    options: ["send()", "post()", "mysql_query()", "db_send()"],
    correctOption: "mysql_query()",
    explanation:
      "La función 'mysql_query()' en PHP es utilizada para enviar consultas a una base de datos MySQL. Sin embargo, es importante mencionar que esta función está obsoleta en versiones más recientes de PHP y se recomienda usar otras soluciones, como 'mysqli' o 'PDO'.",
  },
];

function wrapText(context, text, x, y, maxWidth, lineHeight) {
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

function updateScore(isCorrect) {
  if (isCorrect) {
    score++;
    factDiv.innerText = "Puntaje: " + score;
  }
}

const congratulationsMessages = {
  es: "¡Feliz Día del Programador!",
  cn: "程序员节快乐！",
  ru: "С Днем программиста!",
  en: "Happy Programmer's Day!",
  de: "Frohen Programmierertag!",
};

const motivationalQuotes = [
  "¡Lo estás haciendo bien, sigue así!",
  "Cada desafío te acerca más a tu objetivo.",
  "La perseverancia es la clave del éxito.",
  "Cada error es una lección aprendida.",
  "Estás un paso más cerca de tu victoria.",
  "Confía en tu capacidad para superar cada nivel.",
  "El éxito es la suma de pequeños esfuerzos repetidos.",
  "La determinación es la puerta al triunfo.",
  "Nunca subestimes el poder de la persistencia.",
];

function displayEndButtons(isCorrect) {
  optionsDiv.innerHTML = "";
  const btn = document.createElement("button");
  const explanationDiv = document.getElementById("explanation");

  updateScore(isCorrect);

  if (isCorrect) {
    if (currentLineIndex < codeLines.length - 1) {
      explanationDiv.innerText = motivationalQuotes[currentLineIndex];
      btn.innerHTML = "Pasar al siguiente nivel";
      btn.onclick = () => {
        currentLineIndex++;
        displayChallenge();
      };
    } else {
      explanationDiv.innerText = "";
      btn.innerHTML = "¡Has ganado!";
      btn.onclick = displayCredits;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let yOffset = 50;
      for (let lang in congratulationsMessages) {
        ctx.fillText(congratulationsMessages[lang], 10, yOffset);
        yOffset += 30;
      }
    }
  } else {
    explanationDiv.innerText = codeLines[currentLineIndex].explanation;
    btn.innerHTML = "Reintentar";
    btn.onclick = () => displayChallenge();
  }

  optionsDiv.appendChild(btn);
}

function displayChallenge() {
  const explanationDiv = document.getElementById("explanation");
  explanationDiv.innerText = "";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px Arial";
  ctx.fillStyle = "#00ff00";
  wrapText(
    ctx,
    codeLines[currentLineIndex].text,
    10,
    50,
    canvas.width - 20,
    25
  );

  optionsDiv.innerHTML = "";
  codeLines[currentLineIndex].options.forEach((option) => {
    const btn = document.createElement("button");
    btn.innerHTML = option;
    btn.onclick = () => {
      const isCorrect = option === codeLines[currentLineIndex].correctOption;
      displayEndButtons(isCorrect);
    };
    optionsDiv.appendChild(btn);
  });
}

document.getElementById("startButton").onclick = function () {
  instructionsDiv.style.display = "none";
  canvas.style.display = "block";
  factDiv.style.display = "block";
  optionsDiv.style.display = "block";

  factDiv.innerText = "Puntaje: " + score;

  displayChallenge();
};

function displayCredits() {
  // Limpiar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ocultar la división del puntaje
  factDiv.style.display = "none";
  optionsDiv.innerHTML = "";

  const creditsDiv = document.createElement("div");
  creditsDiv.classList.add("credits-container");

  // Título
  const title = document.createElement("h2");
  title.classList.add("credits-title");
  title.innerText = "Sobre pale_codepunk";
  creditsDiv.appendChild(title);

  // Biografía
  const bio = document.createElement("p");
  bio.classList.add("credits-bio");
  bio.innerText = `Hola, soy pale_codepunk. Desde una temprana edad, me sumergí en el fascinante mundo de la programación. Esta pasión me ha llevado a embarcarme en innumerables aventuras creativas, desde el desarrollo web hasta la creación de soluciones tecnológicas innovadoras.`;
  creditsDiv.appendChild(bio);

  // Habilidades
  const skillsList = [
    { skill: "HTML", icon: "fab fa-html5" },
    { skill: "CSS", icon: "fab fa-css3-alt" },
    { skill: "Bootstrap", icon: "fab fa-bootstrap" },
    { skill: "Javascript", icon: "fab fa-js" },
    { skill: "React", icon: "fab fa-react" },
    { skill: "SQL", icon: "fas fa-database" },
    { skill: "Java", icon: "fab fa-java" },
    { skill: "Python", icon: "fab fa-python" },
    // Nota: Cobol y Flask no tienen iconos específicos en Font Awesome,
    // así que no hemos agregado un ícono para ellos
  ];

  const skillsTitle = document.createElement("h3");
  skillsTitle.classList.add("credits-skills-title");
  skillsTitle.innerText = "Skills:";
  creditsDiv.appendChild(skillsTitle);

  const skillsUl = document.createElement("ul");
  skillsUl.classList.add("credits-skills-list");
  for (let item of skillsList) {
    const li = document.createElement("li");
    if (item.icon) {
      const icon = document.createElement("i");
      icon.className = item.icon;
      li.appendChild(icon);
      li.innerHTML += " " + item.skill;
    } else {
      li.innerText = item.skill;
    }
    skillsUl.appendChild(li);
  }
  creditsDiv.appendChild(skillsUl);

  // Vínculos de contacto
  const contactLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/full-stack-julian-soto/",
      icon: "fab fa-linkedin",
    },
    {
      name: "Facebook",
      url: "https://facebook.com/paalecode",
      icon: "fab fa-facebook",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/pale_codepunk",
      icon: "fab fa-instagram",
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/user/31ibu52f5hdmgv3lqpoq5kvb3h24?si=pXECfBLySomL-0yIBxPxdQ",
      icon: "fab fa-spotify",
    },
    {
      name: "Gmail (Desarrollo)",
      url: "mailto:juliansoto.dev@gmail.com",
      icon: "fas fa-envelope",
    },
    {
      name: "Gmail (Producción)", 
      url: "mailto:paleproductions17@gmail.com",
      icon: "fas fa-envelope",
    },
  ];

  const linksTitle = document.createElement("h3");
  linksTitle.classList.add("credits-links-title");
  linksTitle.innerText = "Estas son mis redes sociales:";
  creditsDiv.appendChild(linksTitle);

  const linksUl = document.createElement("ul");
  linksUl.classList.add("credits-links-list");
  for (let link of contactLinks) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = link.url;

    if (link.icon) {
      const icon = document.createElement("i");
      icon.className = link.icon;
      a.appendChild(icon);
      a.innerHTML += " " + link.name;
    } else {
      a.innerText = link.name;
    }

    a.target = "_blank";
    li.appendChild(a);
    linksUl.appendChild(li);
  }
  creditsDiv.appendChild(linksUl);
  optionsDiv.appendChild(creditsDiv);
}
