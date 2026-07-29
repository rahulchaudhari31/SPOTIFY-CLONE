import { usePlayer, formatTime } from '../context/PlayerContext';

function Controls() {
  const {
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    currentTime,
    duration,
    seek,
  } = usePlayer();

  return (
    <div className="playerCenter">
      <div className="playerCenterInner">
        <div className="progressArea">
          <span className="timeDisplay">{formatTime(currentTime)}</span>
          <input
            type="range"
            id="myProgressBar"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
          />
          <span className="timeDisplay">{formatTime(duration)}</span>
        </div>

        <div className="playbackControls">
          <i className="fas fa-step-backward controlBtn" onClick={playPrevious} title="Previous"></i>

          <i
            className={`fas controlBtn playBtn ${isPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          ></i>

          <i className="fas fa-step-forward controlBtn" onClick={playNext} title="Next"></i>
        </div>
      </div>
    </div>
  );
}

export default Controls;
