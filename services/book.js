$(document).ready(() => {
  console.log('Book script loaded');
  
  let bookExpanded = false;

  // Check if book widget exists
  if ($('#bookWidget').length === 0) {
    console.error('Book widget not found!');
    return;
  }

  console.log('Book widget found, binding events...');

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
    $('#bookText').text(answers[idx]);
  }

  function handleBookClick() {
    console.log('Book widget clicked');
    
    if (!bookExpanded) {
      fetchBookAnswer();
      $('#bookWidget').addClass('expanded');
      $('#bookDisplay').addClass('show');
      bookExpanded = true;
    } else {
      // Get a new answer
      fetchBookAnswer();
    }
  }

  // Bind click events to the book widget
  $('#bookWidget').on('click', handleBookClick);
  
  // Also bind to the widget header for better UX
  $('.widget-header').on('click', function(e) {
    e.stopPropagation(); // Prevent double triggering
    handleBookClick();
  });
  
  // Bind to the book display area as well
  $('#bookDisplay').on('click', function(e) {
    e.stopPropagation(); // Prevent double triggering
    handleBookClick();
  });

  console.log('Book events bound successfully');
});
