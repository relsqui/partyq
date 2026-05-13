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
    gatherTasks: ["gather_grass"],
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
