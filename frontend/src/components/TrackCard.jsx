function TrackCard({ track, onPlay }) {
    return (
        <div className="track-card">
            <div className="track-cover">
                🎵
            </div>

            <h3>{track.title}</h3>
            <p>{track.artist}</p>

            <span>{track.genre}</span>

            <button onClick={() => onPlay(track)}>
                Play
            </button>
        </div>
    );
}

export default TrackCard;