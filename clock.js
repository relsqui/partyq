let intervalClock = null;
let manuallyPaused = false;

function clockRunning() {
  return !!intervalClock;
}

function startClock() {
  setStatus("Running");
  if (intervalClock == null) {
    intervalClock = setInterval(() => { update(); render(); }, 1000);
    manuallyPaused = false;
    render();
  }
}

function stopClock(reason, manual = false) {
  manuallyPaused = manual;
  setStatus(`Paused (${reason})`);
  if (intervalClock != null) {
    clearInterval(intervalClock);
    intervalClock = null;
    render();
  }
}

function checkAutoPause() {
  console.log("Checking queues")
  const emptyQueues = gameState.people.filter(p => p.tasks.length == 0).map(p => p.name);
  if (emptyQueues.length) {
    stopClock(`Empty queues:${emptyQueues.join(", ")}`);
  } else if (!(clockRunning() || emptyQueues.length)) {
    if (manuallyPaused) {
      stopClock("Manual")
    } else {
      startClock();
    }
  }
}

function makeClockButton() {
  if (intervalClock) {
    return qe.button("Pause", () => stopClock("Manual", true));
  } else {
    return qe.button("Start", startClock);
  }
}
