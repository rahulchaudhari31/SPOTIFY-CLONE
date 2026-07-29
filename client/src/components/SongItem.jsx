import { usePlayer, formatTime } from '../context/PlayerContext';

function SongItem({ song, index }) {
  const { currentIndex, isPlaying, playSong, songDurations } = usePlayer();
  const isCurrent = currentIndex === index;
  const durationStr = formatTime(songDurations[index]);

  function handlePlay(e) {
    e.stopPropagation();
    playSong(index);
  }

  function handleClick() {
    playSong(index);
  }

  return (
    <div className={`songItem${isCurrent ? ' activeSong' : ''}`} onClick={handleClick}>
      <img src={song.cover} alt={index} />
      <span className="songName">{song.title}</span>
      <span className="songlistplay">
        <span className="timestamp">
          {durationStr}{' '}
          <i
            className={`far songItemPlay ${isCurrent && isPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`}
            onClick={handlePlay}
          ></i>
        </span>
      </span>
    </div>
  );
}

export default SongItem;
