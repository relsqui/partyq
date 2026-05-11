function makePerson(name) {
  return {
    name,
    tasks: []
  };
}

function addTask(person, taskKey, loop) {
  person.tasks.push({ ...tasks[taskKey], loop, taskKey });
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

function updatePerson(person, updateQueue) {
  if (!person.tasks.length) {
    return;
  }
  const currentTask = person.tasks[0];
  currentTask.duration--;
  if (currentTask.duration < 1) {
    updateQueue.push({ fn: () => currentTask.fn(person) });
    if (currentTask.loop) {
      currentTask.duration = tasks[currentTask.taskKey].duration;
    } else {
      person.tasks.pop();
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
  nameCell.replaceChildren(person.name);
  const nameRow = createElementWithAttrs("tr", { align: "center" });
  nameRow.replaceChildren(nameCell);
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
  })
  personTable.replaceChildren(nameRow, taskFormRow, ...taskRows);
  return personTable;
}
