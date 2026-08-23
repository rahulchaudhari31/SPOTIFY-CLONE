import { usePlayer } from '../context/PlayerContext';
import SongItem from './SongItem';

const YT_VOL1 = 'https://youtu.be/ltyf0PjonQg?si=_2Zyd0NvKHTWcHW9';
const YT_VOL2 = 'https://youtu.be/jJbr4tzIGBI?si=z8bzb9qdaA46kNKX';

function SkeletonRow() {
  return (
    <div className="songItem songItemSkeleton" aria-hidden="true">
      <div className="skCircle" />
      <span className="songName skLine w40" />
      <span className="songlistplay skLine w12" />
    </div>
  );
}

function SongList() {
  const { songs, loading } = usePlayer();

  return (
    <div className="songList">
      <div className="songListHeader">
        <div className="songListHeaderText">
          <h1>Best Trending Hits</h1>
          <p className="songListSubtitle">Your Favourite Music is Here</p>
        </div>
        <div className="playlistYtLinks">
          <a
            href={YT_VOL1}
            target="_blank"
            rel="noopener noreferrer"
            className="playlistYtBtn"
            title="Watch NCS Mix Vol.1 on YouTube"
          >
            <i className="fab fa-youtube" />
            <span>NCS Mix Vol.1</span>
          </a>
          <a
            href={YT_VOL2}
            target="_blank"
            rel="noopener noreferrer"
            className="playlistYtBtn playlistYtBtn2"
            title="Watch NCS Mix Vol.2 on YouTube"
          >
            <i className="fab fa-youtube" />
            <span>NCS Mix Vol.2</span>
          </a>
        </div>
      </div>
      <div className="songItemContainer">
        {loading
          ? [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
          : songs.map((song, index) => (
              <SongItem key={song.id} song={song} index={index} />
            ))}
      </div>
    </div>
  );
}

export default SongList;
