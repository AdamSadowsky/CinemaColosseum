//libraries
require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');
axios.defaults.timeout = 8000;
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const isProd = process.env.NODE_ENV === "production";
const helmet = require("helmet");
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "10kb" }));
app.use((req, res, next) => {
  if (req.url.length > 2048) return res.status(414).send("URI Too Long");
  next();
});

app.use((req, res, next) => {
  const host = (req.headers.host || "").toLowerCase();

  // only redirect the real www host (avoid breaking railway/internal hosts)
  if (host === "www.cinemacolosseum.com") {
    return res.redirect(301, "https://cinemacolosseum.com" + req.originalUrl);
  }

  next();
});

app.get(["/index", "/index.html"], (req, res) => res.redirect(301, "/"));
app.get("/discover.html", (req, res) => res.redirect(301, "/discover"));
app.get("/leaderboards.html", (req, res) => res.redirect(301, "/leaderboards"));
app.get("/about-us.html", (req, res) => res.redirect(301, "/about-us"));
app.get("/privacy-policy.html", (req, res) => res.redirect(301, "/privacy-policy"));
app.get("/terms.html", (req, res) => res.redirect(301, "/terms"));
app.get("/cinema-info.html", (req, res) => res.redirect(301, "/cinema-info"));

app.use(express.static("public", {
  extensions: ["html"],   // /about-us -> /about-us.html
  index: ["index.html"]   // / -> /index.html
}));

const keysFromReq = (req) => {
  const sid = req.signedCookies?.sid;
  if (typeof sid === "string" && sid.length) return sid;
  return ipKeyGenerator(req.ip, 56);
};

app.set("trust proxy", 1);


app.use(cookieParser(process.env.COOKIE_SECRET));
const KEY = process.env.TMDB_API_KEY;
const SID_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

app.use((req, res, next) => {
  let sid = req.signedCookies?.sid;
  if(!sid) {
    sid = crypto.randomUUID()
    res.cookie("sid", sid, { httpOnly: true, sameSite: "Lax", signed: true, maxAge: SID_MAX_AGE, secure: isProd, path: '/' });
  }
  req.sid = sid;
  next();
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVER_ROLE_KEY,
  {auth: {persistSession: false}}
);


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 min window
  limit: 600,                 // 600 requests per 15 min per IP
  keyGenerator: keysFromReq,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
app.use(globalLimiter);

const pairLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 min window
  limit: 30,                 // 25 requests per 1 min per IP
  keyGenerator: keysFromReq,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const voteLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 min window
  limit: 30,                 // 25 requests per 1 min per IP
  keyGenerator: keysFromReq,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const leaderboardLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 min window
  limit: 30,                 // 10 requests per 1 min per IP
  keyGenerator: keysFromReq,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const discoverLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 min window
  limit: 15,                 // 15 requests per 1 min per IP
  keyGenerator: keysFromReq,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const detailsLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 min window
  limit: 15,                 // 15 requests per 1 min per IP
  keyGenerator: keysFromReq,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 1 min window
  limit: 15,                 // 15 requests per 1 min per IP
  keyGenerator: keysFromReq,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const ratingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 1 min window
  limit: 15,                 // 15 requests per 1 min per IP
  keyGenerator: keysFromReq,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});


app.get('/api/discover', discoverLimiter, async (req, res) => {
  try {
    const type = req.query.type === 'movie' ? 'movie' : 'tv'; 
    const popLabel = 'discover'
    const genresKey = 'na'
    let cache_key = `${type}|pop=${popLabel}|genres=${genresKey}|page=${1}`;
    const nowIso = new Date().toISOString();

    const { data: cached, error: cacheReadError } = await supabase
        .from('cinema_cache')
        .select('results')
        .eq('cache_key', cache_key)
        .gt('expires_at', nowIso)
        .maybeSingle();

        if(cacheReadError) {
            console.error('cache read error', cacheReadError);
        }

        const cache_expires_at = new Date(Date.now() + 1440 * 60 * 1000).toISOString(); // 24 hours
        let pageResults = Array.isArray(cached?.results) ? cached.results : [];

        if(!pageResults || pageResults.length < 1) {
          const params = {
            api_key: KEY,
            language: 'en-US',
            include_adult: false,
            sort_by: 'popularity.desc',
            page: 1
          };
            const { data: firstPage } = await axios.get(`https://api.themoviedb.org/3/discover/${type}`, { params });

            pageResults = Array.isArray(firstPage?.results) ? firstPage.results : [];
            const { error: cacheWriteError } = await supabase
            .from('cinema_cache')
            .upsert({
            cache_key,
            type,
            popularity: popLabel,
            genres: genresKey,
            page: 1,
            total_pages: 1,
            results: pageResults,
            expires_at: cache_expires_at
            }, { onConflict: 'cache_key'});

            if(cacheWriteError) {
            console.error('cache write error', cacheWriteError);
            }
        }
        return res.json({ results: pageResults });
  } catch(error) {
    console.error(error);
    return res.status(500).json({ error: 'discover failed' });
  }
});

app.get('/api/search', searchLimiter, async (req, res) => {
  try {
    const { data } = await axios.get('https://api.themoviedb.org/3/search/multi', {
      params: { api_key: KEY, query: req.query.query }
    });

    const filtered = (data.results || []) .filter(m => (m.vote_count || 0) >= 200)
    .sort((a, b) => b.popularity - a.popularity); 
    return res.json({ results: filtered });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Search failed' });
  }
});

  app.get('/pair', pairLimiter, async (req, res) => {
    try {
      const type = req.query.type === 'movie' ? 'movie' : 'tv'; 
      const popularity = req.query.popularity;
      let championId = req.query.champion_id;
      championId = (championId === null || championId === undefined || championId === '') ? null : Number(championId);
      if(championId !== null && !Number.isInteger(championId)) {
        championId = null;
      }

      const excludeRaw = typeof req.query.exclude === "string" ? req.query.exclude : "";
      if (excludeRaw.length > 2000) {
        return res.status(400).json({ error: "exclude too long" });
      }

      const used = new Set(
        excludeRaw
        .split(',')
        .slice(0, 200)
        .filter(Boolean)
        .map(x => Number(x))
        .filter(Number.isInteger)
      );

      const POPULARITY_MAP = {
        movie: {
          Beginner: 9000, Intermediate: 6000, 'Cinema Critic': 3000, 'Cinema Connoisseur': 1500, 'Gladiator': 500
        },
        tv: {
          Beginner: 3000, Intermediate: 2000, 'Cinema Critic': 1500, 'Cinema Connoisseur': 1000, 'Gladiator': 250
        }
      };

      const GENRE_MAP = {
      movie: {
        Action: 28, Comedy: 35, Drama: 18, Thriller: 53, Anime: 16,
        Horror: 27, Documentary: 99, 
        SciFi: 878
      },
      tv: {
        Action: 10759, // Action & Adventure
        Comedy: 35, Drama: 18,
        Thriller: 9648, // closest: Mystery
        Anime: 16, Documentary: 99,
        SciFi: 10765, Horror: 80
      }
    };

    const params = {
      api_key: KEY,
      language: 'en-US',
      include_adult: false,
      sort_by: 'popularity.desc',
      'vote_count.gte': POPULARITY_MAP[type][popularity] ?? POPULARITY_MAP[type].Beginner,
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
        ids.sort((a, b) => a-b);
          params.with_genres = ids.join('|');
        }
    }

    const genresKey = String(params.with_genres || '');
    const popLabel = POPULARITY_MAP[type][popularity] ? popularity : 'Beginner';

    let champion = null;
    if(championId !== null) {
      const { data: champData } = await axios.get(`https://api.themoviedb.org/3/${type}/${championId}`, { 
        params: {api_key: KEY, language: 'en-US'}
      });
      champion = champData;
      used.add(championId);
    }
    
    let cache_key = `${type}|pop=${popLabel}|genres=${genresKey}|page=${1}`;
    const nowIso = new Date().toISOString();

    const { data: cached, error: cacheReadError } = await supabase
        .from('cinema_cache')
        .select('total_pages')
        .eq('cache_key', cache_key)
        .gt('expires_at', nowIso)
        .maybeSingle();

        if(cacheReadError) {
          console.error('cache read error', cacheReadError);
        }

        let pageResults = [];
        let totalPages;
        const cache_expires_at = new Date(Date.now() + 1440 * 60 * 1000).toISOString(); // 24 hours

        if(cached) {
          totalPages = Math.min(cached.total_pages || 0, 500);
          if (totalPages < 1) return res.status(400).json({ error: 'no matches' });
        } else {
          const { data: firstPage } = await axios.get(`https://api.themoviedb.org/3/discover/${type}`, { params });
          totalPages = Math.min(firstPage?.total_pages || 0, 500);
          if(totalPages < 1){
            return res.status(400).json({error: 'no matches'});
          }

          pageResults = Array.isArray(firstPage?.results) ? firstPage.results : [];
          const { error: cacheWriteError } = await supabase
          .from('cinema_cache')
          .upsert({
            cache_key,
            type,
            popularity: popLabel,
            genres: genresKey,
            page: 1,
            total_pages: totalPages,
            results: pageResults,
            expires_at: cache_expires_at
          }, { onConflict: 'cache_key'});

          if(cacheWriteError) {
          console.error('cache write error', cacheWriteError);
          }
        }
      
      for(let tries = 0; tries < 3; tries++) {
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        cache_key = `${type}|pop=${popLabel}|genres=${genresKey}|page=${randomPage}`;
        const { data: cached, error: cacheReadError } = await supabase
        .from('cinema_cache')
        .select('results')
        .eq('cache_key', cache_key)
        .gt('expires_at', nowIso)
        .maybeSingle();

        if(cacheReadError) {
          console.error('cache read error', cacheReadError);
        }

        pageResults = [];
        
        if(cached) {
          pageResults = Array.isArray(cached.results) ? cached.results : [];
        } else {
          const { data } = await axios.get(`https://api.themoviedb.org/3/discover/${type}`, {
            params: { ...params, page: randomPage } });

          pageResults = Array.isArray(data?.results) ? data.results : [];
          if(pageResults.length <= 1) {
            continue;
          }
          const { error: cacheWriteError } = await supabase
          .from('cinema_cache')
          .upsert({
            cache_key,
            type,
            popularity: popLabel,
            genres: genresKey,
            page: randomPage,
            total_pages: totalPages,
            results: pageResults,
            expires_at: cache_expires_at
          }, { onConflict: 'cache_key'});

          if(cacheWriteError) {
          console.error('cache write error', cacheWriteError);
          }
        }

        const pool = pageResults.filter(m => m && !used.has(m.id));
        let pair_expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

        if(championId !== null) {
          const kValue = 0;
          if(pool.length < 1) {
            continue;
          }
          const a = champion;
          const b = pool[Math.floor(Math.random() * pool.length)];
          const pair_id = crypto.randomUUID();
          const { error } = await supabase.from("pair_tokens").insert({
          pair_id,
          type,
          a_id: a.id,
          b_id: b.id,
          session_id: req.sid,
          expires_at: pair_expires_at, 
          used: false,
          k: kValue
        });

        if(error) {
          return res.status(500).json({ error: 'pair token insertion failed' });
        }

        return res.json({ pair_id, a, b });
        } else {
          if(pool.length < 2) {
            continue;
          } 
          const n = pool.length;
          const i = Math.floor(Math.random() * n);
          let j = Math.floor(Math.random() * n);
          while(j === i){
            j = Math.floor(Math.random() * n);
          }

          const a = pool[i];
          const b = pool[j];
          const pair_id = crypto.randomUUID();
          const { error } = await supabase.from("pair_tokens").insert({
            pair_id,
            type,
            a_id: a.id,
            b_id: b.id,
            session_id: req.sid,
            expires_at: pair_expires_at, 
            used: false,
            k: 128
          });

          if(error) {
            return res.status(500).json({ error: 'pair token insertion failed' });
          }

          return res.json({ pair_id, a, b });
        }
      }
      return res.status(400).json({ error: 'Not enough unique results' });
      } catch(err) {
        console.error(err);
        return res.status(500).json({error: 'fetch failed'});
      }
  });

  app.post('/vote', voteLimiter, async (req, res) => {
    try {
      const pair_id = req.body.pair_id;
      const winner_id = Number(req.body.winner_id);

    if (typeof pair_id !== 'string' || !pair_id.length) {
      return res.status(400).json({ error: "pair_id is required" });
    }
    if (!Number.isInteger(winner_id)) {
      return res.status(400).json({ error: "winner_id must be an integer" });
    }

    const nowIso = new Date().toISOString();

    const { data: token, error: tokenErr } = await supabase
      .from('pair_tokens')
      .update({ used: true })
      .eq('pair_id', pair_id)
      .eq('session_id', req.sid)
      .eq('used', false)
      .gt('expires_at', nowIso)
      .or(`a_id.eq.${winner_id},b_id.eq.${winner_id}`)
      .select('type, a_id, b_id, k')
      .maybeSingle();

    if (tokenErr) return res.status(500).json({ error: 'token error' });
    if (!token) return res.status(400).json({ error: "Invalid pair_id" });

    const type = token.type;
    const a_id = token.a_id;
    const b_id = token.b_id;
    const kValue = token.k;

    if (winner_id !== a_id && winner_id !== b_id) {
      return res.status(400).json({ error: "winner_id must match a_id or b_id from token" });
    }

      const { data, error} = await supabase.rpc('elo_update', {
        p_type: type,
        p_a_id: a_id,
        p_b_id: b_id,
        p_winner_id: winner_id,
        p_k: kValue
      });

      if(error){
        return res.status(400).json({ error: "elo update failed"});
      }

      const row = Array.isArray(data) ? data[0] : data;
      return res.json(row);
    } catch (err){
      return res.status(500).json({ error: "server error"});
    }
  });

  app.get('/details', detailsLimiter, async (req, res) => {
    try {
      const type = req.query.type === 'movie' ? 'movie' : 'tv';
      const id = req.query.id;

      const key = `${type}|${id}`;
      const nowIso = new Date().toISOString();

      const { data: cache, error: cacheReadError } = await supabase
        .from('cinema_titles_cache')
        .select('results')
        .eq('type', type)
        .eq('tmdb_id', id)
        .gt('expires_at', nowIso)
        .maybeSingle();

        if(cacheReadError) {
          console.error(cacheReadError);
        }

        let cinemaData;

        if(cache) {
          cinemaData = cache.results; 
        } 

        if(!cinemaData) {
          const { data } = await axios.get(`https://api.themoviedb.org/3/${type}/${id}`, {
            params: { api_key: KEY, language: 'en-US' }
          });

          cinemaData = data;
          const cache_expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

          const { error: cacheWriteError } = await supabase
          .from('cinema_titles_cache')
          .upsert({
            type,
            tmdb_id: id,
            results: cinemaData,
            expires_at: cache_expires_at,
          }, { onConflict: 'type,tmdb_id'});

          if(cacheWriteError) {
            console.error('cache write error', cacheWriteError);
          }
        }
        return res.json({ cinemaData });
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'failed'});
    }
  });

  app.get('/rating', ratingLimiter, async (req, res) => {
    try {
      const type = req.query.type === 'movie' ? 'movie' : 'tv';
      const id = Number(req.query.id);

      if(!Number.isInteger(id)) {
        return res.status(400).json({ error: 'ID must be an integer'});
      }
      const { data, error } = await supabase.rpc('get_rating', {
        p_type: type,
        p_tmdb_id: id,
      });

      if(error) {
        console.error('get_rating rpc error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        return res.status(500).json({ erorr: 'get rating failed'});
      }
      return res.json(data[0]);
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'failed'});
    }
  });

  let leaderboardCache = { expiresAt: 0, payload: null};

  app.get('/leaderboard', leaderboardLimiter, async (req, res) => {
    try {
      const type = req.query.type === 'movie' ? 'movie' : 'tv';
      const nowIso = new Date().toISOString();
      const now = Date.now();
      if(leaderboardCache.payload && now < leaderboardCache.expiresAt && leaderboardCache.payload.type === type) {
        return res.json(leaderboardCache.payload.data);
      }
      const { data: ratings, error} = await supabase
      .from('ratings')
      .select('tmdb_id, rating, wins, losses')
      .eq('type', type)
      .order('rating', { ascending: false })
      .limit(100);

      if(error) {
        return res.status(500).json({ error: 'ratings error'});
      }

      const ids = ratings.map(r => r.tmdb_id);

      const { data: cachedRows, error: err} = await supabase
      .from('cinema_titles_cache')
      .select('tmdb_id, results')
      .eq('type', type)
      .in('tmdb_id', ids)
      .gt('expires_at', nowIso)

      if(err) {
        return res.status(500).json({ error: 'cache error' });
      }

      const cacheMap = new Map((cachedRows || []).map(row => [row.tmdb_id, row.results]));

      const missing = ids.filter(id => !cacheMap.has(id));

      if(missing.length) {
        const cache_expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
       for(const id of missing.slice(0, 25)) {
          try {
            const details = await getTitleWithDedupe(type, id);

            const { error: err} = await supabase
            .from('cinema_titles_cache')
            .upsert({
              type,
              tmdb_id: id,
              results: details,
              expires_at: cache_expires_at
            },
              { onConflict: 'type,tmdb_id' }
            );

            if(err) {
              console.error(err);
            }

            cacheMap.set(id, details);
          } catch(err) {
            console.error(err);
          }
        }
      }

      const cinema = ratings.map(r => {
        const d = cacheMap.get(r.tmdb_id) || null;
        const raw = d?.release_date || d?.first_air_date;
        const year = raw ? raw.slice(0, 4) : '-';

        return {
          tmdb_id: r.tmdb_id,
          rating: r.rating,
          wins: r.wins,
          losses: r.losses,
          title: d?.title || d?.name || '-',
          poster_path: d?.poster_path || null,
          year
        }
      });

      const data = { cinema };
      leaderboardCache = { expiresAt: now + 120_000, payload: { type, data }}
      return res.json(data);
    } catch(err) {
      return res.status(500).json({ error: 'leaderboards failed' });
    }
  });

  const inFlightDetails = new Map();

  async function getTitleWithDedupe(type, id) {
    const key = `${type}:${id}`
    if(inFlightDetails.has(key)) {
      return inFlightDetails.get(key);
    }

    const p = axios.get(`https://api.themoviedb.org/3/${type}/${id}`, {
      params: { api_key: KEY, language: "en-US" }
    }).then(r => r.data).finally(() => inFlightDetails.delete(key));

    inFlightDetails.set(key, p);
    return p;
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => console.log(`Listening on ${PORT}`));