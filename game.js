const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const seekList = document.querySelector("#seekList");
const foundCount = document.querySelector("#foundCount");
const heartsDisplay = document.querySelector("#hearts");
const levelName = document.querySelector("#levelName");
const perspectiveName = document.querySelector("#perspectiveName");
const message = document.querySelector("#message");
const restart = document.querySelector("#restart");
const nextLevel = document.querySelector("#nextLevel");

const world = { width: 2200, height: 1500 };
const targetNames = [
  "Max",
  "Connor",
  "Andrea",
  "Clara",
  "William",
  "Dalia",
  "Sophia",
  "Toby",
  "Evie",
  "Another Max",
  "Lorenco",
  "Frank",
  "Mrs Grove",
];

const laterLevelTargetNames = [
  "Maya",
  "Nora",
  "Glynis",
  "Daniel A",
  "Daniel G",
  "Nola",
  "Bob",
];

const decoyNames = [
  "Sam",
  "Poppy",
  "Grace",
  "Noah",
  "Mia",
  "Oliver",
  "Ava",
  "Leo",
  "Ruby",
  "Jack",
  "Lily",
  "Oscar",
  "Ella",
  "Isaac",
  "Amelia",
  "Harry",
  "Ivy",
  "Archie",
  "Sienna",
  "George",
  "Freya",
  "Theo",
  "Zara",
  "Lucas",
  "Eliza",
];

const biomes = [
  {
    name: "Baskerville Map",
    ground: "#284421",
    grid: "rgba(255, 255, 255, 0.05)",
    scenery: ["tree", "bush", "log"],
    colors: { tree: "#315f2a", bush: "#5d7e38", trunk: "#5a3420", rock: "#81745f" },
    message: "Level 1: Baskerville Map. Find everyone across the sketch lands!",
  },
  {
    name: "Snow and Runes",
    ground: "#d9edf2",
    grid: "rgba(37, 80, 96, 0.13)",
    scenery: ["pine", "snowdrift", "ice"],
    colors: { tree: "#2a6a61", bush: "#f4fbff", trunk: "#6d4d36", rock: "#a4c5cf" },
    message: "Level 2: Snowy Playground. Maya, Nora, Glynis, both Daniels, Nola, and Bob join in.",
  },
  {
    name: "Desert and Forest",
    ground: "#dcb66f",
    grid: "rgba(104, 70, 28, 0.13)",
    scenery: ["palm", "shell", "umbrella"],
    colors: { tree: "#3f8b4b", bush: "#e56d4f", trunk: "#87522f", rock: "#f8e1a1" },
    message: "Level 3: Sandy Beach. Everyone is hiding in the sunshine.",
  },
  {
    name: "Ruins and Lava Lands",
    ground: "#303846",
    grid: "rgba(226, 232, 255, 0.08)",
    scenery: ["tower", "bramble", "stone"],
    colors: { tree: "#26312c", bush: "#573b69", trunk: "#766f82", rock: "#858c9a" },
    message: "Level 4: Moonlit Castle. Mrs Grove is somewhere in the dark.",
  },
];

const mapRegions = [
  {
    name: "Snow",
    fill: "#dce8f2",
    text: [120, 240],
    points: [[0, 0], [280, 0], [245, 260], [110, 325], [0, 280]],
  },
  {
    name: "Baskerville",
    fill: "#9fb7e1",
    text: [740, 190],
    points: [[280, 0], [1260, 0], [1380, 430], [1170, 520], [740, 460], [245, 260]],
  },
  {
    name: "The Runes",
    fill: "#8ba4d1",
    text: [480, 640],
    points: [[0, 280], [245, 260], [740, 460], [720, 820], [560, 900], [0, 760]],
  },
  {
    name: "Desert",
    fill: "#d7b06d",
    text: [190, 980],
    points: [[0, 760], [560, 900], [760, 1500], [0, 1500]],
  },
  {
    name: "Forest",
    fill: "#77a969",
    text: [1030, 1180],
    points: [[560, 900], [720, 820], [1260, 1020], [1790, 1190], [1870, 1500], [760, 1500]],
  },
  {
    name: "The Ruins",
    fill: "#a4a0b0",
    text: [1300, 720],
    points: [[720, 820], [740, 460], [1170, 520], [1380, 430], [1505, 1060], [1260, 1020]],
  },
  {
    name: "Lava Lands",
    fill: "#c06a4d",
    text: [1835, 580],
    points: [[1260, 0], [2200, 0], [2200, 1500], [1870, 1500], [1790, 1190], [1505, 1060], [1380, 430]],
  },
];

const regionMissions = {
  Snow: ["Sophia", "Evie", "Nora"],
  Baskerville: ["Mrs Grove", "Andrea", "William"],
  "The Runes": ["Clara", "Dalia", "Frank"],
  Desert: ["Toby", "Another Max", "Bob"],
  Forest: ["Lorenco", "Max", "Daniel A", "Connor"],
  "The Ruins": ["Magic Key 1", "Magic Key 2", "Magic Key 3"],
  "Lava Lands": ["Maya", "Max", "Connor", "Mrs Grove"],
};

const fixedLandmarks = [
  { type: "castle", x: 365, y: 155, size: 72 },
  { type: "snowman", x: 125, y: 395, size: 58 },
  { type: "portal", x: 930, y: 680, size: 145 },
  { type: "pine", x: 820, y: 1010, size: 78 },
  { type: "pine", x: 1480, y: 1330, size: 82 },
  { type: "crane", x: 1815, y: 210, size: 135 },
  { type: "lava-rock", x: 1985, y: 770, size: 86 },
  { type: "waterfall", x: 1940, y: 1080, size: 104 },
  { type: "cactus", x: 365, y: 1260, size: 72 },
  { type: "cave", x: 125, y: 1215, size: 64 },
  { type: "hole", x: 940, y: 390, size: 74 },
  { type: "totem", x: 1700, y: 865, size: 60 },
  { type: "statue", x: 1180, y: 270, size: 70 },
];

const keys = new Set();
const mouse = { active: false, x: 0, y: 0 };
const perspectives = [
  { name: "Map View", zoom: 1 },
  { name: "Chase View", zoom: 1.75 },
];
let currentLevelIndex = 0;
let perspectiveIndex = 0;
let gameStarted = false;
let selectedRegion = null;
let player;
let people;
let scenery;
let hazards;
let pickups;
let camera;
let gameWon;
let flashTimer;
let hearts;
let damageCooldown;
let snowDrainTimer;
let mazeMode;
let superPower;
let keysReadyAnnounced;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function activeBiome() {
  return biomes[currentLevelIndex];
}

function activePerspective() {
  return perspectives[perspectiveIndex];
}

function viewWidth() {
  return canvas.width / activePerspective().zoom;
}

function viewHeight() {
  return canvas.height / activePerspective().zoom;
}

function activeTargetNames() {
  if (!selectedRegion) {
    return [];
  }
  return regionMissions[selectedRegion.name] || targetNames;
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const crosses = yi > point.y !== yj > point.y
      && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (crosses) {
      inside = !inside;
    }
  }
  return inside;
}

function regionAt(point) {
  return mapRegions.find((region) => pointInPolygon(point, region.points));
}

function randomPointInRegion(region) {
  const xs = region.points.map((point) => point[0]);
  const ys = region.points.map((point) => point[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const point = {
      x: randomBetween(minX + 45, maxX - 45),
      y: randomBetween(minY + 45, maxY - 45),
    };
    if (pointInPolygon(point, region.points)) {
      return point;
    }
  }

  return { x: region.text[0], y: region.text[1] };
}

function makeHazard(type, region, index = 0) {
  let spot = randomPointInRegion(region);
  for (let attempt = 0; player && attempt < 30 && distance(player, spot) < 170; attempt += 1) {
    spot = randomPointInRegion(region);
  }
  return {
    type,
    x: spot.x,
    y: spot.y,
    radius: type === "storm" ? 76 : 28,
    vx: randomBetween(-1.5, 1.5) || 1,
    vy: randomBetween(-1.5, 1.5) || 1,
    cooldown: 50 + index * 35,
    timer: 0,
    fire: [],
    bullets: [],
  };
}

function setupMissionObjects(region) {
  hazards = [];
  pickups = [];

  if (region.name === "Forest") {
    hazards = [makeHazard("sniper", region, 0), makeHazard("sniper", region, 1)];
  }

  if (region.name === "Desert") {
    hazards = [makeHazard("storm", region, 0), makeHazard("storm", region, 1), makeHazard("storm", region, 2)];
  }

  if (region.name === "Lava Lands") {
    hazards = [makeHazard("lava", region, 0), makeHazard("lava", region, 1), makeHazard("lava", region, 2), makeHazard("lava", region, 3)];
  }

  if (region.name === "Baskerville") {
    hazards = [makeHazard("human", region, 0), makeHazard("human", region, 1), makeHazard("human", region, 2)];
  }

  if (region.name === "The Runes") {
    hazards = [makeHazard("dragon", region, 0), makeHazard("dragon", region, 1)];
  }

  if (region.name === "The Ruins") {
    pickups = activeTargetNames().map((name) => {
      const spot = randomPointInRegion(region);
      return { name, x: spot.x, y: spot.y, found: false, kind: "key" };
    });
    hazards = [{ type: "portal", x: region.text[0], y: region.text[1] - 120, radius: 54 }];
  }
}

function drawPixelText(text, x, y, size = 24, color = "#172033") {
  ctx.fillStyle = color;
  ctx.font = `800 ${size}px "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function drawWorldPolygon(points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0] - camera.x, points[0][1] - camera.y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0] - camera.x, points[i][1] - camera.y);
  }
  ctx.closePath();
  ctx.fill();
}

function strokeWorldPath(points, closed = false, color = "#162036", width = 5) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = "miter";
  ctx.lineCap = "square";
  ctx.beginPath();
  ctx.moveTo(points[0][0] - camera.x, points[0][1] - camera.y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0] - camera.x, points[i][1] - camera.y);
  }
  if (closed) {
    ctx.closePath();
  }
  ctx.stroke();
}

function drawPixelCircle(x, y, radius, color) {
  ctx.fillStyle = color;
  const step = Math.max(4, Math.floor(radius / 3));
  for (let yy = -radius; yy <= radius; yy += step) {
    for (let xx = -radius; xx <= radius; xx += step) {
      if (xx * xx + yy * yy <= radius * radius) {
        ctx.fillRect(x + xx, y + yy, step, step);
      }
    }
  }
}

function makePerson(name, target, index, region = selectedRegion) {
  const color = target
    ? `hsl(${(index * 47 + 40) % 360} 62% 62%)`
    : `hsl(${(index * 31 + 185) % 360} 38% 48%)`;
  const spot = region ? randomPointInRegion(region) : {
    x: randomBetween(100, world.width - 100),
    y: randomBetween(100, world.height - 100),
  };

  return {
    name,
    target,
    found: false,
    x: spot.x,
    y: spot.y,
    radius: target ? 17 : 14,
    color,
    wiggle: randomBetween(0, Math.PI * 2),
  };
}

function createScenery() {
  const types = ["tree", "pine", "rock", "cactus", "snowdrift", "ruin", "lava-rock"];
  const items = [];
  for (let i = 0; i < 80; i += 1) {
    items.push({
      x: randomBetween(40, world.width - 40),
      y: randomBetween(40, world.height - 40),
      size: randomBetween(18, 44),
      type: types[Math.floor(randomBetween(0, types.length))],
    });
  }
  return [...items, ...fixedLandmarks];
}

function startLevel(index) {
  currentLevelIndex = (index + biomes.length) % biomes.length;
  gameStarted = false;
  selectedRegion = null;
  player = null;
  people = [];
  scenery = createScenery();
  hazards = [];
  pickups = [];
  camera = { x: 0, y: 0 };
  gameWon = false;
  flashTimer = 0;
  hearts = 5;
  damageCooldown = 0;
  snowDrainTimer = 0;
  mazeMode = false;
  superPower = false;
  keysReadyAnnounced = false;
  nextLevel.disabled = true;
  levelName.textContent = "Choose a Place";
  perspectiveName.textContent = "Map Select";
  renderList();
  updateHearts();
  showMessage("Click a place on the map to start its mission.", 999999);
}

function startMission(region) {
  selectedRegion = region;
  gameStarted = true;
  const levelTargets = activeTargetNames();
  const start = randomPointInRegion(region);
  player = {
    x: start.x,
    y: start.y,
    radius: 18,
    speed: region.name === "Snow" ? 2.55 : 4,
    trail: [],
    mazeX: 70,
    mazeY: 560,
  };

  setupMissionObjects(region);
  people = region.name === "The Ruins"
    ? decoyNames.slice(0, 5).map((name, personIndex) => makePerson(name, false, personIndex, region))
    : [
        ...levelTargets.map((name, personIndex) => makePerson(name, true, personIndex, region)),
        ...decoyNames.slice(0, 10).map((name, personIndex) => makePerson(name, false, personIndex, region)),
      ];
  gameWon = false;
  flashTimer = 0;
  hearts = 5;
  damageCooldown = 0;
  snowDrainTimer = 0;
  mazeMode = false;
  superPower = false;
  keysReadyAnnounced = false;
  nextLevel.disabled = true;
  levelName.textContent = `${region.name} Mission`;
  perspectiveName.textContent = activePerspective().name;
  renderList();
  updateCamera();
  showMessage(`${region.name} mission started. Find ${levelTargets.join(", ")}.`, 3200);
  updateHearts();
}

function resetGame() {
  startLevel(currentLevelIndex);
}

function renderList() {
  seekList.innerHTML = "";
  const levelTargets = activeTargetNames();
  const foundPeople = people.filter((person) => person.target && person.found).length;
  const foundPickups = pickups.filter((pickup) => pickup.found).length;
  const foundTargets = foundPeople + foundPickups;
  foundCount.textContent = selectedRegion ? `${foundTargets} / ${levelTargets.length}` : "Pick map";

  if (!selectedRegion) {
    for (const region of mapRegions) {
      const item = document.createElement("li");
      item.innerHTML = `<span>${region.name}</span><strong>mission</strong>`;
      seekList.append(item);
    }
    return;
  }

  for (const name of levelTargets) {
    const target = people.find((candidate) => candidate.name === name)
      || pickups.find((candidate) => candidate.name === name);
    const item = document.createElement("li");
    item.className = target?.found ? "found" : "";
    item.innerHTML = `<span>${name}</span><strong>${target?.found ? "found" : "hidden"}</strong>`;
    seekList.append(item);
  }
}

function updateHearts() {
  heartsDisplay.textContent = selectedRegion
    ? (hearts > 0 ? "♥ ".repeat(hearts).trim() : "0")
    : "♥ ♥ ♥ ♥ ♥";
}

function showMessage(text, duration = 1700) {
  message.textContent = text;
  message.classList.remove("is-hidden");
  flashTimer = duration;
}

function damagePlayer(amount, text) {
  if (!gameStarted || gameWon || superPower || damageCooldown > 0) {
    return;
  }

  hearts = clamp(hearts - amount, 0, 5);
  damageCooldown = 70;
  updateHearts();
  showMessage(text, 1300);

  if (hearts <= 0) {
    gameWon = true;
    nextLevel.disabled = false;
    showMessage("Tim is out of hearts. Restart or choose another place.", 999999);
  }
}

function updatePlayer() {
  if (!gameStarted || gameWon) {
    return;
  }

  if (mazeMode) {
    updateMazePlayer();
    return;
  }

  let dx = 0;
  let dy = 0;
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s")) dy += 1;

  if (mouse.active) {
    const targetX = mouse.x + camera.x;
    const targetY = mouse.y + camera.y;
    const toPointer = Math.hypot(targetX - player.x, targetY - player.y);
    if (toPointer > 12) {
      dx += (targetX - player.x) / toPointer;
      dy += (targetY - player.y) / toPointer;
    }
  }

  const length = Math.hypot(dx, dy) || 1;
  const speed = superPower ? player.speed * 1.65 : player.speed;
  player.x = clamp(player.x + (dx / length) * speed, player.radius, world.width - player.radius);
  player.y = clamp(player.y + (dy / length) * speed, player.radius, world.height - player.radius);
  player.trail.unshift({ x: player.x, y: player.y });
  player.trail.length = 420;
}

function updateMazePlayer() {
  let dx = 0;
  let dy = 0;
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s")) dy += 1;
  const length = Math.hypot(dx, dy) || 1;
  const next = {
    x: player.mazeX + (dx / length) * 4,
    y: player.mazeY + (dy / length) * 4,
  };

  if (!mazeWallAt(next.x, next.y)) {
    player.mazeX = clamp(next.x, 24, canvas.width - 24);
    player.mazeY = clamp(next.y, 24, canvas.height - 24);
  }

  if (player.mazeX > canvas.width - 78 && player.mazeY < 86) {
    mazeMode = false;
    superPower = true;
    player.speed = 5.2;
    showMessage("Maze complete. Tim has super powers!", 2600);
  }
}

function mazeWallAt(x, y) {
  const walls = [
    [0, 0, canvas.width, 18],
    [0, canvas.height - 18, canvas.width, 18],
    [0, 0, 18, canvas.height],
    [canvas.width - 18, 0, 18, canvas.height],
    [120, 90, 28, 430],
    [230, 0, 28, 420],
    [340, 210, 28, 430],
    [450, 80, 28, 420],
    [560, 220, 28, 420],
    [670, 0, 28, 430],
    [780, 210, 28, 330],
    [890, 80, 28, 420],
  ];
  return walls.some(([wx, wy, ww, wh]) => x > wx - 10 && x < wx + ww + 10 && y > wy - 10 && y < wy + wh + 10);
}

function updateFollowers() {
  if (!gameStarted || mazeMode) {
    return;
  }
  const followers = people.filter((person) => person.found);

  followers.forEach((person, index) => {
    const targetPoint = player.trail[(index + 1) * 17] || player;
    person.x += (targetPoint.x - person.x) * 0.08;
    person.y += (targetPoint.y - person.y) * 0.08;
    person.wiggle += 0.08;
  });
}

function updateHazards() {
  if (!gameStarted || gameWon || mazeMode || !selectedRegion) {
    return;
  }

  if (damageCooldown > 0) {
    damageCooldown -= 1;
  }

  if (selectedRegion.name === "Snow") {
    snowDrainTimer += 1;
    if (snowDrainTimer > 240) {
      snowDrainTimer = 0;
      damagePlayer(1, "The cold snow drains one heart.");
    }
  }

  for (const hazard of hazards) {
    if (hazard.type === "storm") {
      hazard.x += hazard.vx;
      hazard.y += hazard.vy;
      if (!pointInPolygon(hazard, selectedRegion.points)) {
        hazard.vx *= -1;
        hazard.vy *= -1;
      }
      if (distance(player, hazard) < hazard.radius) {
        player.x = clamp(player.x - hazard.vx * 18, player.radius, world.width - player.radius);
        player.y = clamp(player.y - hazard.vy * 18, player.radius, world.height - player.radius);
      }
    }

    if (hazard.type === "lava" && distance(player, hazard) < hazard.radius + player.radius) {
      hearts = 0;
      updateHearts();
      gameWon = true;
      nextLevel.disabled = false;
      showMessage("Tim fell in lava. Instant game over!", 999999);
    }

    if (hazard.type === "human") {
      const toPlayer = Math.max(1, distance(hazard, player));
      hazard.x += ((player.x - hazard.x) / toPlayer) * 2.2;
      hazard.y += ((player.y - hazard.y) / toPlayer) * 2.2;
      if (toPlayer < 34) {
        hearts = 0;
        updateHearts();
        gameWon = true;
        nextLevel.disabled = false;
        showMessage("The Baskerville human caught Tim!", 999999);
      }
    }

    if (hazard.type === "sniper") {
      hazard.cooldown -= 1;
      if (hazard.cooldown <= 0) {
        const toPlayer = Math.max(1, distance(hazard, player));
        hazard.bullets.push({
          x: hazard.x,
          y: hazard.y,
          vx: ((player.x - hazard.x) / toPlayer) * 5,
          vy: ((player.y - hazard.y) / toPlayer) * 5,
        });
        hazard.cooldown = 95;
      }
      updateProjectiles(hazard.bullets, 1, "A sniper shot hit Tim.");
    }

    if (hazard.type === "dragon") {
      hazard.cooldown -= 1;
      if (hazard.cooldown <= 0) {
        const toPlayer = Math.max(1, distance(hazard, player));
        hazard.fire.push({
          x: hazard.x,
          y: hazard.y,
          vx: ((player.x - hazard.x) / toPlayer) * 3.8,
          vy: ((player.y - hazard.y) / toPlayer) * 3.8,
          life: 80,
        });
        hazard.cooldown = 130;
      }
      updateProjectiles(hazard.fire, 2, "Dragon fire burns away two hearts.");
    }

    if (hazard.type === "portal" && distance(player, hazard) < hazard.radius) {
      if (pickups.some((pickup) => !pickup.found)) {
        showMessage("Find all the magic keys before the question mark.", 1200);
        continue;
      }
      mazeMode = true;
      player.mazeX = 70;
      player.mazeY = 560;
      showMessage("Tim fell into the question-mark maze!", 1800);
    }
  }
}

function updateProjectiles(projectiles, damage, text) {
  for (const projectile of projectiles) {
    projectile.x += projectile.vx;
    projectile.y += projectile.vy;
    projectile.life = (projectile.life ?? 120) - 1;
    if (distance(player, projectile) < 24) {
      projectile.life = 0;
      damagePlayer(damage, text);
    }
  }

  for (let i = projectiles.length - 1; i >= 0; i -= 1) {
    const projectile = projectiles[i];
    if (projectile.life <= 0 || projectile.x < 0 || projectile.x > world.width || projectile.y < 0 || projectile.y > world.height) {
      projectiles.splice(i, 1);
    }
  }
}

function checkFound() {
  if (!gameStarted || gameWon) {
    return;
  }

  if (mazeMode) {
    return;
  }

  for (const person of people) {
    if (person.found || !person.target) {
      continue;
    }

    if (distance(player, person) < 54) {
      person.found = true;
      renderList();

      if (person.name === "Mrs Grove") {
        gameWon = true;
        nextLevel.disabled = false;
        showMessage(`Mrs Grove found. ${selectedRegion.name} mission complete!`, 999999);
      } else {
        showMessage(`${person.name} found. They are following Tim now!`);
      }

      const missionComplete = people
        .filter((candidate) => candidate.target)
        .every((candidate) => candidate.found);
      if (missionComplete) {
        gameWon = true;
        nextLevel.disabled = false;
        showMessage(`${selectedRegion.name} mission complete!`, 999999);
      }
    }
  }

  for (const pickup of pickups) {
    if (!pickup.found && distance(player, pickup) < 48) {
      pickup.found = true;
      renderList();
      showMessage(`${pickup.name} collected.`, 1200);
    }
  }

  if (pickups.length > 0 && pickups.every((pickup) => pickup.found) && !keysReadyAnnounced) {
    keysReadyAnnounced = true;
    nextLevel.disabled = false;
    showMessage("All magic keys found. Go to the question mark for the maze!", 1800);
  }
}

function updateCamera() {
  if (!gameStarted || !player) {
    camera.x = 0;
    camera.y = 0;
    return;
  }
  camera.x = clamp(player.x - viewWidth() / 2, 0, world.width - viewWidth());
  camera.y = clamp(player.y - viewHeight() / 2, 0, world.height - viewHeight());
}

function drawGround() {
  ctx.fillStyle = "#bfd0ef";
  ctx.fillRect(0, 0, viewWidth(), viewHeight());

  for (const region of mapRegions) {
    drawWorldPolygon(region.points, region.fill);
  }

  for (const region of mapRegions) {
    strokeWorldPath(region.points, true, "#142033", 5);
    drawPixelText(region.name, region.text[0] - camera.x, region.text[1] - camera.y, region.name.length > 11 ? 34 : 40);
  }

  ctx.strokeStyle = "rgba(16, 30, 50, 0.08)";
  ctx.lineWidth = 1;
  const grid = 88;
  const startX = -camera.x % grid;
  const startY = -camera.y % grid;

  for (let x = startX; x < viewWidth(); x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, viewHeight());
    ctx.stroke();
  }

  for (let y = startY; y < viewHeight(); y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(viewWidth(), y);
    ctx.stroke();
  }
}

function drawSceneryItem(item, x, y) {
  const s = item.size;
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#172033";

  if (item.type === "tree" || item.type === "pine") {
    ctx.fillStyle = "#6a472c";
    ctx.fillRect(x - 5, y + s * 0.15, 10, s * 0.75);
    ctx.fillStyle = item.type === "pine" ? "#2f6c45" : "#3f7b35";
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x - s * 0.55, y + s * 0.35);
    ctx.lineTo(x + s * 0.55, y + s * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    return;
  }

  if (item.type === "castle") {
    ctx.fillStyle = "#8791b0";
    ctx.fillRect(x - s * 0.45, y - s * 0.55, s * 0.9, s * 1.1);
    ctx.fillStyle = "#172033";
    ctx.fillRect(x - s * 0.18, y + s * 0.08, s * 0.36, s * 0.45);
    ctx.fillRect(x - s * 0.27, y - s * 0.24, 9, 9);
    ctx.fillRect(x + s * 0.14, y - s * 0.24, 9, 9);
    ctx.strokeRect(x - s * 0.45, y - s * 0.55, s * 0.9, s * 1.1);
    return;
  }

  if (item.type === "snowman") {
    drawPixelCircle(x, y + s * 0.12, s * 0.45, "#f4fbff");
    drawPixelCircle(x, y - s * 0.36, s * 0.28, "#f4fbff");
    ctx.fillStyle = "#172033";
    ctx.fillRect(x - 5, y - s * 0.4, 5, 5);
    ctx.fillRect(x + 8, y - s * 0.4, 5, 5);
    return;
  }

  if (item.type === "portal") {
    ctx.strokeStyle = "#172033";
    ctx.lineWidth = 9;
    ctx.strokeRect(x - s * 0.24, y - s * 0.24, s * 0.48, s * 0.48);
    ctx.lineWidth = 5;
    ctx.strokeRect(x - s * 0.52, y - s * 0.52, s * 1.04, s * 1.04);
    drawPixelText("?", x, y, s * 0.42, "#172033");
    return;
  }

  if (item.type === "crane") {
    ctx.strokeStyle = "#172033";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x - s * 0.45, y - s * 0.5);
    ctx.lineTo(x + s * 0.45, y - s * 0.45);
    ctx.lineTo(x + s * 0.35, y + s * 0.35);
    ctx.moveTo(x + s * 0.15, y - s * 0.42);
    ctx.lineTo(x - s * 0.08, y + s * 0.15);
    ctx.stroke();
    drawPixelCircle(x - s * 0.18, y + s * 0.2, s * 0.22, "#67383a");
    return;
  }

  if (item.type === "waterfall") {
    ctx.fillStyle = "#95c6dc";
    ctx.fillRect(x - s * 0.36, y - s * 0.52, s * 0.72, s * 1.04);
    ctx.strokeRect(x - s * 0.36, y - s * 0.52, s * 0.72, s * 1.04);
    ctx.fillStyle = "#f4fbff";
    ctx.fillRect(x - 10, y - s * 0.32, 8, s * 0.68);
    ctx.fillRect(x + 12, y - s * 0.24, 8, s * 0.62);
    return;
  }

  if (item.type === "cactus") {
    ctx.fillStyle = "#3f7b35";
    ctx.fillRect(x - 8, y - s * 0.55, 16, s);
    ctx.fillRect(x - s * 0.34, y - s * 0.15, s * 0.24, 12);
    ctx.fillRect(x + s * 0.12, y - s * 0.28, s * 0.24, 12);
    ctx.strokeRect(x - 8, y - s * 0.55, 16, s);
    return;
  }

  if (item.type === "cave" || item.type === "hole") {
    ctx.fillStyle = "#172033";
    ctx.fillRect(x - s * 0.45, y - s * 0.22, s * 0.9, s * 0.44);
    return;
  }

  if (item.type === "statue") {
    ctx.fillStyle = "#8791b0";
    ctx.fillRect(x - s * 0.18, y - s * 0.42, s * 0.36, s * 0.85);
    ctx.fillStyle = "#172033";
    ctx.fillRect(x - 6, y - s * 0.52, 12, 10);
    ctx.strokeRect(x - s * 0.18, y - s * 0.42, s * 0.36, s * 0.85);
    return;
  }

  ctx.fillStyle = item.type === "lava-rock" ? "#67383a" : "#8b8896";
  ctx.fillRect(x - s * 0.45, y - s * 0.28, s * 0.9, s * 0.56);
  ctx.strokeRect(x - s * 0.45, y - s * 0.28, s * 0.9, s * 0.56);
}

function drawScenery() {
  for (const item of scenery) {
    const x = item.x - camera.x;
    const y = item.y - camera.y;
    if (x < -90 || x > viewWidth() + 90 || y < -90 || y > viewHeight() + 90) {
      continue;
    }

    drawSceneryItem(item, x, y);
  }
}

function drawPerson(person) {
  const x = person.x - camera.x;
  const y = person.y - camera.y + Math.round(Math.sin(person.wiggle) * 2);

  if (x < -60 || x > viewWidth() + 60 || y < -60 || y > viewHeight() + 60) {
    return;
  }

  const hiddenAlpha = person.target || person.found ? 1 : 0.58;
  ctx.globalAlpha = person.found ? 1 : hiddenAlpha;

  if (!person.found && person.target) {
    ctx.globalAlpha = person.name === "Mrs Grove" ? 0.82 : 0.68;
  }

  const px = Math.round(x);
  const py = Math.round(y);
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.fillRect(px - 18, py + 18, 36, 8);

  ctx.fillStyle = person.color;
  ctx.fillRect(px - 13, py - 8, 26, 26);
  ctx.fillRect(px - 9, py + 18, 7, 14);
  ctx.fillRect(px + 3, py + 18, 7, 14);
  ctx.fillStyle = "#f1c59a";
  ctx.fillRect(px - 10, py - 24, 20, 18);
  ctx.fillStyle = "#2a1b14";
  ctx.fillRect(px - 12, py - 28, 24, 8);
  ctx.fillStyle = "#111";
  ctx.fillRect(px - 6, py - 17, 4, 4);
  ctx.fillRect(px + 4, py - 17, 4, 4);

  if (person.found || distance(player, person) < 120 || !person.target) {
    ctx.globalAlpha = 1;
    ctx.fillStyle = person.target ? "#fff3b5" : "#d7ddb8";
    ctx.font = "800 14px \"Courier New\", monospace";
    ctx.textAlign = "center";
    ctx.fillText(person.name, x, y - person.radius - 12);
  }

  ctx.globalAlpha = 1;
}

function drawSniper(x, y) {
  ctx.fillStyle = "#46543d";
  ctx.fillRect(x - 12, y - 22, 24, 20);
  ctx.fillRect(x - 10, y - 2, 20, 28);
  ctx.fillRect(x - 22, y + 18, 12, 18);
  ctx.fillRect(x + 8, y + 18, 12, 18);
  ctx.fillStyle = "#233024";
  ctx.fillRect(x - 16, y - 30, 32, 10);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + 10, y - 12, 50, 8);
  ctx.fillRect(x + 54, y - 17, 10, 18);
  ctx.fillStyle = "#79b4d8";
  ctx.fillRect(x - 4, y - 18, 8, 5);
}

function drawAngryHuman(x, y) {
  ctx.fillStyle = "#f1c59a";
  ctx.fillRect(x - 12, y - 26, 24, 22);
  ctx.fillStyle = "#332014";
  ctx.fillRect(x - 14, y - 31, 28, 8);
  ctx.fillStyle = "#1f3559";
  ctx.fillRect(x - 14, y - 4, 28, 32);
  ctx.fillStyle = "#aa2a2a";
  ctx.fillRect(x - 4, y - 4, 8, 32);
  ctx.fillStyle = "#111";
  ctx.fillRect(x - 7, y - 18, 4, 4);
  ctx.fillRect(x + 5, y - 18, 4, 4);
  ctx.fillRect(x - 8, y - 9, 16, 4);
}

function drawDragon(x, y) {
  ctx.fillStyle = "#e76624";
  ctx.fillRect(x - 22, y - 20, 42, 36);
  ctx.fillRect(x + 18, y - 12, 24, 20);
  ctx.fillRect(x - 28, y + 14, 11, 24);
  ctx.fillRect(x + 3, y + 14, 11, 24);
  ctx.fillStyle = "#f2bb65";
  ctx.fillRect(x - 8, y - 8, 18, 20);
  ctx.fillStyle = "#f09b45";
  ctx.fillRect(x - 44, y - 30, 24, 36);
  ctx.fillStyle = "#fff0c8";
  ctx.fillRect(x + 18, y - 25, 8, 10);
  ctx.fillRect(x + 31, y - 22, 8, 10);
  ctx.fillStyle = "#111";
  ctx.fillRect(x + 31, y - 6, 4, 4);
}

function drawHazards() {
  for (const hazard of hazards) {
    const x = hazard.x - camera.x;
    const y = hazard.y - camera.y;

    if (hazard.type === "sniper") {
      drawSniper(x, y);
      ctx.fillStyle = "#f4e07a";
      for (const bullet of hazard.bullets) {
        ctx.fillRect(bullet.x - camera.x - 4, bullet.y - camera.y - 4, 8, 8);
      }
    }

    if (hazard.type === "storm") {
      ctx.fillStyle = "rgba(219, 189, 120, 0.68)";
      ctx.fillRect(x - hazard.radius, y - hazard.radius * 0.55, hazard.radius * 2, hazard.radius * 1.1);
      ctx.fillStyle = "#f5dc9a";
      ctx.fillRect(x - 44, y - 20, 88, 12);
      ctx.fillRect(x - 30, y + 8, 76, 12);
    }

    if (hazard.type === "lava") {
      ctx.fillStyle = "#421b18";
      ctx.fillRect(x - hazard.radius, y - hazard.radius * 0.65, hazard.radius * 2, hazard.radius * 1.3);
      ctx.fillStyle = "#ff5a1f";
      ctx.fillRect(x - hazard.radius + 10, y - 12, hazard.radius * 2 - 20, 24);
      ctx.fillStyle = "#ffd166";
      ctx.fillRect(x - 16, y - 5, 32, 10);
    }

    if (hazard.type === "human") {
      drawAngryHuman(x, y);
    }

    if (hazard.type === "dragon") {
      drawDragon(x, y);
      for (const fire of hazard.fire) {
        ctx.fillStyle = "#ff5a1f";
        ctx.fillRect(fire.x - camera.x - 10, fire.y - camera.y - 10, 20, 20);
        ctx.fillStyle = "#ffd166";
        ctx.fillRect(fire.x - camera.x - 5, fire.y - camera.y - 5, 10, 10);
      }
    }

    if (hazard.type === "portal") {
      ctx.strokeStyle = "#172033";
      ctx.lineWidth = 8;
      ctx.strokeRect(x - 44, y - 44, 88, 88);
      drawPixelText("?", x, y, 46, "#172033");
    }
  }
}

function drawPickups() {
  for (const pickup of pickups) {
    if (pickup.found) {
      continue;
    }
    const x = pickup.x - camera.x;
    const y = pickup.y - camera.y;
    drawMagicKey(x, y);
    ctx.font = "800 13px \"Courier New\", monospace";
    ctx.textAlign = "center";
    ctx.fillText(pickup.name, x, y - 26);
  }
}

function drawMagicKey(x, y) {
  const dark = "#172033";
  const gold = "#f7c83b";
  const shine = "#fff0a8";

  ctx.fillStyle = dark;
  ctx.fillRect(x - 28, y - 14, 22, 22);
  ctx.fillRect(x - 2, y - 7, 42, 14);
  ctx.fillRect(x + 30, y + 6, 7, 10);
  ctx.fillRect(x + 18, y + 6, 7, 8);

  ctx.fillStyle = gold;
  ctx.fillRect(x - 24, y - 10, 14, 14);
  ctx.fillRect(x - 14, y - 6, 12, 6);
  ctx.fillRect(x - 2, y - 4, 40, 8);
  ctx.fillRect(x + 28, y + 4, 6, 8);
  ctx.fillRect(x + 17, y + 4, 6, 6);

  ctx.fillStyle = dark;
  ctx.fillRect(x - 20, y - 6, 6, 6);
  ctx.fillStyle = shine;
  ctx.fillRect(x - 23, y - 9, 6, 3);
  ctx.fillRect(x + 2, y - 3, 18, 2);
}

function drawPlayer() {
  const x = player.x - camera.x;
  const y = player.y - camera.y;

  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillRect(x - 22, y + 22, 44, 8);
  ctx.fillStyle = "#71c7ff";
  ctx.fillRect(x - 14, y - 7, 28, 28);
  ctx.fillRect(x - 10, y + 21, 8, 14);
  ctx.fillRect(x + 3, y + 21, 8, 14);
  ctx.fillStyle = "#f1c59a";
  ctx.fillRect(x - 11, y - 25, 22, 18);
  ctx.fillStyle = "#12344a";
  ctx.fillRect(x - 13, y - 30, 26, 8);
  ctx.fillStyle = "#10202a";
  ctx.fillRect(x - 6, y - 18, 4, 4);
  ctx.fillRect(x + 5, y - 18, 4, 4);

  ctx.fillStyle = "#f6f1df";
  ctx.font = "800 15px \"Courier New\", monospace";
  ctx.textAlign = "center";
  ctx.fillText("Tim", x, y - 31);
}

function drawMiniMap() {
  if (!gameStarted || !player) {
    return;
  }
  const scale = 0.085;
  const mapWidth = world.width * scale;
  const mapHeight = world.height * scale;
  const x = canvas.width - mapWidth - 18;
  const y = 18;

  ctx.fillStyle = "rgba(14, 20, 10, 0.78)";
  ctx.fillRect(x, y, mapWidth, mapHeight);
  for (const region of mapRegions) {
    ctx.fillStyle = region.fill;
    ctx.beginPath();
    ctx.moveTo(x + region.points[0][0] * scale, y + region.points[0][1] * scale);
    for (let i = 1; i < region.points.length; i += 1) {
      ctx.lineTo(x + region.points[i][0] * scale, y + region.points[i][1] * scale);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = "#f7d66b";
  ctx.strokeRect(x, y, mapWidth, mapHeight);

  ctx.fillStyle = "#71c7ff";
  ctx.beginPath();
  ctx.arc(x + player.x * scale, y + player.y * scale, 4, 0, Math.PI * 2);
  ctx.fill();

  for (const person of people) {
    if (!person.target || person.found) continue;
    ctx.fillStyle = person.name === "Mrs Grove" ? "#ffef6b" : "#f38f6b";
    ctx.fillRect(x + person.x * scale - 2, y + person.y * scale - 2, 4, 4);
  }
}

function drawSelectionMap() {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#101621";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const scale = Math.min(canvas.width / world.width, canvas.height / world.height) * 0.94;
  const offsetX = (canvas.width - world.width * scale) / 2;
  const offsetY = (canvas.height - world.height * scale) / 2;

  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#bfd0ef";
  ctx.fillRect(0, 0, world.width, world.height);
  for (const region of mapRegions) {
    ctx.fillStyle = region.fill;
    ctx.beginPath();
    ctx.moveTo(region.points[0][0], region.points[0][1]);
    for (let i = 1; i < region.points.length; i += 1) {
      ctx.lineTo(region.points[i][0], region.points[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#142033";
    ctx.lineWidth = 8;
    ctx.stroke();
    drawPixelText(region.name, region.text[0], region.text[1], region.name.length > 11 ? 72 : 82);
  }

  for (const item of fixedLandmarks) {
    drawSceneryItem(item, item.x, item.y);
  }
  ctx.restore();

  ctx.fillStyle = "#fff3b5";
  ctx.font = "800 24px \"Courier New\", monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("CLICK A PLACE TO START", canvas.width / 2, canvas.height - 28);
}

function drawMaze() {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#101621";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#38425a";
  const walls = [
    [0, 0, canvas.width, 18],
    [0, canvas.height - 18, canvas.width, 18],
    [0, 0, 18, canvas.height],
    [canvas.width - 18, 0, 18, canvas.height],
    [120, 90, 28, 430],
    [230, 0, 28, 420],
    [340, 210, 28, 430],
    [450, 80, 28, 420],
    [560, 220, 28, 420],
    [670, 0, 28, 430],
    [780, 210, 28, 330],
    [890, 80, 28, 420],
  ];
  for (const wall of walls) {
    ctx.fillRect(...wall);
  }
  ctx.fillStyle = "#9ee493";
  ctx.fillRect(canvas.width - 78, 22, 48, 48);
  ctx.fillStyle = "#71c7ff";
  ctx.fillRect(player.mazeX - 13, player.mazeY - 13, 26, 26);
  drawPixelText("QUESTION-MARK MAZE", canvas.width / 2, 46, 28, "#fff3b5");
  drawPixelText("EXIT", canvas.width - 54, 95, 18, "#fff3b5");
}

function draw() {
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameStarted) {
    drawSelectionMap();
    return;
  }

  if (mazeMode) {
    drawMaze();
    return;
  }

  ctx.save();
  ctx.scale(activePerspective().zoom, activePerspective().zoom);
  drawGround();
  drawScenery();
  drawPickups();
  drawHazards();

  const sortedPeople = [...people].sort((a, b) => a.y - b.y);
  for (const person of sortedPeople) {
    drawPerson(person);
  }
  drawPlayer();
  ctx.restore();
  drawMiniMap();
}

function tick() {
  updatePlayer();
  updateFollowers();
  updateHazards();
  checkFound();
  updateCamera();
  draw();

  if (flashTimer > 0 && !gameWon) {
    flashTimer -= 16;
    if (flashTimer <= 0) {
      message.classList.add("is-hidden");
    }
  }

  requestAnimationFrame(tick);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "F5") {
    event.preventDefault();
    if (!gameStarted) {
      showMessage("Choose a place on the map before changing perspective.", 1200);
      return;
    }
    perspectiveIndex = (perspectiveIndex + 1) % perspectives.length;
    perspectiveName.textContent = activePerspective().name;
    updateCamera();
    showMessage(`Perspective changed to ${activePerspective().name}.`, 1200);
    return;
  }

  keys.add(event.key.toLowerCase());
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

canvas.addEventListener("pointerdown", (event) => {
  if (!gameStarted) {
    const point = selectionPointFromEvent(event);
    const region = regionAt(point);
    if (region) {
      startMission(region);
    } else {
      showMessage("Click inside one of the named places to start.", 1500);
    }
    return;
  }

  mouse.active = true;
  updatePointer(event);
});

canvas.addEventListener("pointermove", updatePointer);
canvas.addEventListener("pointerup", () => {
  mouse.active = false;
});
canvas.addEventListener("pointerleave", () => {
  mouse.active = false;
});

function updatePointer(event) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (((event.clientX - rect.left) / rect.width) * canvas.width) / activePerspective().zoom;
  mouse.y = (((event.clientY - rect.top) / rect.height) * canvas.height) / activePerspective().zoom;
}

function selectionPointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const canvasX = ((event.clientX - rect.left) / rect.width) * canvas.width;
  const canvasY = ((event.clientY - rect.top) / rect.height) * canvas.height;
  const scale = Math.min(canvas.width / world.width, canvas.height / world.height) * 0.94;
  const offsetX = (canvas.width - world.width * scale) / 2;
  const offsetY = (canvas.height - world.height * scale) / 2;

  return {
    x: (canvasX - offsetX) / scale,
    y: (canvasY - offsetY) / scale,
  };
}

restart.addEventListener("click", resetGame);
nextLevel.addEventListener("click", () => startLevel(currentLevelIndex + 1));

startLevel(0);
tick();
