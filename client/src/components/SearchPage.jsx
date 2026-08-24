import { useEffect, useMemo, useState, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://piped-api.garudalinux.org',
  'https://api.piped.projectsegfau.lt',
];

function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function SearchPage() {
  const { songs, playSong, currentSong, isPlaying } = usePlayer();
  const [query, setQuery] = useState('');
  const [ytResults, setYtResults] = useState([]);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'youtube'
  const debouncedQuery = useDebounced(query.trim(), 500);
  const abortRef = useRef(null);

  // Local song filter
  const localResults = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.genre && s.genre.toLowerCase().includes(q))
    );
  }, [songs, debouncedQuery]);

  // YouTube search via Piped API
  useEffect(() => {
    if (!debouncedQuery) {
      setYtResults([]);
      setYtError('');
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setYtLoading(true);
    setYtError('');

    async function trySearch() {
      for (const base of PIPED_INSTANCES) {
        try {
          const res = await fetch(
            `${base}/search?q=${encodeURIComponent(debouncedQuery)}&filter=music_songs`,
            { signal }
          );
          if (!res.ok) continue;
          const data = await res.json();
          const items = (data.items || [])
            .filter(i => i.type === 'stream' || i.url?.startsWith('/watch'))
            .slice(0, 15)
            .map(i => ({
              ytVideoId: i.url?.replace('/watch?v=', '') || i.videoId,
              title: i.title,
              artist: i.uploaderName || i.uploader || 'YouTube',
              cover: i.thumbnail,
              duration: i.duration > 0
                ? `${Math.floor(i.duration / 60)}:${String(i.duration % 60).padStart(2, '0')}`
                : 'LIVE',
              views: i.views,
            }))
            .filter(i => i.ytVideoId);
          setYtResults(items);
          setYtLoading(false);
          return;
        } catch (e) {
          if (e.name === 'AbortError') { setYtLoading(false); return; }
        }
      }
      setYtError('YouTube search unavailable. Try again.');
      setYtLoading(false);
    }

    trySearch();
    return () => abortRef.current?.abort();
  }, [debouncedQuery]);

  // Play a YouTube search result — inject into songs list temporarily
  function playYtResult(item) {
    const existing = songs.findIndex(s => s.ytVideoId === item.ytVideoId);
    if (existing !== -1) {
      playSong(existing);
      return;
    }
    // Inject as a temporary song at end of list and play it
    const tempSong = {
      id: `yt-search-${item.ytVideoId}`,
      title: item.title,
      artist: item.artist,
      cover: item.cover,
      file: '',
      duration: item.duration,
      ytVideoId: item.ytVideoId,
      genre: 'YouTube',
      isSpecial: false,
    };
    // Use playSong with injected song via window event
    window.__ytSearchPlay = tempSong;
    window.dispatchEvent(new CustomEvent('yt-search-play', { detail: tempSong }));
  }

  const showYt = activeTab === 'youtube' || (activeTab === 'all' && debouncedQuery);

  return (
    <div className="container pageContainer">
      <div className="pageContent">
        <h1 className="pageTitle">Search</h1>

        {/* Search input */}
        <div className="searchBarWrap">
          <i className="fas fa-search searchBarIcon" />
          <input
            type="text"
            className="searchInput"
            placeholder="Search local songs or YouTube..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="searchClearBtn" onClick={() => setQuery('')}>
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        {/* Tabs */}
        {debouncedQuery && (
          <div className="searchTabsRow">
            <button
              className={`searchTabBtn${activeTab === 'all' ? ' searchTabActive' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <i className="fas fa-border-all" /> All
            </button>
            <button
              className={`searchTabBtn${activeTab === 'local' ? ' searchTabActive' : ''}`}
              onClick={() => setActiveTab('local')}
            >
              <i className="fas fa-music" /> Library ({localResults.length})
            </button>
            <button
              className={`searchTabBtn${activeTab === 'youtube' ? ' searchTabActive' : ''}`}
              onClick={() => setActiveTab('youtube')}
            >
              <i className="fab fa-youtube" style={{ color: '#ff4444' }} /> YouTube
            </button>
          </div>
        )}

        {!query.trim() ? (
          <p className="searchHint">Search your library or find any song on YouTube…</p>
        ) : (
          <div className="searchTwoCol">

            {/* ── Local Results ── */}
            {(activeTab === 'all' || activeTab === 'local') && (
              <div className="searchSection">
                {activeTab === 'all' && (
                  <h3 className="searchSectionTitle">
                    <i className="fas fa-music" /> Library
                  </h3>
                )}
                {localResults.length === 0 ? (
                  <p className="noResults">No local results for "{debouncedQuery}"</p>
                ) : (
                  <div className="searchResults">
                    {localResults.map((s) => {
                      const idx = songs.findIndex((x) => x.id === s.id);
                      const isCurrent = currentSong?.id === s.id;
                      return (
                        <div
                          key={s.id}
                          className={`searchItem${isCurrent ? ' activeSearchItem' : ''}`}
                          onClick={() => playSong(idx)}
                        >
                          <img src={s.cover} alt={s.title} className="searchCover" />
                          <div className="searchMeta">
                            <p className="searchTitle">{s.title}</p>
                            <p className="searchArtist">{s.artist}</p>
                          </div>
                          <i className={`fas ${isCurrent && isPlaying ? 'fa-volume-up' : 'fa-play'} searchPlayIcon`} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── YouTube Results ── */}
            {showYt && (
              <div className="searchSection">
                {activeTab === 'all' && (
                  <h3 className="searchSectionTitle">
                    <i className="fab fa-youtube" style={{ color: '#ff4444' }} /> YouTube
                  </h3>
                )}
                {ytLoading ? (
                  <div className="ytSearchLoading">
                    <i className="fas fa-spinner fa-spin" /> Searching YouTube…
                  </div>
                ) : ytError ? (
                  <p className="noResults">{ytError}</p>
                ) : ytResults.length === 0 && debouncedQuery ? (
                  <p className="noResults">No YouTube results</p>
                ) : (
                  <div className="searchResults">
                    {ytResults.map((item) => {
                      const isCurrent = currentSong?.ytVideoId === item.ytVideoId && isPlaying;
                      return (
                        <div
                          key={item.ytVideoId}
                          className={`searchItem ytSearchItem${isCurrent ? ' activeSearchItem' : ''}`}
                          onClick={() => playYtResult(item)}
                        >
                          <div className="ytSearchThumbWrap">
                            <img src={item.cover} alt={item.title} className="searchCover ytSearchCover" />
                            <span className="ytSearchDuration">{item.duration}</span>
                          </div>
                          <div className="searchMeta">
                            <p className="searchTitle">{item.title}</p>
                            <p className="searchArtist">
                              <i className="fab fa-youtube" style={{ color: '#ff4444', marginRight: 4 }} />
                              {item.artist}
                            </p>
                          </div>
                          <i className={`fas ${isCurrent ? 'fa-volume-up' : 'fa-play'} searchPlayIcon`} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
