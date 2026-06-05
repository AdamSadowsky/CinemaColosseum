const IMG_PATH = 'https://image.tmdb.org/t/p/w342';
const params = new URLSearchParams(window.location.search);
const type = params.get('type') === 'tv' ? 'tv' : 'movie';
const rowEl = document.getElementById('leaderboardRow');
const tmp = document.getElementById('tmp');
const dropdown = document.querySelector('.dropdown_bttn');
const items = document.querySelectorAll('.leaderboard_dropdown .dropdown_item');
const loading = document.querySelector('.leaderboards');
const statusEl = document.getElementById('leaderboardStatus');
const percentFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

items.forEach(item => {
    item.addEventListener('click', () => {
        const selectedType = item.dataset.value === 'tv' ? 'tv' : 'movie';
        const url = new URL('/leaderboards', window.location.href);

        url.searchParams.set('type', selectedType);
        window.location.assign(url);
    });
});

loadLeaderboard(type);

async function loadLeaderboard(type) {
    setLeaderboardType(type);
    setStatus('');
    loading.classList.add('is-loading');

    try {
        const response = await fetch(`/leaderboard?type=${encodeURIComponent(type)}`);

        if(!response.ok) {
            throw new Error(`leaderboard failed (${response.status})`);
        }

        const payload = await response.json();
        const cinema = Array.isArray(payload.cinema) ? payload.cinema : [];

        renderLeaderboard(cinema, type);
    } catch(err) {
        console.error(err);
        rowEl.innerHTML = '';
        setStatus('The leaderboard could not load right now. Try again in a moment.');
    } finally {
        loading.classList.remove('is-loading');
    }
}

function renderLeaderboard(cinema, type) {
    rowEl.innerHTML = '';

    if(cinema.length === 0) {
        setStatus('No rankings yet.');
        return;
    }

    const fragment = document.createDocumentFragment();

    cinema.forEach((cinemaItem, index) => {
        fragment.appendChild(createLeaderboardRow(cinemaItem, index, type));
    });

    rowEl.appendChild(fragment);
}

function createLeaderboardRow(cinemaItem, index, type) {
    const row = tmp.content.firstElementChild.cloneNode(true);
    const rank = index + 1;
    const title = cinemaItem.title || cinemaItem.name || '-';
    const year = cinemaItem.year && cinemaItem.year !== '-' ? `(${cinemaItem.year})` : '';
    const rating = formatWholeNumber(cinemaItem.rating);
    const wins = Number(cinemaItem.wins) || 0;
    const losses = Number(cinemaItem.losses) || 0;
    const total = wins + losses;
    const winRate = total ? (wins / total) * 100 : 0;
    const winRateText = `${percentFormatter.format(winRate)}%`;

    row.classList.toggle('is-podium', rank <= 3);
    row.dataset.rank = String(rank);
    row.tabIndex = 0;
    row.setAttribute('role', 'link');
    row.setAttribute(
        'aria-label',
        `Open ${title}. Rank ${rank}. Rating ${rating}. Record ${wins} wins and ${losses} losses. Win rate ${winRateText}.`
    );

    row.querySelector('.rank').textContent = `#${rank}`;
    setPoster(row.querySelector('.poster'), cinemaItem, title);
    row.querySelector('.title').textContent = title;
    row.querySelector('.date').textContent = year;
    row.querySelector('.rating').textContent = `Colosseum Rating: ${rating}`;
    row.querySelector('.record').textContent = `Record: ${wins} - ${losses}`;
    row.querySelector('.win_rate').textContent = `Win Rate: ${winRateText}`;

    row.addEventListener('click', () => openCinemaInfo(type, cinemaItem.tmdb_id));
    row.addEventListener('keydown', event => {
        if(event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        event.preventDefault();
        openCinemaInfo(type, cinemaItem.tmdb_id);
    });

    return row;
}

function setLeaderboardType(type) {
    dropdown.textContent = type === 'tv' ? 'TV' : 'Movie';

    items.forEach(item => {
        item.classList.toggle('selected', item.dataset.value === type);
    });
}

function setPoster(posterEl, cinemaItem, title) {
    if(!cinemaItem.poster_path) {
        posterEl.removeAttribute('src');
        posterEl.alt = 'No poster available';
        posterEl.classList.add('is-missing');
        return;
    }

    posterEl.src = IMG_PATH + cinemaItem.poster_path;
    posterEl.alt = `${title} poster`;
    posterEl.loading = 'lazy';
    posterEl.decoding = 'async';
}

function setStatus(message) {
    if(!statusEl) {
        return;
    }

    statusEl.textContent = message;
    statusEl.hidden = !message;
}

function formatWholeNumber(value) {
    const number = Number(value);

    return Number.isFinite(number) ? String(Math.round(number)) : '-';
}

function openCinemaInfo(type, tmdbId) {
    if(!tmdbId) {
        return;
    }

    window.location.assign(`/cinema-info?type=${encodeURIComponent(type)}&id=${encodeURIComponent(tmdbId)}`);
}
