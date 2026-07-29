import { usePlayer } from '../context/PlayerContext';

function VolumeControl() {
  const { volume, setVolume, isMuted, toggleMute } = usePlayer();

  const volumeIcon =
    isMuted || volume === 0
      ? 'fa-volume-off'
      : volume < 0.5
        ? 'fa-volume-down'
        : 'fa-volume-up';

  return (
    <div className="playerRight">
      <div className="volumeControl">
        <i
          className={`fas ${volumeIcon} controlBtn`}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        ></i>
        <input
          type="range"
          className="volumeSlider"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          title="Volume"
        />
      </div>
    </div>
  );
}

export default VolumeControl;
