import { motion } from 'framer-motion';
import { usePlayer, formatTime } from '../context/PlayerContext';
import LikeButton from './LikeButton';

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
    <motion.div
      className={`songItem${isCurrent ? ' activeSong' : ''}`}
      onClick={handleClick}
      whileHover={{ scale: 1.012, y: -2 }}
      whileTap={{ scale: 0.988 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
    >
      <img src={song.cover} alt={index} />
      <span className="songName">{song.title}</span>
      <span className="songlistplay">
        <LikeButton songId={song.id} />
        {/* YouTube link icon — shows on hover */}
        {song.ytUrl && (
          <a
            href={song.ytUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="songYtIcon"
            title="Watch on YouTube"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="fab fa-youtube" />
          </a>
        )}
        <span className="timestamp">
          {durationStr}{' '}
          <i
            className={`far songItemPlay ${isCurrent && isPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`}
            onClick={handlePlay}
          ></i>
        </span>
      </span>
    </motion.div>
  );
}

export default SongItem;
