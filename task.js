const tasks = {
  get_sticks: {
    name: "Pick up sticks",
    duration: 5,
    fn: (person) => {
      addLog(`${person.name} found some sticks.`);
      giveItem(person, "stick", 1);
    },
  },
  get_grass: {
    name: "Gather grass",
    duration: 10,
    fn: (person) => {
      addLog(`${person.name} gathered some grass.`);
      giveItem(person, "grass", 1);
    },
  }
};

function makeTaskForm(person) {
  const taskForm = createElementWithAttrs("div");
  const taskSelect = createElementWithAttrs("select");
  const taskOptions = Object.entries(tasks).map(([key, task]) => {
    const taskOpt = createElementWithAttrs("option", { value: key });
    taskOpt.replaceChildren(task.name);
    return taskOpt;
  })
  taskSelect.replaceChildren(...taskOptions);
  const onceButton = qe.button("Once", () => addTask(person, taskSelect.selectedOptions[0].value, false));
  const loopButton = qe.button("Loop", () => addTask(person, taskSelect.selectedOptions[0].value, true));
  taskForm.replaceChildren(taskSelect, " ", onceButton, " ", loopButton);
  return taskForm;
}
