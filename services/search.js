document.getElementById('searchBox').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    const query = this.value.trim();
    if (query) {
      if (query.includes('.') && !query.includes(' ')) {
        window.open(`https://${query}`, '_blank');
      } else {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      }
    }
  }
});
