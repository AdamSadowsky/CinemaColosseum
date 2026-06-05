const APILINK   = '/api/discover';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = '/api/search?query=';

const main = document.getElementById('section');
const form = document.getElementById('form');
const search = document.getElementById('query');

const params = new URLSearchParams(window.location.search);
const type = params.get('type') === 'movie' ? 'movie' : 'tv';
const q = (params.get('q') || '').trim();

if(q) {
    displayCinema(SEARCHAPI + encodeURIComponent(q));
} else {
    displayCinema(`${APILINK}?type=${type}`);
}

async function displayCinema(url) {
    main.innerHTML = '';
    try {
        const res = await fetch(url, { credentials: 'include' });
        if(!res.ok) {
            throw new Error('No results could be loaded right now.');
        }

        const data = await res.json();
        const results = Array.isArray(data?.results) ? data.results : [];

        if(results.length === 0) {
            renderDiscoverMessage('No titles matched that search.');
            return;
        }

        results.forEach(el => {
            const divCard = document.createElement('div');
            divCard.classList.add('cinema_card');
            const divRow = document.createElement('div');
            divRow.classList.add('row');
            const divCol = document.createElement('div');
            divCol.classList.add('column');
            const poster = document.createElement('img');
            poster.classList.add('poster');
            if(el.poster_path) {
                poster.src = IMG_PATH + el.poster_path;
            }
            poster.setAttribute('data-cinema-id', el.id);
            poster.setAttribute('data-cinema-type', el.media_type || type);

            divCard.appendChild(poster);
            divCol.appendChild(divCard);
            divRow.appendChild(divCol);
            main.appendChild(divRow);

            poster.addEventListener('click', () => {
                if(el.media_type) {
                    window.location.assign(`/cinema-info?type=${encodeURIComponent(el.media_type)}&id=${encodeURIComponent(el.id)}`);
                } else {
                    window.location.assign(`/cinema-info?type=${encodeURIComponent(type)}&id=${encodeURIComponent(el.id)}`);
                }
            });
        });
    } catch(err) {
        console.error(err);
        renderDiscoverMessage('The discover page could not load right now.');
    }
}

function renderDiscoverMessage(message) {
    const status = document.createElement('p');
    status.style.color = 'white';
    status.style.textAlign = 'center';
    status.textContent = message;
    main.appendChild(status);
}

