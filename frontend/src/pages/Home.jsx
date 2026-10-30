import { useEffect, useState } from "react";
import api from "../services/api";
import TrackCard from "../components/TrackCard";

function Home() {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);

    useEffect(() => {
        api.get("music/tracks/")
            .then((response) => {
                setTracks(response.data.results);
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to load tracks.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handlePlay = (track) => {
        setSelectedTrack(track);
        console.log("Selected track:", track.title);
    };

    if (loading) return <h2>Loading music...</h2>;

    if (error) return <h2>{error}</h2>;

    return (
        <main className="home-page">
            <header>
                <h1>Discover Music</h1>
                <p>Find your next favourite sound.</p>
            </header>

            <section className="tracks-section">
                <h2>All Tracks</h2>

                <div className="tracks-grid">
                    {tracks.map((track) => (
                        <TrackCard
                            key={track.id}
                            track={track}
                            onPlay={handlePlay}
                        />
                    ))}
                </div>
            </section>

            {selectedTrack && (
                <p>
                    Selected: {selectedTrack.title}
                </p>
            )}
        </main>
    );
}

export default Home;