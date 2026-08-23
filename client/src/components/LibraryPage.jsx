import { usePlayer } from '../context/PlayerContext';
import LikeButton from './LikeButton';

function LibraryPage() {
  const { songs, currentSong, playSong, favoriteIds, recentlyPlayed } = usePlayer();

  const likedSongs = favoriteIds
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean);

  const recentSongs = recentlyPlayed
    .map((entry) => ({ entry, song: songs.find((s) => s.id === entry.id) }))
    .filter(({ song }) => Boolean(song));

  function globalIndexOf(songId) {
    return songs.findIndex((s) => s.id === songId);
  }

  return (
    <div className="container pageContainer">
      <div className="pageContent">
        <h1 className="pageTitle">Your Library</h1>
        {currentSong && (
          <div className="nowPlayingCard">
            <h3>Now Playing</h3>
            <div className="nowPlayingRow">
              <img src={currentSong.cover} alt={currentSong.title} className="npCover" />
              <div>
                <p className="npTitle">{currentSong.title}</p>
                <p className="npArtist">{currentSong.artist}</p>
              </div>
              <LikeButton songId={currentSong.id} />
            </div>
          </div>
        )}

        <h2 className="sectionTitle">
          <i className="fas fa-heart sectionIcon"></i> Liked Songs ({likedSongs.length})
        </h2>
        {likedSongs.length === 0 ? (
          <p className="emptySectionMsg">
            Nothing here yet — tap the heart on any song to save it.
          </p>
        ) : (
          <div className="libraryList">
            {likedSongs.map((s) => {
              const gi = globalIndexOf(s.id);
              return (
                <div key={s.id} className="libraryItem" onClick={() => playSong(gi)}>
                  <span className="libIndex">
                    <i className={`fas ${currentSong?.id === s.id ? 'fa-volume-up libPlaying' : 'fa-heart'}`}></i>
                  </span>
                  <img src={s.cover} alt={s.title} className="libCover" />
                  <div>
                    <p className="libTitle">{s.title}</p>
                    <p className="libArtist">{s.artist}</p>
                  </div>
                  <LikeButton songId={s.id} className="libLike" />
                </div>
              );
            })}
          </div>
        )}

        <h2 className="sectionTitle">
          <i className="fas fa-history sectionIcon"></i> Recently Played ({recentSongs.length})
        </h2>
        {recentSongs.length === 0 ? (
          <p className="emptySectionMsg">Play something and it will show up here.</p>
        ) : (
          <div className="libraryList">
            {recentSongs.map(({ song, entry }) => {
              const gi = globalIndexOf(song.id);
              const isCurrent = currentSong?.id === song.id;
              return (
                <div key={`${song.id}-${entry.playedAt}`} className="libraryItem" onClick={() => playSong(gi)}>
                  <span className="libIndex">{isCurrent ? <i className="fas fa-volume-up libPlaying"></i> : ''}</span>
                  <img src={song.cover} alt={song.title} className="libCover" />
                  <div>
                    <p className="libTitle">{song.title}</p>
                    <p className="libArtist">{song.artist}</p>
                  </div>
                  <LikeButton songId={song.id} className="libLike" />
                </div>
              );
            })}
          </div>
        )}

        <h2 className="sectionTitle">All Songs ({songs.length})</h2>
        <div className="libraryList">
          {songs.map((s, i) => (
            <div key={s.id} className="libraryItem" onClick={() => playSong(i)}>
              <span className="libIndex">{i + 1}</span>
              <img src={s.cover} alt={s.title} className="libCover" />
              <div>
                <p className="libTitle">{s.title}</p>
                <p className="libArtist">{s.artist}</p>
              </div>
              <LikeButton songId={s.id} className="libLike" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LibraryPage;
