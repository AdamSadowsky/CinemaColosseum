<h1><p align="center">🎬 Cinema Colosseum</p></h1>

## Overview
Cinema Colosseum is a full-stack web application that gamifies the movie rating system. Users choose between pairs of movies in a head-to-head format, making voting fun and interactive while discovering new films.

## Features
- **Movie Pair Voting** – Two movies are displayed side by side, and the user votes for their favorite.
- **Dynamic Movie Cards** – Cards are generated on the fly using live data from TMDB.
- **Skip Option** – Users can skip a matchup and load a new pair.
- **Interactive Experience** – Votes are recorded and the next matchup is shown instantly.
- **Movie Discovery** – Encourages users to find new films through gamified comparisons.

## Tech Stack
**Frontend**
- HTML, CSS, JavaScript

**Backend**
- Node.js
- Express.js
- REST API Integration with [TMDB API](https://www.themoviedb.org/)

## How It Works
1. The backend (`server.js`) uses **Express** and **Axios** to fetch movies from TMDB.
2. The frontend (`search.js`, `game.js`) calls the backend via a **REST API** (e.g., `/discover`, `/search`, `/pair`).
3. Movies are displayed dynamically in the browser.
4. Users click a card to vote, or skip to load a new pair.

## Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/CinemaColosseum.git
   cd CinemaColosseum
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your TMDB API key:
   ```
   TMDB_API_KEY=your_api_key_here
   PORT=3000
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   You should see:
   Server running at http://localhost:3000
5. Run the frontend<br>
   Open a second terminal in the same folder and run:
   ```bash
   npx serve .
   ```
   This will print a link such as:<br>
   http://localhost:5173<br>
   Open that link in your browser to use the app.

## License
This project is licensed under the MIT License.
