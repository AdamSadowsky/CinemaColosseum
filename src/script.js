const GAME_DROPDOWN_SELECTOR = '.genre_dropdown, .popularity_dropdown, .modes_dropdown, .rounds_dropdown';
const DROPDOWN_PLACEHOLDER = 'Please select an option below';
const DROPDOWN_SELECTORS = {
    genre: '.genre_dropdown',
    modes: '.modes_dropdown',
    popularity: '.popularity_dropdown',
    rounds: '.rounds_dropdown',
};

document.addEventListener('click', (event) => {
    const item = event.target.closest?.('.dropdown_item');
    const container = item?.closest(GAME_DROPDOWN_SELECTOR);

    if(!item || !container) {
        return;
    }

    updateDropdownSelection(container, item);
});

document.querySelectorAll('.options').forEach(button => {
    button.addEventListener('click', () => {
        const genre = getSelectedValues(document.querySelector(DROPDOWN_SELECTORS.genre));
        const type = getMediaType(button);

        if(genre.length === 0) {
            alert(`Must select a ${type} genre`);
            return;
        }

        start(
            type,
            genre,
            getDropdownValue('modes'),
            getDropdownValue('popularity'),
            getDropdownValue('rounds')
        );
    });
});

function updateDropdownSelection(container, item) {
    if(container.classList.contains('genre_dropdown')) {
        item.classList.toggle('selected');
    } else {
        const alreadySelected = item.classList.contains('selected');
        container.querySelectorAll('.dropdown_item.selected').forEach(selectedItem => {
            selectedItem.classList.remove('selected');
        });

        if(!alreadySelected) {
            item.classList.add('selected');
        }
    }

    const selectedValues = getSelectedValues(container);
    const button = container.previousElementSibling;

    container.classList.toggle('selected', selectedValues.length > 0);

    if(button) {
        button.textContent = selectedValues.length ? selectedValues.join(', ') : DROPDOWN_PLACEHOLDER;
    }
}

function getSelectedValues(container) {
    if(!container) {
        return [];
    }

    return [...container.querySelectorAll('.dropdown_item.selected')]
        .map(getItemValue)
        .filter(Boolean);
}

function getDropdownValue(name) {
    const container = document.querySelector(DROPDOWN_SELECTORS[name]);
    return getSelectedValues(container)[0] || container?.dataset.default || '';
}

function getItemValue(item) {
    return (item?.dataset.value ?? item?.textContent ?? '').trim();
}

function getMediaType(button) {
    return button.id.includes('movie') ? 'movie' : 'tv';
}

function start(type, genre, modes, popularity, rounds){
    const url = new URL('/game', window.location.href);
    url.searchParams.set('type', type === 'movie' ? 'movie' : 'tv');
    const genres = Array.isArray(genre) ? genre : [genre];

    genres.filter(Boolean).forEach(g => url.searchParams.append('genre', g));
    url.searchParams.set('modes', modes);
    url.searchParams.set('popularity', popularity);
    url.searchParams.set('rounds', rounds);
    window.location.assign(url);
}

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

const MOVIE_BACKDROP = [ 
    { poster: "https://image.tmdb.org/t/p/original/wC36tEU7AqP5llAvjXkZhZ248tX.jpg", pos: "50% 50%" }, // Rocky
    { poster: "https://image.tmdb.org/t/p/original/kXluiwt2DIIqoiEGR5AMA0QobCt.jpg", pos: "50% 50%" }, // Space Odyssey
    { poster: "https://image.tmdb.org/t/p/original/hND7xAaxxBgaIspp9iMsaEXOSTz.jpg", pos: "50% 45%" }, // Gladiator
    { poster: "https://image.tmdb.org/t/p/original/mHqT2YbPHcVtuZIIi8KrbZiLPKp.jpg", pos: "50% 50%" }, // Star Wars
    { poster: "https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg", pos: "50% 20%" }, // Fight Club
    { poster: "https://image.tmdb.org/t/p/original/lWUatvfOpiNhsxR06dUfSM2yPN9.jpg", pos: "50% 40%" }, // Space Odyssey
    { poster: "https://image.tmdb.org/t/p/original/sNYSbzWITnFUwvKRcHQ6HM822ST.jpg", pos: "50% 75%" }, // Space Odyssey
    { poster: "https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg", pos: "50% 25%" }, // Breaking Bad
    { poster: "https://image.tmdb.org/t/p/original/97cWTRgW87TwJqpCJ2Yo6gexy4G.jpg", pos: "50% 60%" }, // GOT
    { poster: "https://image.tmdb.org/t/p/original/wY3KAlS1VgyOc5rJ6kBierv1iKW.jpg", pos: "50% 35%" }, // The Walking Dead
    { poster: "https://image.tmdb.org/t/p/original/eub9xDaIfNwvg0oEv5tvkAlFqrO.jpg", pos: "50% 15%" }, // The Boys
    { poster: "https://image.tmdb.org/t/p/original/isJ4POBlbH5kmHVgbdP4gC4nFqO.jpg", pos: "50% 10%" }, // The Sopranos
    { poster: "https://image.tmdb.org/t/p/original/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg", pos: "50% 10%" } // Django Unchained
]
setUpHoverPoster('#movie_card', MOVIE_POSTERS);
setUpHoverPoster('#tv_card', TV_POSTERS);
setUpHoverPoster('#backdrop', MOVIE_BACKDROP);

function setUpHoverPoster(cardSelector, posters) {
    const card = document.querySelector(cardSelector);

    if(!card || !posters?.length) {
        return;
    }

    const img = getPosterImage(card);

    if(card.id === 'backdrop') {
        setBackdropImage(img, getRandomItem(posters));
        return;
    }

    let currentPoster = null;
    let nextPoster = getRandomItem(posters);
    let nextPosterReady = preloadPoster(nextPoster.poster);
    let hoverRequestId = 0;

    img.style.opacity = '0';
    setHoverPoster(img, nextPoster);

    card.addEventListener("mouseenter", async () => {
        const requestId = ++hoverRequestId;
        const posterToShow = nextPoster;

        await nextPosterReady;

        if(requestId !== hoverRequestId || !card.matches(':hover')) {
            return;
        }

        currentPoster = posterToShow;
        setHoverPoster(img, currentPoster);
        img.style.opacity = '0.5';

        nextPoster = getRandomItem(posters, currentPoster);
        nextPosterReady = preloadPoster(nextPoster.poster);
    });

    card.addEventListener("mouseleave", () => {
        hoverRequestId++;
        img.style.opacity = '0';
    });
}

function getPosterImage(card) {
    let img = card.querySelector('.hover_poster');

    if(!img) {
        img = document.createElement('img');
        img.className = 'hover_poster';
        card.prepend(img);
    }

    if(!img.hasAttribute('alt')) {
        img.alt = '';
    }

    return img;
}

function setHoverPoster(img, poster) {
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = poster.poster;
    img.alt = poster.title || poster.name || '';
}

function preloadPoster(src) {
    return new Promise(resolve => {
        const preload = new Image();
        preload.onload = resolve;
        preload.onerror = resolve;
        preload.src = src;
    });
}

function setBackdropImage(img, backdrop) {
    const size = isMobile() ? 'w780' : 'w1280';

    img.loading = 'eager';
    img.decoding = 'async';
    img.fetchPriority = 'high';
    img.src = tmdbSize(backdrop.poster, size);
    img.alt = '';
    img.style.objectPosition = backdrop.pos || '50% 50%';
}

function getRandomItem(items, excludedItem = null) {
    const options = items.length > 1 && excludedItem
        ? items.filter(item => item !== excludedItem)
        : items;

    return options[Math.floor(Math.random() * options.length)];
}

function tmdbSize(url, size) {
    return url.replace('/t/p/original/', `/t/p/${size}/`);
}

function isMobile() {
  return window.matchMedia('(max-width: 650px)').matches;
}
  
