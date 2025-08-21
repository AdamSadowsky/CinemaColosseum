require('dotenv').config();
console.log('Booting server.js...');
const express = require('express');
const axios = require('axios');

const app = express();
const KEY = process.env.TMDB_API_KEY;

app.use(express.json()); // <--- tells Express to handle JSON

app.get('/discover', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      params: { api_key: KEY }
    });
    res.json(data);
  } catch (err) {
    console.error(err); // log the error
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/search', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: { api_key: KEY, query: req.query.query }
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.listen(3000)
  .on('listening', () => console.log('Server running at http://localhost:3000'))
  .on('error', (err) => console.error('Listen error:', err));