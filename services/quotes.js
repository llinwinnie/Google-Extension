$(document).ready(() => {
  console.log('Quotes script loaded');
  console.log('jQuery version:', $.fn.jquery);
  
  // Check if quote widget exists
  if ($('#quoteWidget').length === 0) {
    console.error('Quote widget not found!');
    return;
  }
  
  console.log('Quote widget found, binding events...');
  
  // Fallback quotes in case API fails
  const fallbackQuotes = [
    { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { content: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { content: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { content: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { content: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { content: "The mind is everything. What you think you become.", author: "Buddha" },
    { content: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" }
  ];
  
  let currentQuoteIndex = 0;
  
  function getRandomQuote() {
    // Try to get a quote from the API first
    return fetch('https://api.quotable.io/random')
      .then((res) => {
        console.log('Fetch response:', res);
        if (!res.ok) throw new Error('Quotes fetch error');
        return res.json();
      })
      .then((data) => {
        console.log('Quote data:', data);
        return {
          content: data.content,
          author: data.author
        };
      })
      .catch((err) => {
        console.error('Error fetching quote:', err);
        // Use fallback quotes if API fails
        const fallbackQuote = fallbackQuotes[currentQuoteIndex % fallbackQuotes.length];
        currentQuoteIndex++;
        return fallbackQuote;
      });
  }
  
  function displayQuote(quote) {
    // Check if elements exist before trying to update them
    const $quoteText = $('#quoteText');
    const $quoteAuthor = $('#quoteAuthor');
    const $quoteDisplay = $('#quoteDisplay');
    
    if ($quoteText.length > 0) {
      $quoteText.text(quote.content);
    }
    
    if ($quoteAuthor.length > 0) {
      $quoteAuthor.text(`— ${quote.author}`);
    }
    
    if ($quoteDisplay.length > 0) {
      $quoteDisplay.removeClass('collapsed').addClass('show');
    }
  }
  
  function handleQuoteClick() {
    console.log('Quote widget clicked');
    
    // Check if elements exist before trying to update them
    const $quoteText = $('#quoteText');
    const $quoteAuthor = $('#quoteAuthor');
    const $quoteDisplay = $('#quoteDisplay');
    
    if ($quoteText.length > 0) {
      $quoteText.text('Loading quote...');
    }
    
    if ($quoteAuthor.length > 0) {
      $quoteAuthor.text('');
    }
    
    if ($quoteDisplay.length > 0) {
      $quoteDisplay.removeClass('collapsed').addClass('show');
    }
    
    // Get and display a new quote
    getRandomQuote()
      .then(displayQuote)
      .catch((err) => {
        console.error('Error in quote generation:', err);
        // Use a fallback quote if everything fails
        const fallbackQuote = fallbackQuotes[currentQuoteIndex % fallbackQuotes.length];
        currentQuoteIndex++;
        displayQuote(fallbackQuote);
      });
  }
  
  // Bind click events to the quote widget - only if it exists
  if ($('#quoteWidget').length > 0) {
    $('#quoteWidget').on('click', handleQuoteClick);
  }
  
  // Also bind to the quote header for better UX - only if it exists
  if ($('.quote-header').length > 0) {
    $('.quote-header').on('click', function(e) {
      e.stopPropagation(); // Prevent double triggering
      handleQuoteClick();
    });
  }
  
  // Bind to the quote display area as well - only if it exists
  if ($('#quoteDisplay').length > 0) {
    $('#quoteDisplay').on('click', function(e) {
      e.stopPropagation(); // Prevent double triggering
      handleQuoteClick();
    });
  }
  
  console.log('Quote events bound successfully');
});

