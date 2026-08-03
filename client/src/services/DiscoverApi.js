const APILINK   = '/api/discover';
const SEARCHAPI = '/api/search?query=';

export async function cinemaResults({ type, q }) {
    const url =  q ? SEARCHAPI + encodeURIComponent(q) : `${APILINK}?type=${type}`
    const res = await fetch(url, {credentials: "include"})

    if(!res) {
        throw new Error('Failed to load cinema results')
    }

    const data = await res.json()
    return Array.isArray(data?.results) ? data.results : []
}
