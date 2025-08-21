let selection;
let leftMovie;
let rightMovie;
let leftMovieCount;
let rightMovieCount;
let leftMoviePercentage;
let rightMoviePercentage;
let leftMovieRating;
let rightMovieRating;
let leftMovieImage;
let rightMovieImage;
let leftMovieWatchable
let rightMovieWatchable;
let skip;
const sign_up = document.querySelector('.sign_up');


signUp.onclick = signUp();

//Determines if the clicked item belongs to a genre and assigns the container 
document.querySelectorAll('.dropdown_item').forEach(item => {
    item.addEventListener('click', () => {
        const container = item.closest('.genre, .list')//dropdown menu
        const isGenre = container.classList.contains('genre');

        //Checks if box matches container and resets box dropdown to original state if false
        document.querySelectorAll('.genre, .list').forEach(box => {
            if(box !== container){
            box.classList.remove('selected');
            box.querySelectorAll('.dropdown_item.selected').forEach(item => item.classList.remove('selected'));
            const btn = box.querySelector('.dropdown_bttn');
            if(btn){
                btn.textContent = box.classList.contains('genre') ? 'Genre' : 'List';
            }
            }
        });
        container.classList.add('selected');//Marks containers as active

        //For genre it joins previously selection with new selection if unique else it is deselected
        //For lists it removes previous selection and updates dropdown button with new selection
        if(isGenre){
            item.classList.toggle('selected');
            const selectedType = [...container.querySelectorAll('.dropdown_item.selected')]
            .map((el) => (el.dataset.value ?? el.textContent).trim());
            const btn = container.querySelector('.dropdown_bttn');
            btn.textContent = selectedType.length ? selectedType.join(', '): 'Genre';//Defaults to genre if no items selected
        } else {
            container.querySelectorAll('.dropdown_item.selected').forEach(item => item.classList.remove('selected'));
            item.classList.add('selected');
            const button = container.querySelector('.dropdown_bttn');
            button.textContent = (item.dataset.value ?? item.textContent).trim();
        }
    });
});

//All dropdown menus
const startBttn = document.querySelectorAll(
    '#random_movies, #movies_genre, #movies_list, #random_tv, #tv_genre, #tv_list');

//Finds type and checks for inappropriate inputs
//Determines category and passes itself and type to start fucntion
startBttn.forEach(bttn => {
    bttn.addEventListener('click', () => {
        const id = bttn.id;
        const movieGenre = [...document.querySelectorAll('.movies_genre .dropdown_item.selected')].map(el => (el.dataset.value ?? el.textContent).trim());
        const tvGenre = [...document.querySelectorAll('.tv_genre .dropdown_item.selected')].map(el => (el.dataset.value ?? el.textContent).trim());
        const movieList = document.querySelector('.movies_list .dropdown_item.selected');
        const tvList = document.querySelector('.tv_list .dropdown_item.selected');
        if(id === 'movies_genre' && movieGenre.length === 0){
            alert("Must select a movie genre");
            return;
        } else if(id === 'tv_genre' && tvGenre.length === 0){
            alert("Must select a tv genre");
            return;
        } else if(id === 'movies_list' && !movieList){
            alert("Must select a movie list");
            return;
        } else if(id === 'tv_list' && !tvList){
            alert("Must select a tv list");
            return;
        }
    const type = id.includes('movies') ? 0 : 1;
    let category = null;
    if(id.includes('genre')){
        category = type === 0 ? movieGenre : tvGenre;
    } else if(id.includes('list')){
        const el = type === 0 ? movieList : tvList;
        category = el ? (el.dataset.value ?? el.textContent).trim() : null;
    }
    start(type, category);
    });
});

function start(type, category){

}

function signUp(){

}