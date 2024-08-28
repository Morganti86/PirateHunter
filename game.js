let score = 0;
let levelActual = 0;
let escaped = 0;
const bomb = "bomb.gif";
const innocentKilled = "INNOCENT KILLED";
const pirateEscaped = "PIRATE ESCAPED";
const music = new Audio("sounds/music.mp3");

// let logo = document.querySelector(".logo");
let body = document.querySelector(".body");
let start = document.querySelector(".play");
start.addEventListener("click", play);

let screen = document.querySelector(".screen");
const initialScreenBackground = screen.style.background;

let message = document.querySelector(".message");
let scorePanel = document.querySelector(".score");
let levelPanel = document.querySelector(".level");
let commentsPanel = document.querySelector(".comments");

function play() {
  // logo.style.visibility = "hidden";
  body.style.background = "black";
  start.style.display = "none";
  message.textContent = "";
  screen.style.visibility = "visible";
  scorePanel.style.visibility = "visible";
  levelPanel.style.visibility = "visible";
  refreshScore(score);
  refreshLevel(score);
  refreshComment(score);
  playMusic(music);
  createEnemies();
}

function createEnemies() {
  NPCS.forEach((NPC) => {
    const npc = document.createElement("div");
    npc.id = NPC.id;
    npc.classList.add("npcs");
    npc.style.backgroundImage = `url('./images/${NPC.backgroundImage}')`;
    npc.style.animationDuration = NPC.speed;
    1;
    npc.style.animationDelay = NPC.delay;
    npc.style.visibility = "visible";
    npc.setAttribute("points", NPC.points);
    npc.setAttribute("alive", true);
    screen.appendChild(npc);
    npc.addEventListener("click", handleEnemyClick);
    checkEscape(npc);
  });
}

function handleEnemyClick(event) {
  const npc = event.target;
  npc.setAttribute("alive", false);
  const points = parseInt(npc.getAttribute("points"), 10);
  score += points;
  npc.style.backgroundImage = `url('./images/${bomb}')`;
  npc.style.backgroundPosition = "center";

  setTimeout(() => {
    npc.style.visibility = "hidden";
    checkPosition(npc);
  }, 200);

  refreshScore(score);
  refreshLevel(score);
  refreshComment(score);
  checkLose(npc);
}

function retry(text) {
  clearEnemies();
  score = 0;
  levelActual = 0;
  screen.style.background = initialScreenBackground;
  // logo.style.visibility = "visible";
  message.textContent = text;
  body.style.backgroundImage = `url('./images/background.webp')`;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "bottom";
  body.style.backgroundRepeat = "no-repeat";
  start.textContent = "RETRY";
  start.style.display = "block";
  screen.style.visibility = "hidden";
  scorePanel.style.visibility = "hidden";
  levelPanel.style.visibility = "hidden";
  commentsPanel.textContent = "";
}

function clearEnemies() {
  const npcs = document.querySelectorAll(".npcs");
  npcs.forEach((npc) => npc.remove());
}

function checkLose(npc) {
  if (npc.id === "5") {
    retry(innocentKilled);
  }
}

function checkPosition(npc) {
  function update() {
    let screen = document.querySelector(".screen");
    let screenRect = screen.getBoundingClientRect();
    let screenLeft = screenRect.left;

    let npcRect = npc.getBoundingClientRect();
    let npcRight = npcRect.right; // Bordo derecho del `NPC`
    // Si el borde derecho del `NPC` está a la izquierda del borde derecho de la pantalla
    if (npcRight > screenLeft) {
      requestAnimationFrame(update);
    } else {
      npc.style.visibility = "visible"; // Volver a mostrar el NPC
      npc.setAttribute("alive", true);
      let originalBackground = NPCS.find(
        (n) => parseInt(npc.id) === n.id
      ).backgroundImage;
      npc.style.backgroundImage = `url('./images/${originalBackground}')`;
    }
  }

  requestAnimationFrame(update);
}

function checkEscape(npc) {
  // not take into account innocents
  if (npc.id !== "5") {
    function update() {
      let screenRect = screen.getBoundingClientRect();
      let screenRight = screenRect.right;

      let npcRect = npc.getBoundingClientRect();
      let npcRight = npcRect.right; // Bordo derecho del `NPC`

      // Si el borde derecho del NPC ha pasado el borde derecho de la pantalla
      if (npcRight < screenRight) {
        requestAnimationFrame(update);
      } else {
        let alive = npc.getAttribute("alive");
        if (alive === "true") {
          escaped++;
          retry(pirateEscaped);
        }
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }
}

function refreshScore(score) {
  let scoreAux = score.toString().padStart(8, "0");
  scorePanel.textContent = "SCORE: " + scoreAux;
}

function refreshComment(score) {
  let comment = COMMENTS.slice()
    .reverse()
    .find((c) => score >= c.score);

  if (comment) {
    // commentsPanel.textContent = comment.comment;
    // cambiamos para que funcionen los saltos de linea
    commentsPanel.innerHTML = comment.comment;
  }
}

function refreshLevel(score) {
  let level = LEVELS.slice()
    .reverse()
    .find((l) => score >= l.score);

  if (level.level > levelActual) {
    levelPanel.textContent = "LEVEL: " + level.level;
    screen.style.backgroundImage = `url('./images/${level.background}')`;
    levelActual = level.level;
  }
}

function playMusic(music) {
  music.volume = 0.2;
  music.loop = true;
  music.play();
}
