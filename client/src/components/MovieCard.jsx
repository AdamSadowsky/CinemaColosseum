const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const params = new URLSearchParams(window.location.search)
const type = params.get('type') || "movie"

function MovieCard({cinema}) {

    function cinemaDetails() {
            const cinemaType = (cinema.media_type || type)
            window.location.assign(`/cinema-info?type=${encodeURIComponent(cinemaType)}&id=${encodeURIComponent(cinema.id)}`);
    }

    const title = cinema.title || cinema.name
    return (
    <div className='Movie-Card'>
        <div className='Movie-Poster' onClick={cinemaDetails}>
            <img src={IMG_PATH + cinema.poster_path} alt={title}></img>
        </div>
    </div>
)}

export default MovieCard