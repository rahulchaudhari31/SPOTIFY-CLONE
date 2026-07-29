import { usePlayer, formatTime } from '../context/PlayerContext';

function ProgressBar() {
  const { currentTime, duration, seek } = usePlayer();

  return (
    <div className="progressArea">
      <span className="timeDisplay currentTimeDisplay">{formatTime(currentTime)}</span>
      <input
        type="range"
        id="myProgressBar"
        min="0"
        max={duration || 0}
        step="0.1"
        value={currentTime}
        onChange={(e) => seek(parseFloat(e.target.value))}
      />
      <span className="timeDisplay totalDurationDisplay">{formatTime(duration)}</span>
    </div>
  );
}

export default ProgressBar;
