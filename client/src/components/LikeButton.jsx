import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

function LikeButton({ songId, className = '' }) {
  const { isFavorite, toggleFavorite } = usePlayer();
  const liked = isFavorite(songId);
  const [burstKey, setBurstKey] = useState(0);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!liked) setBurstKey((k) => k + 1);
    toggleFavorite(songId);
  };

  return (
    <button
      className={`likeButton${liked ? ' liked' : ''} ${className}`}
      onClick={handleClick}
      title={liked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
      aria-pressed={liked}
    >
      <i className={`${liked ? 'fas' : 'far'} fa-heart`} />
      {burstKey > 0 && (
        <span key={burstKey} className="likeBurst" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <span key={i} className={`likeParticle p${i + 1}`} />
          ))}
        </span>
      )}
    </button>
  );
}

export default LikeButton;
