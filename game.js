let score = 0;
let scorePanel = document.querySelector(".score");
let commentsPanel = document.querySelector(".comments");
const bomb = "url('./images/bomb.gif')";

createEnemies();

function createEnemies() {
  const screen = document.querySelector(".screen");
  NPCS.forEach((NPC) => {
    const npc = document.createElement("div");
    npc.id = NPC.id;
    npc.classList.add("npcs");
    npc.style.backgroundImage = NPC.backgroundImage;
    npc.style.animationDuration = NPC.speed;
    npc.style.animationName = "npcs";
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

  npc.style.backgroundImage = bomb;
  npc.style.backgroundPosition = "center";

  setTimeout(() => {
    npc.style.visibility = "hidden";
    checkPosition(npc);
  }, 800);

  refreshScore(score);
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
      console.log("sali de requestAnimationFrame");
      console.log("npcRight: ", npcRight);
      console.log("screenLeft: ", screenLeft);

      npc.style.visibility = "visible"; // Volver a mostrar el NPC
      let originalBackground = NPCS.find(
        (n) => parseInt(npc.id) === n.id
      ).backgroundImage;
      npc.style.backgroundImage = originalBackground;
    }
  }

  requestAnimationFrame(update);
}

function refreshScore(score) {
  let scoreAux = score.toString().padStart(8, "0");
  scorePanel.textContent = "SCORE: " + scoreAux;
  refreshComment(score);
}

function refreshComment(score) {
  let comment = COMMENTS.slice()
    .reverse()
    .find((c) => score >= c.score);

  if (comment) {
    commentsPanel.textContent = comment.comment;
  }
}
