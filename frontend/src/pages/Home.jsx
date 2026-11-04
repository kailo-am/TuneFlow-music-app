
import { useEffect,useRef, useState } from "react";
import api from "../services/api";
import TrackCard from "../components/TrackCard";

function Home() {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [ordering, setOrdering] = useState("title");
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [source, setSource] = useState("local");
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    

    const fetchTracks = (url) => {
    if (!url) return;

    setLoading(true);

    api.get(url)
        .then((response) => {
            setTracks(response.data.results);
            setNextPage(response.data.next);
            setPreviousPage(response.data.previous);
            setError(null);
        })
        .catch((err) => {
            console.error(err);
            setError("Unable to load tracks.");
        })
        .finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
    setLoading(true);

    const request =
        source === "audius"
            ? api.get("music/audius/search/", {
                  params: { q: searchTerm },
              })
            : api.get("music/tracks/", {
                  params: {
                      search: searchTerm,
                      genre: selectedGenre,
                      ordering,
                  },
              });

    request
        .then((response) => {
            
            const results = response.data.results;

            const normalizedTracks =
                source === "audius"
                    ? results.map((track) => ({
                        id: track.id,
                        title: track.title,
                        artist: track.user?.name ?? "Unknown artist",
                        genre: track.genre ?? "",
                        cover_image_url:
                            track.artwork?.["480x480"] ??
                            track.artwork?.["150x150"] ??
                            "",
                        audio_url: track.id
                            ? `https://api.audius.co/v1/tracks/${track.id}/stream`
                            : "",
                    }))
                    : results;

            setTracks(normalizedTracks);            setNextPage(source === "local" ? response.data.next : null);
            setPreviousPage(source === "local" ? response.data.previous : null);
            setError(null);
        })
        .catch((err) => {
            console.error(err);
            setError("Unable to load tracks.");
        })
        .finally(() => {
            setLoading(false);
        });
}, [source, searchTerm, selectedGenre, ordering]);

    const handlePlay = (track) => {
        setSelectedTrack(track);
        console.log("Selected track:", track.title);
    };

        const togglePlayback = async () => {
            const audio = audioRef.current;
            if (!audio) return;

            if (audio.paused) {
                try {
                    await audio.play();
                    setIsPlaying(true);
                } catch {
                    setIsPlaying(false);
                }
            } else {
                audio.pause();
                setIsPlaying(false);
            }
        };

        const playNext = () => {
            const index = tracks.findIndex((track) => track.id === selectedTrack?.id);
            if (index >= 0 && index < tracks.length - 1) handlePlay(tracks[index + 1]);
        };

        const playPrevious = () => {
            const index = tracks.findIndex((track) => track.id === selectedTrack?.id);
            if (index > 0) handlePlay(tracks[index - 1]);
        };

    return (
        <main className="home-page">
            <header>
                <h1>Discover Music</h1>
                <p>Find your next favourite sound.</p>
            </header>
            <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
            >
                <option value="local">TuneFlow catalog</option>
                <option value="audius">Audius</option>
            </select>

            <input
                type="text"
                placeholder="Search songs, artists, albums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
            // value means the current value of the select element, which is bound to the selectedGenre state variable. When the user selects a different genre from the dropdown, the onChange event handler updates the selectedGenre state with the new value. This triggers a re-render and fetches tracks based on the selected genre.
            // The onChange event handler is a function that takes the event object (e) as an argument. It accesses the value of the selected option using e.target.value and updates the selectedGenre state variable accordingly. This allows the component to react to user input and filter tracks based on the selected genre.
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
            >   <option value="">All genres</option>
                <option value="Electronic">Electronic</option>
                <option value="Ambient">Ambient</option>
                <option value="Techno">Techno</option>
                <option value="Acoustic">Acoustic</option>
                <option value="Instrumental">Instrumental</option>
                <option value="Indie Pop">Indie Pop</option>
                <option value="Synthwave">Synthwave</option>
                <option value="Piano">Piano</option>
            </select>
            <select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
                >
                <option value="title">Title: A–Z</option>
                <option value="-title">Title: Z–A</option>
                <option value="artist">Artist: A–Z</option>
                <option value="-artist">Artist: Z–A</option>
            </select>
            <section className="tracks-section">
                <h2>All Tracks</h2>

                {loading && <p>Loading music...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && tracks.length === 0 && (
                    <p>No tracks found.</p>
                )}

                {!loading && !error && (
                    <div className="tracks-grid">
                        {tracks.map((track) => (
                            <TrackCard
                                key={track.id}
                                track={track}
                                onPlay={handlePlay}
                            />
                        ))}
                    </div>
                    )}
                    {selectedTrack?.audio_url && (
                        <div className="audio-player">
                            <div className="audio-player-info">
                                <strong>NOW PLAYING</strong>
                                <span>{selectedTrack.title}</span>
                                <small>{selectedTrack.artist}</small>
                            </div>

                            <div className="audio-player-controls">
                                <button onClick={playPrevious} disabled={!tracks.length}>
                                    Previous
                                </button>
                                <button onClick={togglePlayback}>
                                    {isPlaying ? "Pause" : "Play"}
                                </button>
                                <button onClick={playNext} disabled={!tracks.length}>
                                    Next
                                </button>
                            </div>

                            <audio
                                ref={audioRef}
                                src={selectedTrack.audio_url}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onEnded={playNext}
                                onError={() => setIsPlaying(false)}
                            />
                        </div>
                    )}
                
            </section>
                <div className="pagination-controls">
                    <button
                        onClick={() => fetchTracks(previousPage)}
                        disabled={!previousPage || loading}
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => fetchTracks(nextPage)}
                        disabled={!nextPage || loading}
                    >
                        Next
                    </button>
                </div>
            {selectedTrack && (
                <p>Selected: {selectedTrack.title}</p>
            )}
        </main>
    );
}

export default Home;
