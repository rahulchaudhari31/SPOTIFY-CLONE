import { usePlayer } from '../context/PlayerContext';
import ProgressBar from './ProgressBar';

function Controls() {
  const {
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeat,
    isShuffled,
    repeatMode,
  } = usePlayer();

  return (
    <div className="playerCenter">
      <div className="playerCenterInner">
        <div className="playbackControls">
          <button
            className={`iconToggle${isShuffled ? ' active' : ''}`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <i className="fas fa-random"></i>
          </button>

          <i className="fas fa-step-backward controlBtn" onClick={playPrevious} title="Previous"></i>

          <button
            className={`playCircle${isPlaying ? ' playing' : ''}`}
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>

          <i className="fas fa-step-forward controlBtn" onClick={playNext} title="Next"></i>

          <button
            className={`iconToggle${repeatMode !== 'off' ? ' active' : ''}`}
            onClick={cycleRepeat}
            title={
              repeatMode === 'off'
                ? 'Repeat off'
                : repeatMode === 'all'
                  ? 'Repeat all'
                  : 'Repeat one'
            }
          >
            <i className={`fas ${repeatMode === 'one' ? 'fa-redo-alt' : 'fa-redo'}`}></i>
            {repeatMode === 'one' && <span className="repeatOneBadge">1</span>}
          </button>
        </div>

        <ProgressBar />
      </div>
    </div>
  );
}

export default Controls;
