const locations = {
  riverbank: {
    name: "River bank",
    explored: true,
    neighbors: ["plains"],
    gatherTasks: [],
  },
  plains: {
    name: "Plains",
    neighbors: ["riverbank", "forest"],
    gatherTasks: ["get_grass"],
  },
  forest: {
    name: "Forest",
    neighbors: ["plains"],
    gatherTasks: ["get_sticks"],
  },
} 

function getExplorableLocations(person) {
  return person.location.neighbors.filter((key) => !locations[key].explored);
}

function getTravelDestinations(person) {
  return person.location.neighbors.filter((key) => locations[key].explored);
}

function makeTravelTask(person, destinationKey) {
  const destination = locations[destinationKey];
  return {
    name: `Go to ${destination.name}`,
    duration: 60,
    fn: (person) => {
      person.location = locations[destinationKey];
      addLog(`${person.name} arrived at ${destination.name}.`);
    },
  };
}
