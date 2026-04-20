const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = '/search?query=';
const APILINK   = '/details';
const params = new URLSearchParams(window.location.search);
const type = params.get('type') === 'movie' ? 'movie' : 'tv';
const id = Number(params.get('id'));

const main = document.getElementById('info');

if(type === null || !Number.isFinite(id) || id <= 0) {
    main.textContent = 'Invalid link. Missing or invalid type/id.';
} else {
    displayCinemaInfo(`${APILINK}?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`);
}

function displayCinemaInfo(url){
    fetch(url ,{ credentials: 'include' }).then(res => {
        if (!res.ok) throw new Error(`details failed (${res.status})`)
        return res.json()
    })
    .then(async function(data) {
        const { cinemaData: item } = data;
        const divCard = document.createElement('div');
        divCard.classList.add('cinema_card');
        const poster = document.createElement('img');
        poster.classList.add('poster');
        if(item.poster_path) {
            poster.src = IMG_PATH + item.poster_path;
        } else {
            poster.alt = `(no poster available)`;
        }
        poster.setAttribute('data-cinema-id', item.id);
        const layout = document.createElement('div');
        layout.classList.add('layout');
        const title = document.createElement('h2');
        title.classList.add('cinema_title');
        title.textContent = item.title || item.name || '-';
        poster.alt = item.title || item.name || '-';
        const date = document.createElement('h4');
        date.classList.add('date');
        date.textContent = 'Release Date: ' + (item.release_date || item.first_air_date || '-');
        const desc = document.createElement('p');
        desc.classList.add('desc');
        desc.textContent = item.overview || 'no description available';
        const scoreCard = document.createElement('div');
        scoreCard.classList.add('scoreCard');
        const score = await getRating({ type, id});
        const rating = document.createElement('h2');
        rating.classList.add('rating');
        rating.innerHTML = `Colosseum Rating<br>${Number(score.rating).toFixed(0)}`;
        const divider1 = document.createElement('div');
        divider1.classList.add('divider');
        const wins = document.createElement('h2');
        wins.classList.add('wins');
        wins.innerHTML = `Wins<br>${Number(score.wins).toFixed(0)}`;
        const divider2 = document.createElement('div');
        divider2.classList.add('divider');
        const losses = document.createElement('h2');
        losses.classList.add('losses');
        losses.innerHTML = `Losses<br>${Number(score.losses).toFixed(0)}`;
        divCard.appendChild(poster);
        layout.appendChild(title);
        layout.appendChild(date);
        layout.append(desc);
        scoreCard.appendChild(rating);
        scoreCard.appendChild(divider2);
        scoreCard.appendChild(wins);
        scoreCard.appendChild(divider1);
        scoreCard.appendChild(losses);
        divCard.append(layout);
        divCard.append(scoreCard);
        main.appendChild(divCard);
    })
     .catch(err => {                    
      console.error(err);
      main.textContent = 'Failed to load cinema info.';
    });
}

async function getRating({ type, id }) {
    const resp = await fetch(`/rating?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}` ,{ credentials: 'include' });
    if(!resp.ok) {
        throw new Error('vote failed');
    }
    return await resp.json();
}