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
