import { usePlayer } from '../context/PlayerContext';

function SongInfo() {
  const { currentSong, isPlaying, togglePlay } = usePlayer();

  return (
    <div className="playerLeft">
      {currentSong ? (
        <div className="playerLeftInner">
          <div className="playerLeftRow">
            <img src={currentSong.cover} alt={currentSong.title} className="playerCover" />
            <div className="playerSongMeta">
              <span className="playerSongTitle">{currentSong.title}</span>
              <span className="playerSongArtist">{currentSong.artist}</span>
            </div>
            <img
              src="/playing.gif"
              className="playerPlayingGif"
              width="20px"
              alt=""
              style={{ opacity: isPlaying ? 1 : 0 }}
            />
          </div>
          <button className="playerLeftPlayBtn" onClick={togglePlay}>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            {isPlaying ? ' Pause' : ' Play'}
          </button>
        </div>
      ) : (
        <div className="playerLeftInner">
          <div className="playerLeftRow">
            <img src="/playing.gif" width="56px" alt="" className="playerCover" />
            <div className="playerSongMeta">
              <span className="playerSongTitle" style={{ color: '#b3b3b3' }}>No song selected</span>
              <span className="playerSongArtist" style={{ color: '#666' }}>Select a song to play</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SongInfo;
