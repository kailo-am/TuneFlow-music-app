function TrackCard({ track, onPlay }) {
    return (
        <div className="track-card">
            <div className="track-cover">
                {track.cover_image_url ? (
                    <img src={track.cover_image_url} alt={`${track.title} cover`} />
                ) : (
                    <span>🎵</span>
                )}
            </div>
            <h3>{track.title}</h3>
            <p>{track.artist}</p>
            <span>{track.genre}</span>

            <button
                onClick={() => onPlay(track)}
                disabled={!track.audio_url}
                title={!track.audio_url ? "No audio available for this track" : "Play track"}
            >
                {track.audio_url ? "Play" : "No audio"}
            </button>
        </div>
    );
}

export default TrackCard;