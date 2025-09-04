//libraries
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');     

const app = express();
app.use(cors());//Allows frontend to request data from backend 
const KEY = process.env.TMDB_API_KEY;

app.use(express.json());//Tells express to handle json 

app.get('/discover', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      params: { api_key: KEY }
    });
    res.json(data);
  } catch (err) {
    console.error(err); //log the error
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/search', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: { api_key: KEY, query: req.query.query }
    });

  const filtered = (data.results || []) .filter(m => (m.vote_count || 0) >= 200)
  .sort((a, b) => b.popularity - a.popularity); 
  res.json({ results: filtered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.listen(3000)
  .on('listening', () => console.log('Server running at http://localhost:3000'))
  .on('error', (err) => console.error('Listen error:', err));

  app.get('/pair', async (req, res) => {
    try {
      const type = req.query.type === 'movie' ? 'movie' : 'tv';

      const GENRE_MAP = {
      movie: {
        Action: 28, Comedy: 35, Drama: 18, Thriller: 53, Animation: 16,
        Horror: 27, Documentary: 99, Western: 37, War: 10752, Romance: 10749,
        SciFi: 878, Crime: 80, Adventure: 12,
      },
      tv: {
        Action: 10759, // Action & Adventure
        Comedy: 35, Drama: 18,
        Thriller: 9648, // closest: Mystery
        Animation: 16, Documentary: 99, Western: 37,
        SciFi: 10765, Crime: 80,
      }
    };

    const params = {
      api_key: KEY,
      language: 'en-US',
      include_adult: false,
      sort_by: 'popularity.desc',
      'vote_count.gte': 750,
      page: 1
    };

      if(req.query.genre){
        const names = Array.isArray(req.query.genre) ? req.query.genre : [req.query.genre];
        const ids= [];
      for(const raw of names){
        const name = String(raw).trim();
        const id = GENRE_MAP[type][name];
        if(id){
          ids.push(id);
        }
      }
      if(ids.length){
          params.with_genres = ids.join(',');
        }
    }
      const { data: firstPage } = await axios.get(`https://api.themoviedb.org/3/discover/${type}`, { params });

      let totalPages = Math.min(firstPage?.total_pages || 0, 500);
      if(totalPages < 1){
        return res.status(400).json({error: 'no matches'});
      }
      const randomPage = Math.floor(Math.random() * totalPages) + 1;
      const { data } = await axios.get(`https://api.themoviedb.org/3/discover/${type}`, {
        params: { ...params, page: randomPage } });

      const results = Array.isArray(data?.results) ? data.results : [];
      if(results.length < 2){
        return res.status(400).json({error: 'Not enough results'});
      }
      const n = results.length;
      const i = Math.floor(Math.random() * n);
      let j = Math.floor(Math.random() * n);
      while(j === i){
        j = Math.floor(Math.random() * n);
      }
      return res.json({ a: results[i], b: results[j] });
    } catch(err) {
      console.error(err);
      res.status(500).json({error: 'fetch failed'});
    }
  });