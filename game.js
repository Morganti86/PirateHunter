
let score = 0;
let scorePanel = document.querySelector(".score");
let commentsPanel = document.querySelector(".comments");

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
  const points = parseInt(event.target.getAttribute("points"), 10);
  score += points;
  refreshScore(score);
  event.target.style.backgroundColor = "green";
}

function refreshScore(score) {
  let scoreAux = score.toString().padStart(8, "0");
  scorePanel.textContent = "SCORE: " + scoreAux;
  refreshComment(score);
}

function refreshComment(score) {
  const comment = COMMENTS.find((comment) => score <= comment.score);
  commentsPanel.textContent = comment.comment;
}
