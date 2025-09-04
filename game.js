const params = new URLSearchParams(location.search);
const type = params.get('type');
const genres = params.getAll('genre');
const list = params.get('list');
const arena = document.getElementById('arena');//Assigns layout
const tmp = document.getElementById('card_tmp');
const API_BASE = 'http://localhost:3000';//backend base url

const skip = document.getElementById('skip');
skip.addEventListener('click', async () => {
    skip.disabled = true;
    try {
        await loadPair();
    } finally {
        next.style.display = 'none';
        skip.disabled = false;
    }
});

function renderPair(movies){
    arena.innerHTML = '';//Clears previous layout
    skip.style.display = 'block';
    const [A, B] = movies;//Assigns A & B to movies array
    if(!A || !B){
        console.error('expected two items', movies);
        return;
    }
    //cache ids
    const aID = A.id;
    const bID = B.id;
    const next = document.getElementById('next');
    next.style.display = 'none';
    let winnerID = null;
    movies.forEach(m => {
        const node = tmp.content.firstElementChild.cloneNode(true);//Gets copy of child and subtree
        const posterEl = node.querySelector('.poster');
        if(m.poster_path){
            posterEl.src = `https://image.tmdb.org/t/p/w500${m.poster_path}`;//Assigns poster to url
            posterEl.alt = m.title || m.name || 'Poster';//Sets to name if src failure
            posterEl.loading = 'lazy';
        } else {
            posterEl.src = '';
            posterEl.alt = 'No poster available';
        }
        const titleEl = node.querySelector('.title');
        titleEl.textContent = m.title || m.name || '-';//Assigns title
        const dateEl = node.querySelector('.date');
        const raw = m.release_date || m.first_air_date;
        const year = raw.slice(0, 4) || '(-)';
        dateEl.textContent = `(${year})`;
        const metaEl = node.querySelector('.meta');
        if(metaEl) {
        metaEl.textContent = '';//clears previous data
        }
        node.style.border = 'none';
        node.addEventListener('click',  () => {
            if(winnerID){
                return;
            }
            next.style.display = 'block';
            skip.style.display = 'none';
            node.style.border = '3px solid white';
            winnerID = m.id;//Chosen card
            next.onclick = async () => {
                try {
                    await submitVote({
                        type, list, genres,
                        aID, bID, winnerID
                    });
                } catch {
                    console.log('vote failed');
                }
                await loadPair();//fetches next pair
            }
        });
        arena.appendChild(node);//Updates card
    });
}

async function fetchPair({type, list, genres}) {
    const qs = new URLSearchParams();
    if(type){
        qs.set('type', type);
    }
    if(list){
        qs.set('list', list);
    }
    for(const g of genres || []){
        qs.append('genre', g);
    }
    const resp = await fetch(`${API_BASE}/pair?${qs.toString()}`);
    if(!resp.ok){
        throw new Error('fetch failed');
    }
    const data = await resp.json();//Parses data to be destructured
    return [data.a, data.b];//returns movie data
}

async function submitVote({type, list, genres, aID, bID, winnerID}) {
    const resp = await fetch(`${API_BASE}/vote`, {
        method: 'POST',//submitting data
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({type, list, genres, aID, bID, winnerID})
    });
    if(!resp.ok){
        throw new Error('vote failed');
    }
    return await resp.json();
}

async function loadPair() {
    const pair = await fetchPair({type, list, genres} );
    renderPair(pair);
}

document.addEventListener('DOMContentLoaded', () => {
    loadPair().catch(err => console.error(err));//Starts round
});