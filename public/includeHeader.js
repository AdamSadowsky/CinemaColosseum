fetch('/header')
  .then(r => r.text())
  .then(html => {
    document.getElementById('header').innerHTML = html;
    attachHeaderLoadingState();
    const main = document.getElementById('section');
    const form = document.getElementById('form');
    const search = document.getElementById('query');
    const SEARCHAPI = '/api/search?query=';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchItem = search.value;
      const q = searchItem.trim();
      if(!q) return;
      if(isDiscoverPage() && typeof displayCinema === 'function' && main) {
          main.innerHTML = '';
          displayCinema(SEARCHAPI + encodeURIComponent(q));
      } else {
          const url = new URL('/discover', window.location.href);
          url.searchParams.set('q', q);
          search.value = searchItem;
          window.location.href = url.toString();
      }
    });
    // if your backdrop is inside header.html, run this AFTER injection:
    setUpHoverPoster('#backdrop', MOVIE_BACKDROP);
  })
  .catch(console.error)
  .finally(() => {
    document.documentElement.classList.remove('loading');
  });
  
  fetch('/footer')
  .then(r => r.text())
  .then(html => {
    document.getElementById('footer').innerHTML = html;
  });

function attachHeaderLoadingState() {
  ['movies', 'tv_shows'].forEach(id => {
    const link = document.getElementById(id);
    if(!link) return;

    link.addEventListener('click', (event) => {
      if(
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      showHeaderPageLoading();
      const href = link.href;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.location.assign(href);
        });
      });
    });
  });
}

function showHeaderPageLoading() {
  if(document.body.classList.contains('page-loading')) {
    return;
  }

  document.body.classList.add('page-loading');
}

function isDiscoverPage() {
  return location.pathname === '/discover' || location.pathname === '/discover.html';
}

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

function setUpHoverPoster(cardSelector, posters) {
    const card = document.querySelector(cardSelector);

    if(!card || !posters?.length) {
        return;
    }

    const img = getPosterImage(card);
    setBackdropImage(img, getRandomItem(posters));
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
  
