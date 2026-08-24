import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer, formatTime } from '../context/PlayerContext';
import LikeButton from './LikeButton';
import SongBanner from './SongBanner';

export default function ProDashboard() {
  const {
    songs,
    loading,
    currentSong,
    currentIndex,
    isPlaying,
    playSong,
    togglePlay,
    songDurations,
    favoriteIds,
    isFavorite,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // All live YouTube stream songs (special stations + yt tracks)
  const proStations = songs.filter((s) => s.isSpecial || (!s.file && s.ytVideoId));

  // Filtered tracks based on active tab & search
  const filteredSongs = songs.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.genre && s.genre.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'liked') return favoriteIds.includes(s.id);
    if (activeTab === 'special') return s.isSpecial;
    if (activeTab === 'youtube') return !s.isSpecial && !s.file && s.ytVideoId;
    if (activeTab === 'ncs') return s.genre?.includes('NCS') || s.genre?.includes('Electronic') || s.genre?.includes('Trap');
    if (activeTab === 'gaming') return s.genre?.includes('Gaming') || s.genre?.includes('Bass') || s.genre?.includes('Dubstep');
    if (activeTab === 'chill') return s.genre?.includes('Chill') || s.genre?.includes('Lo-Fi') || s.genre?.includes('Melody');
    if (activeTab === 'classics') return !s.isSpecial && s.file;
    return true;
  });

  const likedCount = favoriteIds.length;

  const categories = [
    { id: 'all',      label: 'All Tracks',         icon: 'fa-border-all' },
    { id: 'liked',    label: `Liked Songs${likedCount ? ` (${likedCount})` : ''}`, icon: 'fa-heart' },
    { id: 'special',  label: 'Pro Stations',        icon: 'fa-bolt' },
    { id: 'youtube',  label: 'YouTube Streams',     icon: 'fa-play-circle' },
    { id: 'ncs',      label: 'Electronic / EDM',    icon: 'fa-compact-disc' },
    { id: 'gaming',   label: 'Gaming Bass',         icon: 'fa-gamepad' },
    { id: 'chill',    label: 'Lo-Fi / Chill',       icon: 'fa-spa' },
    { id: 'classics', label: 'Local Tracks',        icon: 'fa-music' },
  ];

  return (
    <div className="proDashboardWrapper">
      {/* Top Pro Banner Bar */}
      <div className="proHeroHeader">
        <div className="proHeroGlow" />
        <div className="proHeroContent">
          <div className="proBadgeGroup">
            <span className="proVipBadge">
              <i className="fas fa-crown" /> TUNEIFY PRO STUDIO
            </span>
            <span className="proLivePill">
              <span className="liveDot" /> DIRECT IN-APP AUDIO
            </span>
            <span className="proLosslessPill">
              <i className="fas fa-wave-square" /> 320 KBPS HI-RES
            </span>
          </div>

          <h1 className="proHeroTitle">
            Unlimited Music & Live YouTube Streams
          </h1>
          <p className="proHeroSubtitle">
            Stream continuous NCS playlists, gaming bass drops, cyber synthwaves, and original hits — with zero video lag and full player controls.
          </p>

          {/* Search bar inside Hero */}
          <div className="proHeroSearchWrap">
            <i className="fas fa-search proSearchIcon" />
            <input
              type="text"
              placeholder="Search by title, artist, genre or mood..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="proSearchInput"
            />
            {searchQuery && (
              <button className="proSearchClear" onClick={() => setSearchQuery('')}>
                <i className="fas fa-times" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SPECIAL PRO YOUTUBE STATIONS CAROUSEL / GRID */}
      <div className="proSection">
        <div className="proSectionTitleRow">
          <div className="proSectionTitleLeft">
            <span className="proSectionPretitle">SPECIAL CURATED STATIONS</span>
            <h2 className="proSectionTitle">
              <i className="fab fa-youtube" style={{ color: '#ff3333', marginRight: '8px' }} />
              Live YouTube Audio Streams
            </h2>
          </div>
          <span className="proStationCount">{proStations.length} Stations Available</span>
        </div>

        <div className="proStationScroll">
          {proStations.map((station) => {
            const isCurrent = currentSong?.id === station.id;
            const isThisPlaying = isCurrent && isPlaying;
            const songIdx = songs.findIndex((s) => s.id === station.id);

            return (
              <motion.div
                key={station.id}
                className={`proStationCard ${isCurrent ? 'stationActive' : ''}`}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => playSong(songIdx)}
              >
                <div className="stationCoverWrap">
                  <img src={station.cover} alt={station.title} className="stationCover" />
                  <div className="stationCoverGradient" />
                  <span className="stationTagBadge">{station.tag || 'LIVE'}</span>

                  <button
                    className={`stationPlayBtn ${isThisPlaying ? 'btnPlaying' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(songIdx);
                    }}
                    title={isThisPlaying ? 'Pause' : 'Play Direct Audio'}
                  >
                    <i className={`fas ${isThisPlaying ? 'fa-pause' : 'fa-play'}`} />
                  </button>

                  {isThisPlaying && (
                    <div className="stationWaveBars">
                      <span /><span /><span /><span />
                    </div>
                  )}
                </div>

                <div className="stationInfo">
                  <span className="stationGenre">{station.genre}</span>
                  <h3 className="stationTitle">{station.title}</h3>
                  <div className="stationFooter">
                    <p className="stationArtist">{station.artist}</p>
                    <LikeButton songId={station.id} className="stationLikeBtn" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CATEGORY TABS & TRACKLIST + BANNER CONTAINER */}
      <div className="proSection">
        <div className="categoryTabsBar">
          <div className="categoryTabsList">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`catTabBtn ${activeTab === cat.id ? 'catActive' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                <i className={`fas ${cat.icon}`} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="proMainTwoCol">
          {/* Track List Panel */}
          <div className="proTrackListPanel">
            <div className="trackListPanelHeader">
              <span className="colHeaderTitle"># Track Title</span>
              <span className="colHeaderGenre">Genre</span>
              <span className="colHeaderAction">Play / Time</span>
            </div>

            <div className="proTrackList">
              {loading ? (
                <div className="loadingSpinnerWrap">
                  <i className="fas fa-spinner fa-spin" /> Loading library...
                </div>
              ) : filteredSongs.length === 0 && activeTab === 'liked' ? (
                <div className="emptyResultsWrap">
                  <i className="fas fa-heart" style={{ color: '#ff6b6b', fontSize: '2rem' }} />
                  <p>No liked songs yet</p>
                  <span style={{ fontSize: '0.82rem', color: '#888' }}>Hit the ♥ on any track to save it here</span>
                </div>
              ) : filteredSongs.length === 0 ? (
                <div className="emptyResultsWrap">
                  <i className="fas fa-music-slash" />
                  <p>No tracks found matching "{searchQuery}"</p>
                  <button onClick={() => { setSearchQuery(''); setActiveTab('all'); }} className="clearFilterBtn">
                    View All Tracks
                  </button>
                </div>
              ) : (
                filteredSongs.map((song, i) => {
                  const isCurrent = currentSong?.id === song.id;
                  const isThisPlaying = isCurrent && isPlaying;
                  const actualIndex = songs.findIndex((s) => s.id === song.id);
                  const durationStr = song.duration || formatTime(songDurations[actualIndex]) || '3:30';

                  return (
                    <motion.div
                      key={song.id}
                      className={`proTrackRow ${isCurrent ? 'trackActive' : ''}`}
                      onClick={() => playSong(actualIndex)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Left: Index / Play & Cover */}
                      <div className="trackRowLeft">
                        <span className="trackIndex">
                          {isThisPlaying ? (
                            <i className="fas fa-volume-high liveTrackIcon" />
                          ) : (
                            String(i + 1).padStart(2, '0')
                          )}
                        </span>
                        <div className="trackThumbWrap">
                          <img src={song.cover} alt={song.title} className="trackThumb" />
                          <button
                            className="trackRowPlayBtn"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSong(actualIndex);
                            }}
                          >
                            <i className={`fas ${isThisPlaying ? 'fa-pause' : 'fa-play'}`} />
                          </button>
                        </div>
                        <div className="trackMeta">
                          <span className="trackName">
                            {song.title}
                            {song.isSpecial && (
                              <span className="specialStreamBadge">
                                <i className="fab fa-youtube" /> STREAM
                              </span>
                            )}
                          </span>
                          <span className="trackArtist">{song.artist}</span>
                        </div>
                      </div>

                      {/* Middle: Genre */}
                      <div className="trackRowGenre">
                        <span className="genreTag">{song.genre || 'Music'}</span>
                      </div>

                      {/* Right: Like, Duration, Action */}
                      <div className="trackRowRight">
                        <LikeButton songId={song.id} />
                        <span className="trackDuration">{durationStr}</span>
                        <button
                          className={`proPlayPillBtn ${isThisPlaying ? 'pillPlaying' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            playSong(actualIndex);
                          }}
                        >
                          <i className={`fas ${isThisPlaying ? 'fa-pause' : 'fa-play'}`} />
                          <span>{isThisPlaying ? 'Playing' : 'Play'}</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Side: Now Playing Studio Banner */}
          <div className="proBannerSide">
            <SongBanner />

            {/* Quick Station Jump Card */}
            <div className="quickStationWidget">
              <h4 className="widgetTitle">
                <i className="fas fa-bolt" /> Quick Vibe Stations
              </h4>
              <div className="widgetList">
                {proStations.slice(0, 3).map((st) => {
                  const stIdx = songs.findIndex((s) => s.id === st.id);
                  const isCur = currentSong?.id === st.id && isPlaying;
                  return (
                    <div
                      key={st.id}
                      className="widgetItem"
                      onClick={() => playSong(stIdx)}
                    >
                      <img src={st.cover} alt={st.title} className="widgetThumb" />
                      <div className="widgetMeta">
                        <span className="widgetName">{st.title}</span>
                        <span className="widgetGenre">{st.genre}</span>
                      </div>
                      <button className="widgetPlay">
                        <i className={`fas ${isCur ? 'fa-pause' : 'fa-play'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
