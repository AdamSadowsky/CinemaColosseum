const IMG_PATH = 'https://image.tmdb.org/t/p/w342';
const SEARCHAPI = '/search?query=';
const APILINK   = '/details';
const params = new URLSearchParams(window.location.search);
const type = params.get('type') === 'movie' ? 'movie' : 'tv';
const genre = params.get('genre') || null;
const rowEl = document.getElementById('leaderboardRow');
const tmp = document.getElementById('tmp');
const dropdown = document.querySelector('.dropdown_bttn');
const items = document.querySelectorAll('.dropdown_item');
const loading = document.querySelector('.leaderboards')

items.forEach(i => {
    i.onclick = () => {
        window.location.href = `/leaderboards?type=${encodeURIComponent(i.dataset.value)}`;
    }
});


loadLeaderboardDef(type);

async function loadLeaderboardDef(type) {
    dropdown.textContent = type === 'tv' ? 'TV' : 'Movie';
    loading.classList.add('is-loading');
    const cinemaRanking = await fetch(`/leaderboard?type=${encodeURIComponent(type)}`);
    if(!cinemaRanking.ok) {
        return console.error('no response');
    }

    const payload = await cinemaRanking.json();
    const cinema = payload.cinema;
    rowEl.innerHTML = '';
    let i = 0;

    cinema.forEach((c, item) => {
            const row = tmp.content.firstElementChild.cloneNode(true);
            row.querySelector('.rank').textContent = i + 1;
            row.querySelector('.poster').src = IMG_PATH + c.poster_path;
            row.querySelector('.poster').alt = `${c.title || c.name || 'Title'} poster`;
            row.querySelector('.poster').loading = 'lazy';
            row.querySelector('.title').textContent = c.title || c.name || '-';
            row.querySelector('.date').textContent = `(${c.year})`;
            row.querySelector('.rating').innerHTML = `Colosseum Rating:   ${c.rating}`;
            const wins = c.wins;
            const losses = c.losses;
            const total = wins + losses;
            row.querySelector('.record').innerHTML = `Record:     ${wins} - ${losses}`;
            const win_rate_val = total ? (wins / total) * 100 : 0;
            row.querySelector('.win_rate').textContent = 'Win Rate:     ' + win_rate_val.toFixed(2) + '%';
            rowEl.appendChild(row);
            i++;

            row.onclick = () => {
                window.location.href = `/cinema-info?type=${encodeURIComponent(type)}&id=${encodeURIComponent(c.tmdb_id)}`;
        };
    }) 
    loading.classList.remove('is-loading');
}
