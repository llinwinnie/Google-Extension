$(document).ready(() => {
    // Add an event listener to the quote button
    $('#quoteButton').on('click', () => {
        // Fetch a new random quote from the API
        fetch("https://api.quotable.io/random")
            .then(result => result.json())
            .then(q => {
                // Update the content of the <p> element with the fetched quote
                const quoteDisplay = document.querySelector("#quotes p");
                quoteDisplay.textContent = q.content;

                // Hide the Quotes button after displaying the quote
                $('#quoteButton').hide();

                // Make the quote itself clickable to fetch a new one
                $(quoteDisplay).on('click', () => {
                    fetch("https://api.quotable.io/random")
                        .then(result => result.json())
                        .then(newQ => {
                            quoteDisplay.textContent = newQ.content;
                        })
                        .catch(error => {
                            console.error('Error fetching quote:', error);
                            quoteDisplay.textContent = "Could not fetch a quote at this time.";
                        });
                });
            })
            .catch(error => {
                console.error('Error fetching quote:', error);
                document.querySelector("#quotes p").textContent = "Could not fetch a quote at this time.";
            });
    });
});



// $(document).ready(() => {
//     fetch("https://api.quotable.io/random")
//         .then(result => result.json())
//         .then(q => {
//             document.querySelector("#quotes p").textContent = q.content;
//         })
// })
