import { usePlayer } from '../context/PlayerContext';

function SongInfo() {
  const { currentSong, isPlaying, togglePlay } = usePlayer();

  return (
    <div className="playerLeft">
      {currentSong ? (
        <div className="playerLeftInner">
          <div className="playerLeftRow">
            <div className="playerCoverContainer">
              <img src={currentSong.cover} alt={currentSong.title} className="playerCover" />
              {isPlaying && <div className="playerCoverLiveRing" />}
            </div>
            <div className="playerSongMeta">
              <span className="playerSongTitle" title={currentSong.title}>
                {currentSong.title}
              </span>
              <div className="playerSongSubrow">
                <span className="playerSongArtist" title={currentSong.artist}>
                  {currentSong.artist}
                </span>
                {currentSong.isSpecial && (
                  <span className="playerStreamTag">
                    <i className="fab fa-youtube" /> STREAM
                  </span>
                )}
              </div>
            </div>
            <img
              src="/playing.gif"
              className="playerPlayingGif"
              width="22px"
              alt=""
              style={{ opacity: isPlaying ? 1 : 0 }}
            />
          </div>
        </div>
      ) : (
        <div className="playerLeftInner">
          <div className="playerLeftRow">
            <img src="/playing.gif" width="46px" alt="" className="playerCover" style={{ opacity: 0.3 }} />
            <div className="playerSongMeta">
              <span className="playerSongTitle" style={{ color: '#b3b3b3' }}>Tuneify Studio Ready</span>
              <span className="playerSongArtist" style={{ color: '#666' }}>Click any track or stream to listen</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SongInfo;
