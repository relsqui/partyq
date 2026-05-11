const gameState = {
  people: [],
  tick: 0,
  status: "Starting",
  log: [""],
};

function addPerson(name) {
  gameState.people.push(makePerson(name))
}

function addLog(s) {
  gameState.log.push(`[${gameState.tick}] ${s}`);
}

function setStatus(s) {
  gameState.status = s;
}

function update() {
  gameState.tick++;
  const updateQueue = [];
  for (const person of gameState.people) {
    updatePerson(person, updateQueue);
  }
  for (const { fn, log } of updateQueue) {
    if (log) addLog(log);
    fn();
  }
  checkAutoPause();
}

function render() {
  const clockBar = wrap("p", gameState.tick, " ", makeClockButton(), " ", gameState.status);
  const logPane = tableWrap(gameState.log.slice(-10).map(l => [l]));
  const peoplePane = tableWrap([gameState.people.map(p => personToTable(p))]);
  const mainView = tableWrap([[peoplePane, logPane]]);
  logPane.children[0].setAttribute("valign", "top");
  peoplePane.children[0].setAttribute("valign", "top");
  mainView.children[0].setAttribute("valign", "top");
  document.body.replaceChildren(clockBar, mainView);
}

function start() {
  const startingPeople = ["Adam", "Eve"];
  startingPeople.map(addPerson);
  startClock();
}
