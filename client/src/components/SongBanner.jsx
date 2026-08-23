import { usePlayer } from '../context/PlayerContext';
import LikeButton from './LikeButton';

function SongBanner() {
  const { currentSong, isPlaying, togglePlay } = usePlayer();

  if (!currentSong) {
    return (
      <div className="songBanner empty">
        <div className="bannerPlaceholderContent">
          <div className="bannerEmptyIcon">
            <i className="fas fa-compact-disc fa-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h3>Studio Station Ready</h3>
          <p>Select any track or YouTube Pro stream to play</p>
        </div>
      </div>
    );
  }

  return (
    <div className="songBanner">
      <div className="bannerCoverContainer">
        <img src={currentSong.cover} alt={currentSong.title} className="bannerCover" />
        {isPlaying && <div className="bannerCoverRing" />}
      </div>
      <div className="bannerMeta">
        <div className="bannerBadgeRow">
          <span className="bannerLabel">
            {isPlaying ? (
              <>
                <span className="livePulseDot" /> NOW STREAMING
              </>
            ) : (
              'PAUSED'
            )}
          </span>
          {currentSong.isSpecial && (
            <span className="bannerSpecialBadge">
              <i className="fab fa-youtube" /> HD STREAM
            </span>
          )}
        </div>
        <h2 className="bannerTitle">{currentSong.title}</h2>
        <p className="bannerArtist">{currentSong.artist}</p>
        <span className="bannerGenreTag">{currentSong.genre || 'Music'}</span>
        <div className="bannerActions">
          <button className="bannerPlayBtn" onClick={togglePlay}>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            <span>{isPlaying ? 'Pause' : 'Play Direct Audio'}</span>
          </button>
          <LikeButton songId={currentSong.id} className="likeButtonLarge" />
        </div>
      </div>
    </div>
  );
}

export default SongBanner;
