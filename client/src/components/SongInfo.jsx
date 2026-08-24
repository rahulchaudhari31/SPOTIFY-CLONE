import { usePlayer } from '../context/PlayerContext';

function cleanTitle(str) {
  if (!str) return str;
  return str
    .replace(/\|.*$/i, '')
    .replace(/\(.*?\)/gi, '')
    .replace(/\[.*?\]/gi, '')
    .replace(/\bfull\b.*$/i, '')
    .replace(/\bofficial\b.*$/i, '')
    .replace(/\baudio\b.*$/i, '')
    .replace(/\bvideo\b.*$/i, '')
    .replace(/\blyrics\b.*$/i, '')
    .replace(/\bvisualizer\b.*$/i, '')
    .replace(/\bft\.?\b.*$/i, '')
    .replace(/\bfeat\.?\b.*$/i, '')
    .trim();
}

function cleanArtist(str) {
  if (!str) return str;
  return str
    .replace(/\|.*$/i, '')
    .replace(/,.*$/i, '')
    .replace(/\(.*?\)/gi, '')
    .trim();
}

function truncate(str, n) {
  return str && str.length > n ? str.slice(0, n).trimEnd() + '…' : str;
}

function SongInfo() {
  const { currentSong, isPlaying } = usePlayer();

  if (!currentSong) {
    return (
      <div className="playerLeft">
        <div className="playerLeftRow">
          <img src="/playing.gif" width="46px" alt="" className="playerCover" style={{ opacity: 0.3 }} />
          <div className="playerSongMeta">
            <span className="playerSongTitle" style={{ color: '#b3b3b3' }}>Tuneify Studio Ready</span>
            <span className="playerSongArtist" style={{ color: '#666' }}>Click any track to listen</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="playerLeft">
      <div className="playerLeftRow">
        <div className="playerCoverContainer">
          <img src={currentSong.cover} alt={currentSong.title} className="playerCover" />
          {isPlaying && <div className="playerCoverLiveRing" />}
        </div>
        <div className="playerSongMeta">
          <span className="playerSongTitle" title={currentSong.title}>
            {truncate(cleanTitle(currentSong.title), 28)}
          </span>
          <span className="playerSongArtist" title={currentSong.artist}>
            {truncate(cleanArtist(currentSong.artist), 22)}
          </span>
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
  );
}

export default SongInfo;
