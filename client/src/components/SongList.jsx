import { usePlayer } from '../context/PlayerContext';
import SongItem from './SongItem';

function SongList() {
  const { songs } = usePlayer();

  return (
    <div className="songList">
      <h1>Best Trending Hits - Your Favourite Music</h1>
      <div className="songItemContainer">
        {songs.map((song, index) => (
          <SongItem key={song.id} song={song} index={index} />
        ))}
      </div>
    </div>
  );
}

export default SongList;
