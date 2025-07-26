let countdown;
let timeLeftGlobal = 0;
let isPaused = false;
let isRunning = false;
let isWorkSession = true;

function togglePomodoro() {
  const button = document.getElementById("startPauseBtn");

  if (!isRunning) {
    // First start or resume
    if (timeLeftGlobal <= 0) {
      // Fresh start
      const workTime = parseInt(document.getElementById("workMinutes").value) * 60;
      const breakTime = parseInt(document.getElementById("breakMinutes").value) * 60;

      if (isNaN(workTime) || isNaN(breakTime) || workTime <= 0 || breakTime <= 0) {
        alert("Please enter valid minutes for both work and break.");
        return;
      }
      
      isPaused = false;
      isRunning = true;
      button.textContent = "Pause";
      startTimer(workTime, breakTime, true);
    } else {
      // Resuming
      isPaused = false;
      isRunning = true;
      button.textContent = "Pause";
      startTimer(timeLeftGlobal, 0, isWorkSession);
    }
  } else {
    // Pausing
    clearInterval(countdown);
    isPaused = true;
    isRunning = false;
    updateStatus("Paused");
    button.textContent = "Resume";
  }
}

function startTimer(timeLeft, nextTime, isWorking) {
  isWorkSession = isWorking;
  updateStatus(isWorking ? "Work Time!" : "Break Time!");

  countdown = setInterval(() => {
    if (!isPaused) {
      updateDisplay(timeLeft);
      timeLeftGlobal = timeLeft;

      if (timeLeft === 1) {
        const audio = document.getElementById("PomoVibeNotif");
        audio.currentTime = 0;
        audio.play().catch(err => console.warn("Audio play failed:", err));
      }

      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(countdown);
        isPaused = false;
        isRunning = true;
        document.getElementById("startPauseBtn").textContent = "Pause";

        if (isWorking) {
          startTimer(nextTime, timeLeft + nextTime, false);
        } else {
          const workTime = parseInt(document.getElementById("workMinutes").value) * 60;
          const breakTime = parseInt(document.getElementById("breakMinutes").value) * 60;
          startTimer(workTime, breakTime, true);
        }
      }
    }
  }, 1000);
}

function updateDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById("timer").textContent =
    `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateStatus(text) {
  document.getElementById("status").textContent = text;
}
