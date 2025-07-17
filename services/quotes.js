$(document).ready(() => {
  console.log('Quotes script loaded');
  console.log('jQuery version:', $.fn.jquery);
  
  // Check if quote widget exists
  if ($('#quoteWidget').length === 0) {
    console.error('Quote widget not found!');
    return;
  }
  
  console.log('Quote widget found, binding events...');
  
  $('#quoteWidget').on('click', function () {
    console.log('Quote widget clicked');
    
    // Show loading state
    $('#quoteText').text('Loading quote...');
    $('#quoteAuthor').text('');
    $('#quoteDisplay').removeClass('collapsed').addClass('show');
    
    fetch('https://api.quotable.io/random')
      .then((res) => {
        console.log('Fetch response:', res);
        if (!res.ok) throw new Error('Quotes fetch error');
        return res.json();
      })
      .then((data) => {
        console.log('Quote data:', data);
        $('#quoteText').text(data.content);
        $('#quoteAuthor').text(`— ${data.author}`);
        $('#quoteDisplay').removeClass('collapsed').addClass('show');
      })
      .catch((err) => {
        console.error('Error fetching quote:', err);
        $('#quoteText').text('Quote unavailable');
        $('#quoteAuthor').text('');
        $('#quoteDisplay').removeClass('collapsed').addClass('show');
      });
  });
  
  // Also bind to the quote header for better UX
  $('.quote-header').on('click', function() {
    $('#quoteWidget').click();
  });
  
  console.log('Quote events bound successfully');
});

