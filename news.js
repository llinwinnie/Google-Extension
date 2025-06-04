document.addEventListener('DOMContentLoaded', function() {
    fetch('https://feeds.bbci.co.uk/news/technology/rss.xml')  // Replace with your API URL
        .then(response => response.json())
        .then(data => {
            // Update the content within the #facts section
            document.querySelector("#news p").textContent = data.title;
            document.querySelector("#news a").href = data.link;
            document.querySelector("#news a").textContent = "Read more";
            document.querySelector("#news p:last-child").textContent = data.description;
        })
        .catch(error => console.error('Error fetching news:', error));
});
