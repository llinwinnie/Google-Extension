$(document).ready(() => {
  let startTime = null;
  let elapsed = 0;
  let timerInterval = null;

  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
    const s = String(totalSec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function updateTimer() {
    const now = Date.now();
    elapsed = now - startTime;
    $("#timerDisplay").text(formatTime(elapsed));
  }

  $("#startTimer").on("click", () => {
    if (!timerInterval) {
      startTime = Date.now() - elapsed;
      timerInterval = setInterval(updateTimer, 1000);
    }
  });

  $("#stopTimer").on("click", () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  });

  $("#resetTimer").on("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsed = 0;
    $("#timerDisplay").text("00:00:00");
  });
});
