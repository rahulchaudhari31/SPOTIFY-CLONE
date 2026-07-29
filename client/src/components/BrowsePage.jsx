import { usePlayer } from '../context/PlayerContext';

const genres = ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Electronic', 'R&B', 'Classical', 'Indie'];

function BrowsePage() {
  const { songs } = usePlayer();

  return (
    <div className="container pageContainer">
      <div className="pageContent">
        <h1 className="pageTitle">Browse</h1>
        <div className="genreGrid">
          {genres.map((genre) => (
            <div key={genre} className="genreCard">
              <div className="genreIcon">
                <i className="fas fa-music"></i>
              </div>
              <span>{genre}</span>
            </div>
          ))}
        </div>
        <h2 className="sectionTitle">All Songs</h2>
        <div className="browseList">
          {songs.map((s) => (
            <div key={s.id} className="browseItem">
              <img src={s.cover} alt={s.title} className="browseCover" />
              <div>
                <p className="browseTitle">{s.title}</p>
                <p className="browseArtist">{s.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrowsePage;
