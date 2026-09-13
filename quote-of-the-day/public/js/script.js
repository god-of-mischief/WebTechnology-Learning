// // public/js/script.js

async function fetchQuote(author = '') {
    try {
        // Build the query string with or without the author
        const response = await fetch(`/api/quote${author ? `?author=${encodeURIComponent(author)}` : ''}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
      
        // Debugging: Log the data to ensure the structure is correct
        console.log('Fetched data:', data);


        // Ensure quote and author exist before trying to display them
        if (data && data.quote && data.author) {
            document.getElementById('quote').textContent = data.quote;
            document.getElementById('author').textContent = `– ${data.author}`;
        } else {
            // Handle cases where no quote is found
            document.getElementById('quote').textContent = 'No quote found';
            document.getElementById('author').textContent = '';
        }
    } catch (error) {
        // Handle any errors that occur during the fetch operation
        document.getElementById('quote').textContent = 'Could not fetch quote';
        document.getElementById('author').textContent = '';
        console.error('Error:', error);
    }
}

// Fetch a random quote when the page loads
window.onload = () => {
    fetchQuote();
};

// Search for a quote by author when the search button is clicked
document.getElementById('search-btn').addEventListener('click', () => {
    const author = document.getElementById('author-input').value.trim();
    if (author) {
        fetchQuote(author);
    } else {
        document.getElementById('quote').textContent = 'Please enter an author name';
        document.getElementById('author').textContent = '';
    }
});

// Fetch a new random quote when the random quote button is clicked
document.getElementById('new-quote-btn').addEventListener('click', () => {
    fetchQuote(); // Fetch a random quote
});