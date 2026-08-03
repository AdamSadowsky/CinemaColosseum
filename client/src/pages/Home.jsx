import { useState } from "react"


const MOVIE_POSTERS = [
    { title: "The Shawshank Redemption", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg"},
    { title: "Forrest Gump", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"}, 
    { title: "Pulp Fiction", poster: "https://media.themoviedb.org/t/p/w116_and_h174_face/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg"}, 
    { title: "Goodfellas", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg"}, 
    { title: "The Matrix", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/qK76PKQLd6zlMn0u83Ej9YQOqPL.jpg"}, 
    { title: "The Hateful Eight", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/jIywvdPjia2t3eKYbjVTcwBQlG8.jpg"}, 
    { title: "The Terminator", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/hzXSE66v6KthZ8nPoLZmsi2G05j.jpg"}, 
    { title: "Back to the Future", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/vN5B5WgYscRGcQpVhHl6p9DDTP0.jpg"}, 
    { title: "Gladiator", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg"}, 
    { title: "Django Unchained", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg"}, 
    { title: "Inglourious Basterds", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg"}, 
    { title: "2001: A Space Odyssey", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg"}, 
    { title: "Scarface", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg"}, 
    { title: "There Will Be Blood", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/fa0RDkAlCec0STeMNAhPaF89q6U.jpg"}, 
    { title: "Taxi Driver", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/ekstpH614fwDX8DUln1a2Opz0N8.jpg"}, 
    { title: "The Wolf of Wall Street", poster: "https://media.themoviedb.org/t/p/w188_and_h282_face/kW9LmvYHAaS9iA0tHmZVq8hQYoq.jpg"}, 
    { title: "No Country for Old Men", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/6d5XOczc226jECq0LIX0siKtgHR.jpg"}, 
    { title: "Rocky", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/hEjK9A9BkNXejFW4tfacVAEHtkn.jpg"}, 
    { title: "Train to Busan", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/vNVFt6dtcqnI7hqa6LFBUibuFiw.jpg"}, 
    { title: "28 Days Later", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/sQckQRt17VaWbo39GIu0TMOiszq.jpg"}, 
    { title: "I Am Legend", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/iPDkaSdKk2jRLTM65UOEoKtsIZ8.jpg"}, 
    { title: "World War Z", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/aCnVdvExw6UWSeQfr0tUH3jr4qG.jpg"}, 
    { title: "The Mist", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/1CvJ6diBACKPVGOpcWuY4XPQdqX.jpg"}, 
    { title: "Joker", poster: "https://media.themoviedb.org/t/p/w116_and_h174_face/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"},
    { title: "The Green Mile", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/o0lO84GI7qrG6XFvtsPOSV7CTNa.jpg"},
    { title: "One Flew Over the Cuckoo's Nest", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/kjWsMh72V6d8KRLV4EOoSJLT1H7.jpg"},
    { title: "Saving Private Ryan", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg"},
    { title: "Whiplash", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/7fn624j5lj3xTme2SgiLCeuedmO.jpg"},
    { title: "The Departed", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/nT97ifVT2J1yMQmeq20Qblg61T.jpg"},
    { title: "The Shining", poster: "https://media.themoviedb.org/t/p/w440_and_h660_face/fFYAlrOudDJRYs8tvuHbUk0OGdL.jpg"},
    { title: "Good Will Hunting", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg"},
    { title: "Superbad", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg"},
    { title: "The Platform", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/iXvQnzy6JCAx1PiQEKXuTY04ZHl.jpg"},
    { title: "Million Dollar Baby", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/jcfEqKdWF1zeyvECPqp3mkWLct2.jpg"},
    { title: "The Godfather", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"}
]

const TV_POSTERS = [ 
    { name: "Mad Men", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/yd4BrXPQZvin4XMDlXUP9JgQDUQ.jpg" }, 
    { name: "The Sopranos", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/rTc7ZXdroqjkKivFPvCPX0Ru7uw.jpg" }, 
    { name: "Breaking Bad", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg" }, 
    { name: "Game of Thrones", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg" }, 
    { name: "Lost", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/og6S0aTZU6YUJAbqxeKjCa3kY1E.jpg" }, 
    { name: "Curb Your Enthusiasm", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/mZqWmSq1M61Jlre3furVDSXvdrN.jpg" }, 
    { name: "The Americans", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/w1UBlxEXhbKe8sp0fxFZh7MqTce.jpg" }, 
    { name: "Stranger Things", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/cVxVGwHce6xnW8UaVUggaPXbmoE.jpg" }, 
    { name: "Black Mirror", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg" }, 
    { name: "Supernatural", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/u40gJarLPlIkwouKlzGdobQOV9k.jpg" }, 
    { name: "House of Cards", poster: "https://media.themoviedb.org/t/p/w440_and_h660_face/1m5xXp6oc3tE1AVn4IOGsH4Oz4i.jpg" }, 
    { name: "The Walking Dead", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/ng3cMtxYKt1OSQYqFlnKWnVsqNO.jpg" }, 
    { name: "Chernobyl", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg" }, 
    { name: "Band of Brothers", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/8JMXquNmdMUy2n2RgW8gfOM0O3l.jpg" }, 
    { name: "Narcos", poster: "https://media.themoviedb.org/t/p/w440_and_h660_face/rTmal9fDbwh5F0waol2hq35U4ah.jpg" }, 
    { name: "Dexter", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/q8dWfc4JwQuv3HayIZeO84jAXED.jpg" }, 
    { name: "The Boys", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg" }, 
    { name: "American Horror Story", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/5LLG9bjq0i7V5N4UfRhnab8zHK4.jpg" }, 
    { name: "Smiling Friends", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/q3CSxl3G06MBc73TpHWwBYYTPxL.jpg" }, 
    { name: "Ozark", poster: "https://media.themoviedb.org/t/p/w600_and_h900_face/m73bD8VjibSKuTWg597GQVyVhSb.jpg" }
]

function getRandomItem(items, excludedItem = null) {
    const options = items.length > 1 && excludedItem
        ? items.filter(item => item !== excludedItem)
        : items;

    return options[Math.floor(Math.random() * options.length)];
}
  

const genres = ["Action", "Drama", "SciFi", "Thriller", "Horror", "Comedy", "Anime", "Documentary"]
function Home() {
    const [genre, setGenre] = useState([])
    const [pop, setPop] = useState("Beginner")
    const [mode, setMode] = useState("Colosseum")
    const [rounds, setRounds] = useState("10")
    const [movie_poster, setMoviePoster] = useState(getRandomItem(MOVIE_POSTERS))
    const [tv_poster, setTVPoster] = useState(getRandomItem(TV_POSTERS))

    function genreToggle(genre) {
        setGenre(prev => (
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        ))
    }

    function start(type){
        if(genre.length === 0) {
            alert(`Must select a ${type} genre`);
            return;
        }
        const url = new URL('/game', window.location.origin);
        url.searchParams.set('type', type === 'movie' ? 'movie' : 'tv');
        const gen = Array.isArray(genre) ? genre : [genre];
        gen.filter(Boolean).forEach(g => url.searchParams.append('genre', g));
        url.searchParams.set('modes', mode);
        url.searchParams.set('popularity', pop);
        url.searchParams.set('rounds', rounds);
        window.location.assign(url);
    }

    
    return (
        <>
            <div className="guide">
                <h2>Welcome to Cinema Colosseum</h2>
                <p>You'll be shown two titles at a time. Pick the one you like more and continue to the next match up.
                    <br/>Your vote helps that title move up or down in rating.
                </p>
                <p className="guide_footer">
                    <br/>When you're ready, click Find Movies or Find TV Shows to begin.
                </p>
            </div>
            <div className="selection">
                <div className="card" id="settings">
                    <div className="settings_card">
                        <h1>Settings</h1>
                        <p className="warning">Warning: Some genres may have limited results or may not show any results at all in beginner mode</p>
                        <div className="genre_head">
                            <p>Genre</p>
                            <button className="dropdown_bttn">
                                { genre.length ? genre.join(" ,") : "Please select an option"}
                            </button>
                            <div className="genre_dropdown">
                                {genres.map(value => (
                                    <div key={value} className={`dropdown_item ${genre.includes(value) ? "selected" : ""}`} onMouseDown={(event) => event.preventDefault()} onClick={() => genreToggle(value)}>{value}</div>
                                ))}
                            </div>
                        </div>
                        <div className="popularity_head">
                            <p>Popularity</p>
                            <button className="dropdown_bttn">{pop}</button>
                            <div className="popularity_dropdown" data-default="Beginner" onMouseDown={(event) => event.preventDefault()}>
                                <div className={`dropdown_item ${ pop === "Beginner" ? "selected" : ""}`} id="beginner1" data-value="Beginner" onClick={() => setPop("Beginner")}>Beginner</div>
                                <div className={`dropdown_item ${ pop === "Intermediate" ? "selected" : ""}`} id="intermediate2" data-value="Intermediate" onClick={() => setPop("Intermediate")}>Intermediate</div>
                                <div className={`dropdown_item ${ pop === "Cinema Critic" ? "selected" : ""}`} id="critic3" data-value="Cinema Critic" onClick={() => setPop("Cinema Critic")}>Cinema Critic</div>
                                <div className={`dropdown_item ${ pop === "Cinema Connoisseur" ? "selected" : ""}`} id="connoisseur4" data-value="Cinema Connoisseur" onClick={() => setPop("Cinema Connoisseur")}>Cinema Connoisseur</div>
                                <div className={`dropdown_item ${ pop === "Cinephile" ? "selected" : ""}`} id="cinephile5" data-value="Cinephile" onClick={() => setPop("Cinephile")}>Cinephile</div>
                                
                            </div>
                            <div className="hint" id="beginner">
                                Shows the most popular, highly rated titles. 
                                <br/><b>This may lead to a more limited selection</b>
                            </div>
                            <div className="hint" id="intermediate">
                                A mix of popular hits and well-known classics.
                            </div>
                            <div className="hint" id="critic">
                                Includes lesser known titles alongside popular picks.
                            </div>
                            <div className="hint" id="connoisseur">
                                Everything from hidden gems to mainstream favorites.
                            </div>
                            <div className="hint" id="cinephile">
                                Shows nearly every title available.
                            </div>
                        </div>
                        <div className="modes_head">
                            <p>Mode</p>
                            <button className="dropdown_bttn">{mode}</button>
                            <div className="modes_dropdown" data-default="Colosseum" onMouseDown={(event) => event.preventDefault()}>
                                <div className={`dropdown_item ${mode === "Colosseum" ? "selected" : ""} `} id="mode1d" data-value="Colosseum" onClick={() => setMode("Colosseum")}>Colosseum <b>(Recommended)</b></div>
                                <div className={`dropdown_item ${mode === "Gladiator" ? "selected" : ""}`} id="mode2d" data-value="Gladiator" onClick={() => setMode("Gladiator")}>Gladiator</div>
                            </div>
                            <div className="hint" id="mode1">
                                Vote between two titles to update their ratings.
                                <br/>After you choose, you'll see the rating change for both.
                            </div>
                            <div className="hint" id="mode2">
                                Pick a winner and it will stay on the screen for the next round until it loses.
                                <br/><b>This mode does not affect ratings.</b>
                            </div>
                        </div>
                        <div className="rounds_head">
                            <p>Number of Rounds</p>
                            <button className="dropdown_bttn">{rounds}</button>
                            <div className="rounds_dropdown" data-default="10" onMouseDown={(event) => event.preventDefault()}>
                            {["10", "25", "50", "100"].map(value => (
                                <div key={value} className={`dropdown_item ${rounds === value ? "selected" : ""}`} onClick={() => setRounds(value)}>{value}</div>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card" id="movie_card" onClick={() => start("movie")} onMouseEnter={() => {
                    setMoviePoster(getRandomItem(MOVIE_POSTERS))
                }}>
        
                    <img className="hover_poster" key={movie_poster.poster} src={movie_poster.poster} alt={movie_poster.title} />
                    <button className="options" id="movies_genre">
                        <span className="options_label">Find<br/>Movies</span>
                    </button>
                </div>
                    
                <div className="card" id="tv_card" onClick={() => start("tv")} onMouseEnter={() => {
                    setTVPoster(getRandomItem(TV_POSTERS))
                }}>
                    <img className="hover_poster" key={tv_poster.poster} src={tv_poster.poster} alt={tv_poster.title} />
                    <button className="options" id="tv_genre">
                        <span className="options_label">Find<br/>TV Shows</span>
                    </button>
                </div>
            </div>
        </>
    )    
}

export default Home