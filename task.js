const gatherTasks = {
  get_grass: {
    name: "Gather grass",
    duration: 10,
    fn: (person) => {
      addLog(`${person.name} gathered some grass.`);
      giveItem(person, "grass", 1);
    },
  },
  get_sticks: {
    name: "Pick up sticks",
    duration: 5,
    fn: (person) => {
      addLog(`${person.name} found some sticks.`);
      giveItem(person, "stick", 1);
    },
  },
};

const otherTasks = {
  explore: {
    name: "Explore",
    duration: 30,
    prereqs: (person) => {
      return getExplorableLocations(person).length > 0;
    },
    fn: (person) => {
      if (Math.random() < 0.25) {
        const newLocKey = arrayRand(getExplorableLocations(person));
        locations[newLocKey].explored = true;
        addLog(`${person.name} discovers ${locations[newLocKey].name}!`);
      } else {
        addLog(`${person.name} wanders for a while without finding anything new.`);
      }
    },
  },
  spin_twine: {
    name: "Spin twine",
    duration: 20,
    costs: { grass: 5 },
    fn: (person) => {
      addLog(`${person.name} twists some grass into twine.`);
      giveItem(person, "twine", 1);
    },
  },
};

const tasks = {
  ...gatherTasks,
  ...otherTasks,
}

function canStartTask(person, task) {
  const prereqs = task.prereqs || (() => true);
  return canPayCosts(person, task.costs) && prereqs(person);
}

function getTask(person, taskKey) {
  if (tasks[taskKey]) return tasks[taskKey];
  const [dynamicTask, ...args] = taskKey.split(":");
  const dynamicTaskFns = {
    travel: makeTravelTask,
  };
  const taskFn = dynamicTaskFns[dynamicTask];
  return taskFn ? taskFn(person, ...args) : undefined;
}

function makeTaskForm(person) {
  const localGathers = person.location.gatherTasks.reduce((options, taskKey) => {
    options[taskKey] = tasks[taskKey]
    return options
  }, {});
  const travelTasks = getTravelDestinations(person).reduce((tasksByDest, dest) => {
    // there is for sure a more elegant way to do this,
    // right now we're creating the task once here and then again at call time
    tasksByDest[`travel:${dest}`] = makeTravelTask(person, dest);
    return tasksByDest;
  }, {});
  const taskOptions = Object.entries(localGathers)
    .concat(Object.entries(otherTasks))
    .concat(Object.entries(travelTasks))
    .filter(([_, task]) => canStartTask(person, task))
    .map(([key, task]) => {
      const taskOpt = createElementWithAttrs("option", { value: key });
      taskOpt.replaceChildren(task.name);
      return taskOpt;
    });
  if (taskOptions.length == 0) {
    return wrap("div", "No tasks available.");
  }
  const taskForm = createElementWithAttrs("div");
  const taskSelect = createElementWithAttrs("select");
  taskSelect.replaceChildren(...taskOptions);
  const onceButton = qe.button("Once", () => addTask(person, taskSelect.selectedOptions[0].value, false));
  const loopButton = qe.button("Loop", () => addTask(person, taskSelect.selectedOptions[0].value, true));
  taskForm.replaceChildren(taskSelect, " ", onceButton, " ", loopButton);
  return taskForm;
}
