import { usePlayer } from '../context/PlayerContext';

function LibraryPage() {
  const { songs, currentSong } = usePlayer();

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
            </div>
          </div>
        )}
        <h2 className="sectionTitle">All Songs ({songs.length})</h2>
        <div className="libraryList">
          {songs.map((s, i) => (
            <div key={s.id} className="libraryItem">
              <span className="libIndex">{i + 1}</span>
              <img src={s.cover} alt={s.title} className="libCover" />
              <div>
                <p className="libTitle">{s.title}</p>
                <p className="libArtist">{s.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LibraryPage;
