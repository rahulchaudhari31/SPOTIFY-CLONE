import { useEffect, useMemo, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

function useDebounced(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return [debounced, debounced !== value];
}

function SearchPage() {
  const { songs, playSong, currentSong } = usePlayer();
  const [query, setQuery] = useState('');
  const [debouncedQuery, isPending] = useDebounced(query.trim(), 200);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q)
    );
  }, [songs, debouncedQuery]);

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
          autoFocus
        />
        {!query.trim() ? (
          <p className="searchHint">Start typing to filter by title or artist…</p>
        ) : isPending ? (
          <p className="noResults">Searching…</p>
        ) : (
          <div className="searchResults">
            {results.length === 0 ? (
              <p className="noResults">No results found for “{debouncedQuery}”</p>
            ) : (
              results.map((s) => (
                <div
                  key={s.id}
                  className={`searchItem${currentSong?.id === s.id ? ' activeSearchItem' : ''}`}
                  onClick={() => playSong(songs.findIndex((x) => x.id === s.id))}
                >
                  <img src={s.cover} alt={s.title} className="searchCover" />
                  <div>
                    <p className="searchTitle">{s.title}</p>
                    <p className="searchArtist">{s.artist}</p>
                  </div>
                  <i
                    className={`fas ${currentSong?.id === s.id ? 'fa-volume-up' : 'fa-play'} searchPlayIcon`}
                  ></i>
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
