function makePerson(name, locationKey = "riverbank") {
  return {
    name,
    location: locations[locationKey],
    tasks: [],
    inventory: [],
  };
}

function addTask(person, taskKey, loop) {
  person.tasks.push({ ...getTask(person, taskKey), loop, taskKey });
  checkAutoPause();
  render();
}

function removeTask(person, task) {
  const taskIndex = person.tasks.findIndex(t => t == task);
  if (taskIndex != -1) {
    person.tasks.splice(taskIndex, 1);
  }
  checkAutoPause();
  render();
}

function itemCount(person, item) {
  return person.inventory[item] || 0;
}

function giveItem(person, item, count) {
  person.inventory[item] = Math.max(0, itemCount(person, item) + count);
}

function payCost(person, item, count) {
  if (itemCount(person, item) < count) {
    return false;
  }
  giveItem(person, item, count * -1);
  return true;
}


function payCosts(person, costs = {}) {
  for (const [item, count] of Object.entries(costs)) {
    payCost(person, item, count);
  }
}

function canPayCosts(person, costs = {}, multiple = 1) {
  for (const [item, count] of Object.entries(costs)) {
    if (itemCount(person, item) < count * multiple) {
      return false;
    }
  }
  return true;
}

function updatePerson(person, updateQueue) {
  if (!person.tasks.length) {
    return;
  }
  const currentTask = person.tasks[0];
  currentTask.duration--;
  if (currentTask.duration < 1) {
    updateQueue.push({
      fn: (...args) => {
        if (canStartTask(person, currentTask)) {
          payCosts(person, currentTask.costs);
          currentTask.fn(person, ...args);
        }
      }
    });
    // We haven't paid for the current one yet, we just queued it
    if (currentTask.loop && canStartTask(person, currentTask)) {
      currentTask.duration = tasks[currentTask.taskKey].duration;
    } else {
      person.tasks.splice(0, 1);
    }
  }
}

function personToTable(person) {
  const personTable = createElementWithAttrs("table", {
    border: true,
    cellpadding: 5,
    cellspacing: 0
  });
  const nameCell = createElementWithAttrs("td", { colspan: 3 });
  nameCell.replaceChildren(wrap("h3", person.name), person.location.name);
  const nameRow = createElementWithAttrs("tr", { align: "center" });
  nameRow.replaceChildren(nameCell);
  const invText = Object.entries(person.inventory)
    .filter(([_, count]) => count > 0)
    .map(([item, count]) => count == 1 ? item : `${item} x${count}`)
    .join(", ") || "Empty hands.";
  const invCell = createElementWithAttrs("td", { colspan: 3 });
  invCell.replaceChildren(invText);
  const invRow = wrap("tr", invCell);
  const taskFormCell = createElementWithAttrs("td", { colspan: 3 });
  taskFormCell.replaceChildren(makeTaskForm(person));
  const taskFormRow = createElementWithAttrs("tr", { align: "center" });
  taskFormRow.replaceChildren(taskFormCell);
  const taskRows = person.tasks.map(task => {
    const taskRow = createElementWithAttrs("tr", { align: "right" });
    taskRow.replaceChildren(...[
      task.name + (task.loop ? " (looping)" : ""),
      task.duration,
      qe.button("X", () => removeTask(person, task))
    ].map(s => {
      const cell = createElementWithAttrs("td");
      cell.replaceChildren(s);
      return cell;
    }))
    return taskRow;
  });
  personTable.replaceChildren(nameRow, invRow, taskFormRow, ...taskRows);
  return personTable;
}

function makePartyButtons() {
  // Not counting the first one you can't remove
  const partySize = gameState.people.length - 1;
  const maxPartySize = settings.partyNames.length;
  const addButton = qe.button("+1", () => {
    addPerson(settings.partyNames[partySize]);
    render();
  }, partySize >= maxPartySize);
  const removeButton = qe.button("-1", () => {
    gameState.people.pop();
    render();
  }, partySize < 1);
  return wrap("p", addButton, qe.br(), removeButton);
}
