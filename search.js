const APILINK  = 'http://localhost:3000/discover';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCHAPI = 'http://localhost:3000/search?query=';

const main = document.getElementById('section');
const form = document.getElementById('form');
const search = document.getElementById('query');

displayMovies(APILINK);

function displayMovies(url){
    fetch(url).then(res => res.json())
    .then(function(data){
        console.log(data.results);
        data.results.forEach(el => {
            const divCard = document.createElement('div');
            divCard.classList.add('card');
            const divRow = document.createElement('div');
            divRow.classList.add('row');
            const divCol = document.createElement('div');
            divCol.classList.add('column');
            const poster = document.createElement('img');
            poster.classList.add('poster');
            poster.src = IMG_PATH + el.poster_path;
            poster.setAttribute('data-movie-id', el.id);
            const title = document.createElement('h3');
            title.classList.add('movie_title');
            title.textContent = el.title;

            divCard.appendChild(poster);
            divCard.appendChild(title);
            divCol.appendChild(divCard);
            divRow.appendChild(divCol);
            main.appendChild(divRow);
        });
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    main.innerHTML = '';
    const searchItem = search.value;
    const q = searchItem.trim();
    if(q){
        displayMovies(SEARCHAPI + encodeURIComponent(q));
        search.value = searchItem;
    }
});