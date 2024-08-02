let score = 0;
let levelActual = 1;

let screen = document.querySelector(".screen");
let scorePanel = document.querySelector(".score");
let levelPanel = document.querySelector(".level");
let commentsPanel = document.querySelector(".comments");
const bomb = "bomb.gif";

createEnemies();

function createEnemies() {
  NPCS.forEach((NPC) => {
    const npc = document.createElement("div");
    npc.id = NPC.id;
    npc.classList.add("npcs");
    npc.style.backgroundImage = `url('./images/${NPC.backgroundImage}')`;
    npc.style.animationDuration = NPC.speed;
    npc.style.animationDelay = NPC.delay;
    npc.setAttribute("points", NPC.points);
    screen.appendChild(npc);
    npc.addEventListener("click", handleEnemyClick);
  });
}

function handleEnemyClick(event) {
  const npc = event.target;
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
      let originalBackground = NPCS.find(
        (n) => parseInt(npc.id) === n.id
      ).backgroundImage;
      npc.style.backgroundImage = `url('./images/${originalBackground}')`;
    }
  }

  requestAnimationFrame(update);
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
    commentsPanel.textContent = comment.comment;
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
