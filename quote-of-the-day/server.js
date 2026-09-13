// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = 3000;

// Serve static files from the 'public' folder
app.use(express.static('public'));

app.use(cors());

// API route to get a quote of the day

const API_KEY = 'oMskAqbEY/26SMo+kB9Lhg==ycogNj0pRqcUXdOp';
app.get('/api/quote', async (req, res) => {
  const author = req.query.author;
  try {
    const apiUrl = author 
    ? `https://api.api-ninjas.com/v1/quotes?author=${encodeURIComponent(author)}` 
    : 'https://api.api-ninjas.com/v1/quotes';

    const response = await axios.get(apiUrl,{
        headers: { 'X-Api-Key': API_KEY }
    });

    if (response.data && response.data.length > 0) {
      res.json(response.data[0]); // Send the first quote from the response
    } else {
        throw new Error('No quotes found');
    }
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    res.status(500).send('Error fetching quote');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
