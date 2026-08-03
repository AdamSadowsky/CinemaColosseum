import MovieCard from "../components/MovieCard"
import { useState, useEffect } from "react"
import { cinemaResults } from "../services/DiscoverApi";

const params = new URLSearchParams(window.location.search);
const type = params.get('type') === 'movie' ? 'movie' : 'tv';
const q = (params.get('q') || '').trim();


function Discover() {

    function cinemaDetails() {

    }

    const [media, setMedia] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect (() => {
        const loadMedia = async () => {
            try {
                const results = await cinemaResults({type, q})
                setMedia(results)
            } catch(err) {
                console.log(err)
                setError("Failed to load media...")
            } finally {
                setLoading(false)
            }
        }
        loadMedia()
    }, [])
    return(
        <div className="discover">
            { error ? ( 
                <div className="error">{error}</div> 
            ) : ( loading ? (
                <div className="loading"></div>
            ) : (
                <div className="Movie-Grid">
                {media.map(cinema => <MovieCard cinema={cinema} key={cinema.id}/>)}
            </div>
            ))}
        </div>
    )
}

export default Discover