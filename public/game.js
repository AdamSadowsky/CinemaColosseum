const params = new URLSearchParams(location.search);
const type = params.get('type') === 'tv' ? 'tv' : 'movie';
const genres = params.getAll('genre');
const modes = params.get('modes');
const popularity = params.get('popularity');
const rounds = Number(params.get('rounds')) || 10;
const arena = document.getElementById('arena');//Assigns layout
const arenaBlock = document.getElementById('arenaBlock');//Assigns layout
const tmp = document.getElementById('card_tmp');
const skip = document.getElementById('skip');
const restart = document.querySelector('.restart');
const exit = document.querySelector('.exit');
const champ = document.querySelector('.champ');
const next = document.getElementById('next');
const round = document.querySelector('.round');
const winStreak = document.querySelector('.win_streak');
let champion = null;
let currentPairId = null;
const used = new Set();

let round_number = 1;
let streak = 0;
skip.addEventListener('click', async () => {
    skip.disabled = true;
    try {
        await loadPair();
    } catch(err) {
        console.error(err);
        showArenaError(err instanceof Error ? err.message : 'Failed to load next matchup.');
    } finally {
        next.style.display = 'none';
        skip.disabled = false;
    }
});

function renderPair(movies) {
    arena.innerHTML = '';//Clears previous layout
    skip.style.display = 'block';
    round.innerHTML = `Round<br>${round_number}`;
    let aNode = null;
    let bNode = null;
    const [A, B] = movies;

    if(!A || !B){
        console.error('expected two items', movies);
        return;
    }
    //cache ids
    const aID = A.id;
    const bID = B.id;
    next.style.display = 'none';
    let winnerID = null;
    movies.forEach(m => {
        const node = tmp.content.firstElementChild.cloneNode(true);//Gets copy of child and subtree
        const posterEl = node.querySelector('.poster');
        const headEl = node.querySelector('.head_rating');
        const ratingEl = node.querySelector('.rating');
        const changeEl = node.querySelector('.change');
        const winsEl = node.querySelector('.wins');
        const lossesEl = node.querySelector('.losses');
        const divider = node.querySelectorAll('.divider');
        headEl.style.display = 'none';
        ratingEl.style.display = 'none';
        winsEl.style.display = 'none';
        lossesEl.style.display = 'none';
        divider.forEach(d => {
            d.style.display = 'none';
        });

        if(m.poster_path){
            posterEl.src = `https://image.tmdb.org/t/p/w500${m.poster_path}`;//Assigns poster to url
            posterEl.alt = m.title || m.name || 'Poster';//Sets to name if src failure
            posterEl.loading = 'eager';
        } else {
            posterEl.src = '';
            posterEl.alt = 'No poster available';
        }
        const titleEl = node.querySelector('.title');
        titleEl.textContent = m.title || m.name || '-';//Assigns title
        const dateEl = node.querySelector('.date');
        const raw = m.release_date || m.first_air_date;
        const year = raw ? raw.slice(0, 4) : '(-)';
        dateEl.textContent = `(${year})`;
        if(m.id === aID) {
            aNode = node;
            aNode.posterEl = posterEl;
            aNode.headEl = headEl;
            aNode.ratingEl = ratingEl;
            aNode.changeEl = changeEl;
            aNode.winsEl = winsEl;
            aNode.lossesEl = lossesEl;
            aNode.titleEl = titleEl;
            aNode.dateEl = dateEl;
            aNode.divider = divider;
        } else if(m.id === bID) {
            bNode = node;
            bNode.posterEl = posterEl;
            bNode.headEl = headEl;
            bNode.ratingEl = ratingEl;
            bNode.changeEl = changeEl;
            bNode.winsEl = winsEl;
            bNode.lossesEl = lossesEl;
            bNode.titleEl = titleEl;
            bNode.dateEl = dateEl;
            bNode.divider = divider; 
        }
        node.onclick = async () => {
            if(winnerID){
                return; 
            }
            winnerID = m.id
            if(champion && winnerID === champion.id) {
                    streak++;
                } else {
                    champion = m;
                    streak = 1;
                }
            if(modes === 'Gladiator') {
                let info;
                try {
                    info = await submitVote({
                        pair_id: currentPairId, 
                        winnerID, 
                        k: 0
                    });
                } catch(err) {
                    console.error(err);
                    winnerID = null;
                    showArenaError(err instanceof Error ? err.message : 'Vote failed.');
                    next.style.display = 'none';
                    skip.style.display = 'block';
                    return;
                }
                winStreak.innerHTML = `Win Streak<br>${streak}`;
                round_number++;
                if(round_number > rounds) {
                    round.style.display = 'none';
                    winStreak.style.display = 'none';
                    const winnerNode = node === aNode ? aNode : bNode;
                    const loserNode = node !== aNode ? aNode : bNode;
                    winnerNode.classList.add('winner');
                    loserNode.classList.add('info');
                    
                    loserNode.posterEl.style.display = 'none';
                    loserNode.titleEl.style.display = 'none';
                    loserNode.dateEl.style.display = 'none';
                    loserNode.style.backgroundColor = '#142b50ff'
                    loserNode.style.borderColor = 'white'

                    const wins = (winnerID === aID) ? info.a_wins : info.b_wins;
                    const losses = (winnerID === aID) ? info.a_losses : info.b_losses;
                    const total = wins + losses;
                    const winRate = (wins / total) * 100;

                    const record = document.createElement('p');
                    const d1 = document.createElement('div');
                    const win_rate = document.createElement('p');
                    const d2 = document.createElement('div');
                    const ranking = document.createElement('p');

                    ranking.className = 'ranking';
                    d1.className = 'd1';
                    record.className = 'record';
                    d2.className = 'd2';
                    const res = await fetch(`/leaderboard?type=${type}`, { credentials: "include" });
                    let idx = -1;
                    if(res.ok) {
                        const data = await res.json();
                        const list = Array.isArray(data.cinema) ? data.cinema : [];
                        idx = list.findIndex(x => Number(x.tmdb_id) === Number(winnerID));
                    }
                    ranking.textContent = idx === -1 ? 'Not ranked in Top 100' : `Leaderboard Ranking: #${idx + 1}`;
                    win_rate.className = 'win_rate';
                    record.textContent = `Record: ${wins} - ${losses}`;
                    win_rate.textContent = `Win Rate: ${winRate.toFixed(2)}%`;
                    loserNode.appendChild(ranking);
                    loserNode.appendChild(d1);
                    loserNode.appendChild(record);
                    loserNode.appendChild(d2);
                    loserNode.appendChild(win_rate);
                    skip.style.display = 'none';
                    restart.style.display = 'block';
                    exit.style.display = 'block';
                    champ.style.display = 'block';
                    d1.style.display = 'block';
                    d2.style.display = 'block';
                    restart.onclick = async () => {
                        window.location.reload();
                    }
                    return;
                }
                try {
                    await loadPair();
                    const imgs = [...document.querySelectorAll('#arena img')]
                    await Promise.all(
                    imgs.map(img => 
                        img.complete ? Promise.resolve() : new Promise(res => {
                            img.addEventListener('load', res, {once: true});
                            img.addEventListener('error', res, {once: true});
                            })
                        )
                    );
                    document.getElementById('skip')?.scrollIntoView({ behavior: 'auto', block: 'end'})
                } catch(err) {
                    console.error(err);
                    winnerID = null;
                    showArenaError(err instanceof Error ? err.message : 'Failed to load next matchup.');
                    skip.style.display = 'block';
                    next.style.display = 'none';
                    return;
                } 
            } else {
                next.style.display = 'flex';
                skip.style.display = 'none';
                winnerID = m.id;//Chosen card
                try {
                    const info = await submitVote({
                    type, 
                    pair_id: currentPairId, 
                    winnerID, 
                    k: 128
                    });

                    if(winnerID === aID){
                        aNode.style.border = '3px solid white';
                        aNode.changeEl.innerHTML = `+${Number(info.a_delta).toFixed(0)}<br>Change`;
                        aNode.changeEl.style.color = 'rgba(0, 255, 170, 1)';
                    } else {
                        aNode.changeEl.innerHTML = `${Number(info.a_delta).toFixed(0)}<br>Change`;
                        aNode.changeEl.style.color = 'red'
                    }
                    if(m.id === bID) {
                        bNode.style.border = '3px solid white';
                        bNode.changeEl.innerHTML = `+${Number(info.b_delta).toFixed(0)}<br>Change`;
                        bNode.changeEl.style.color = 'rgba(0, 255, 170, 1)';
                    } else {
                        bNode.changeEl.innerHTML = `${Number(info.b_delta).toFixed(0)}<br>Change`;
                        bNode.changeEl.style.color = 'red'
                    }
                    aNode.headEl.style.display = 'block';
                    aNode.ratingEl.textContent = Number(info.a_rating).toFixed(0);
                    aNode.ratingEl.style.display = 'block';
                    aNode.changeEl.style.display = 'block';
                    aNode.winsEl.innerHTML = `${info.a_wins}<br>Victories`;
                    aNode.winsEl.style.display = 'block';
                    aNode.lossesEl.innerHTML = `${info.a_losses}<br>Defeats`;
                    aNode.lossesEl.style.display = 'block';
                    aNode.divider.forEach(d => {
                        d.style.display = 'block';
                    })
                    bNode.headEl.style.display = 'block';
                    bNode.ratingEl.textContent = Number(info.b_rating).toFixed(0);
                    bNode.ratingEl.style.display = 'block';
                    bNode.changeEl.style.display = 'block';
                    bNode.winsEl.innerHTML = `${info.b_wins}<br>Victories`;
                    bNode.winsEl.style.display = 'block';
                    bNode.lossesEl.innerHTML = `${info.b_losses}<br>Defeats`;
                    bNode.lossesEl.style.display = 'block';
                    bNode.divider.forEach(d => {
                        d.style.display = 'block';
                    })
                    aNode.posterEl.classList.add('dim');
                    bNode.posterEl.classList.add('dim');
                    } catch(err) {
                        console.error(err);
                        winnerID = null;
                        showArenaError(err instanceof Error ? err.message : 'Vote failed.');
                        next.style.display = 'none';
                        skip.style.display = 'block';
                    }
                next.onclick = async () => {
                    round_number++;
                    if(round_number > rounds) {
                        next.style.display = 'none';
                        round.style.display = 'none';
                        restart.style.display = 'block';
                        exit.style.display = 'block';
                        restart.onclick = async () => {
                            start(type, genres, modes, popularity, rounds)
                        }
                        return;
                    }
                    aNode.posterEl.classList.remove('dim');
                    aNode.headEl.style.display = 'none';
                    aNode.ratingEl.style.display = 'none';
                    aNode.changeEl.style.display = 'none';
                    aNode.winsEl.style.display = 'none';
                    aNode.lossesEl.style.display = 'none';
                    bNode.posterEl.classList.remove('dim');
                    bNode.headEl.style.display = 'none';
                    bNode.ratingEl.style.display = 'none';
                    bNode.changeEl.style.display = 'none';
                    bNode.winsEl.style.display = 'none';
                    bNode.lossesEl.style.display = 'none';
                    aNode.style.border = 'none';
                    bNode.style.border = 'none';
                    aNode.divider.forEach(d => {
                        d.style.display = 'none';
                    });
                    bNode.divider.forEach(d => {
                        d.style.display = 'none';
                    });

                    try {
                        await loadPair();
                        const imgs = [...document.querySelectorAll('#arena img')]
                        await Promise.all(
                        imgs.map(img => 
                            img.complete ? Promise.resolve() : new Promise(res => {
                                img.addEventListener('load', res, {once: true});
                                img.addEventListener('error', res, {once: true});
                                })
                            )
                        );
                        document.getElementById('skip')?.scrollIntoView({ behavior: 'auto', block: 'end'});
                    } catch(err) {
                        console.error(err);
                        winnerID = null;
                        showArenaError(err instanceof Error ? err.message : 'Failed to load next matchup.');
                        next.style.display = 'none';
                        skip.style.display = 'block';
                    }
                }
            }
        }
        arena.appendChild(node);//Updates card
    });
}

async function fetchPair({excludedIds = [], championId = null}) {
    const resp = await fetch('/pair', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            type,
            genre: genres,
            popularity,
            exclude: excludedIds,
            champion_id: championId,
        }),
    });
    if(!resp.ok){
        const message = await getResponseError(resp, 'Failed to load matchup');
        throw new Error(message);
    }
    return await resp.json();
}

async function submitVote({pair_id, winnerID, k}) {
    const resp = await fetch(`/vote`, {
        method: 'POST',//submitting data
        credentials: 'include',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            pair_id, 
            winner_id: winnerID, 
        })
    });
    if(!resp.ok){
        const message = await getResponseError(resp, 'Vote failed');
        throw new Error(message);
    }
    return await resp.json();
}

async function loadPair() {
    arenaBlock.classList.add('is-loading');
    try{
        const championId = (modes === 'Gladiator' && champion && round_number > 1) ? champion.id : null
        const excludedIds = modes === 'Gladiator' ? [...used].filter(id => id !== championId) : [];
        const data = await fetchPair({ excludedIds, championId });
        currentPairId = data.pair_id;
        const x = data.a;
        const y = data.b;
        if(modes === 'Gladiator') {
            const challenger = championId ? (x.id !== championId ? x : y) : null;
            if(challenger) {
                used.add(challenger.id);
            }
            if(!championId) {
                used.add(x.id);
                used.add(y.id);
            }
            renderPair([x, y]);
            arenaBlock.classList.remove('is-loading');
            return;
        }
        renderPair([x, y]);
        arenaBlock.classList.remove('is-loading');
  } catch (err) {
    console.error(err);
    arenaBlock.classList.remove('is-loading');
    showArenaError(err instanceof Error ? err.message : 'Failed to load matchup.');
    next.style.display = 'none';
    skip.style.display = 'block';
    throw err;
  }
}

async function getResponseError(resp, fallback) {
    try {
        const payload = await resp.json();
        if(typeof payload?.error === 'string' && payload.error.trim()) {
            return payload.error.trim();
        }
    } catch {
        // fall through to text parsing
    }

    try {
        const text = await resp.text();
        if(text.trim()) {
            return text.trim();
        }
    } catch {
        // ignore text parsing errors
    }

    return fallback;
}

function showArenaError(message) {
    arena.innerHTML = '';
    const errorMessage = document.createElement('p');
    errorMessage.style.color = 'white';
    errorMessage.style.textAlign = 'center';
    errorMessage.textContent = message;
    arena.appendChild(errorMessage);
}

document.addEventListener('DOMContentLoaded', () => {
    loadPair().catch(err => console.error(err));//Starts round
});
