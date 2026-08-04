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