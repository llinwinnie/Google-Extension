
let bookExpanded = false;

document.getElementById('bookWidget').addEventListener('click', function() {
  if (!bookExpanded) {
    fetchBookAnswer();
    this.classList.add('expanded');
    document.getElementById('bookDisplay').classList.add('show');
    bookExpanded = true;
  }
});

function fetchBookAnswer() {
  const answers = [
    "Yes, and don't worry about it.",
    "The answer is emphatically no.",
    "Look back at your previous mistakes.",
    "Patience will yield success.",
    "Trust your instincts.",
    "Take a detour and see what happens.",
    "Make peace with uncertainty.",
    "You already know the answer within you.",
    "Let go of what no longer serves you.",
    "Your next step is clear—take it."
  ];
  const idx = Math.floor(Math.random() * answers.length);
  document.getElementById('bookText').textContent = `"${answers[idx]}"`;
}
