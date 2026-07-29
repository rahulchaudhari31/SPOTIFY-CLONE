import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

function SearchPage() {
  const { songs } = usePlayer();
  const [query, setQuery] = useState('');

  const results = query
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.artist.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="container pageContainer">
      <div className="pageContent">
        <h1 className="pageTitle">Search</h1>
        <input
          type="text"
          className="searchInput"
          placeholder="Search songs or artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <div className="searchResults">
            {results.length === 0 ? (
              <p className="noResults">No results found</p>
            ) : (
              results.map((s) => (
                <div key={s.id} className="searchItem">
                  <img src={s.cover} alt={s.title} className="searchCover" />
                  <div>
                    <p className="searchTitle">{s.title}</p>
                    <p className="searchArtist">{s.artist}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
