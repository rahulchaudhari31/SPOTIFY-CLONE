import { useState, useEffect, useRef } from 'react';

// The two YouTube playlists to feature
const FEATURED_PLAYLISTS = [
  {
    id: 'pl1',
    videoId: 'ltyf0PjonQg',
    title: 'NCS Mix Vol.1',
    subtitle: 'No Copyright Sounds — Best of NCS',
    description: 'Epic electronic anthems from NCS. Free forever, sounding legendary.',
    genre: 'Electronic • NCS',
    color: '#1db954',
    gradient: 'linear-gradient(135deg, rgba(29,185,84,0.35) 0%, rgba(11,72,36,0.25) 60%, transparent 100%)',
    emoji: '🎧',
    cover: 'https://img.youtube.com/vi/ltyf0PjonQg/hqdefault.jpg',
  },
  {
    id: 'pl2',
    videoId: 'jJbr4tzIGBI',
    title: 'NCS Mix Vol.2',
    subtitle: 'No Copyright Sounds — Premium Beats',
    description: 'The finest NCS selection — uplifting melodies and driving basslines.',
    genre: 'Electronic • Chill',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.35) 0%, rgba(45,20,90,0.25) 60%, transparent 100%)',
    emoji: '🎵',
    cover: 'https://img.youtube.com/vi/jJbr4tzIGBI/hqdefault.jpg',
  },
];

export default function YouTubeAudioSection() {
  const [activeId, setActiveId]       = useState(null);  // which playlist is loaded
  const [ytReady, setYtReady]         = useState(false);
  const [playing, setPlaying]         = useState(false);
  const [progress, setProgress]       = useState(0);
  const [duration, setDuration]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume]           = useState(80);
  const [muted, setMuted]             = useState(false);
  const [videoTitle, setVideoTitle]   = useState('');

  const playerRef    = useRef(null);   // YT.Player instance
  const containerRef = useRef(null);   // hidden iframe container
  const intervalRef  = useRef(null);

  // ---- Load YouTube IFrame API once ----
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setYtReady(true);
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => setYtReady(true);
    return () => { window.onYouTubeIframeAPIReady = null; };
  }, []);

  // ---- Create / swap YT Player ----
  function loadPlaylist(pl) {
    if (activeId === pl.id && playerRef.current) {
      // Toggle play/pause
      if (playing) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      return;
    }

    setActiveId(pl.id);
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setVideoTitle('');
    clearInterval(intervalRef.current);

    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    // Small delay to let destroy complete
    setTimeout(() => {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: pl.videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(volume);
            e.target.playVideo();
          },
          onStateChange: (e) => {
            const YT = window.YT.PlayerState;
            if (e.data === YT.PLAYING) {
              setPlaying(true);
              try { setVideoTitle(e.target.getVideoData()?.title || ''); } catch (_) {}
              startProgressTimer();
            } else if (e.data === YT.PAUSED) {
              setPlaying(false);
              clearInterval(intervalRef.current);
            } else if (e.data === YT.ENDED) {
              setPlaying(false);
              setProgress(0);
              clearInterval(intervalRef.current);
            }
          },
        },
      });
    }, 80);
  }

  function startProgressTimer() {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      try {
        const cur = playerRef.current.getCurrentTime() || 0;
        const dur = playerRef.current.getDuration()    || 0;
        setCurrentTime(cur);
        setDuration(dur);
        setProgress(dur > 0 ? (cur / dur) * 100 : 0);
      } catch (_) {}
    }, 500);
  }

  useEffect(() => () => clearInterval(intervalRef.current), []);

  function handleSeek(e) {
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    playerRef.current.seekTo(pct * duration, true);
    setCurrentTime(pct * duration);
    setProgress(pct * 100);
  }

  function handleVolumeChange(e) {
    const val = parseInt(e.target.value);
    setVolume(val);
    setMuted(val === 0);
    if (playerRef.current) playerRef.current.setVolume(val);
  }

  function toggleMute() {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(volume || 80);
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  }

  function skipForward() {
    if (!playerRef.current) return;
    playerRef.current.seekTo((currentTime + 10), true);
  }
  function skipBack() {
    if (!playerRef.current) return;
    playerRef.current.seekTo(Math.max(0, currentTime - 10), true);
  }

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  }

  const activePl = FEATURED_PLAYLISTS.find(p => p.id === activeId);

  return (
    <div className="ytSection">
      {/* Section header */}
      <div className="ytSectionHeader">
        <span className="ytSectionBadge">
          <i className="fab fa-youtube" /> Featured Playlists
        </span>
        <p className="ytSectionDesc">Stream NCS playlists directly — audio only, no ads</p>
      </div>

      {/* Playlist cards */}
      <div className="ytPlaylistCards">
        {FEATURED_PLAYLISTS.map((pl) => {
          const isActive  = activeId === pl.id;
          const isPlaying = isActive && playing;
          return (
            <div
              key={pl.id}
              className={`ytCard${isActive ? ' ytCardActive' : ''}`}
              style={{ '--card-color': pl.color, '--card-gradient': pl.gradient }}
            >
              {/* Cover art */}
              <div className="ytCardCover">
                <img src={pl.cover} alt={pl.title} className="ytCardImg" />
                <div className="ytCardOverlay" style={{ background: pl.gradient }} />
                {isActive && (
                  <div className="ytCardPlayingBars">
                    <span /><span /><span /><span />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="ytCardBody">
                <span className="ytCardGenre">{pl.emoji} {pl.genre}</span>
                <h3 className="ytCardTitle">{pl.title}</h3>
                <p className="ytCardSubtitle">{pl.subtitle}</p>
                <p className="ytCardDesc">{pl.description}</p>

                {/* Play button */}
                <button
                  className="ytCardPlayBtn"
                  style={{ background: pl.color }}
                  onClick={() => ytReady && loadPlaylist(pl)}
                  disabled={!ytReady}
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                  {isPlaying ? 'Pause' : 'Play in App'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline Audio Player — shown when a playlist is active */}
      {activeId && (
        <div
          className="ytInlinePlayer"
          style={{ '--pl-color': activePl?.color || '#1db954' }}
        >
          {/* Hidden YouTube iframe — audio only (video hidden via CSS) */}
          <div className="ytHiddenFrame">
            <div ref={containerRef} id="yt-hidden-player" />
          </div>

          {/* Audio control UI */}
          <div className="ytInlineLeft">
            <img
              src={activePl?.cover}
              alt={activePl?.title}
              className="ytInlineCover"
            />
            <div className="ytInlineMeta">
              <span className="ytInlineTitle">{videoTitle || activePl?.title}</span>
              <span className="ytInlineSource">
                <i className="fab fa-youtube" /> YouTube Audio Stream
              </span>
            </div>
          </div>

          <div className="ytInlineCenter">
            {/* Controls row */}
            <div className="ytInlineControls">
              <button className="ytCtrlBtn" onClick={skipBack} title="Back 10s">
                <i className="fas fa-rotate-left" />
                <span className="ytSkipLabel">10</span>
              </button>
              <button
                className="ytCtrlPlayBtn"
                onClick={() => playing
                  ? playerRef.current?.pauseVideo()
                  : playerRef.current?.playVideo()
                }
                title={playing ? 'Pause' : 'Play'}
              >
                <i className={`fas ${playing ? 'fa-pause' : 'fa-play'}`} />
              </button>
              <button className="ytCtrlBtn" onClick={skipForward} title="Forward 10s">
                <i className="fas fa-rotate-right" />
                <span className="ytSkipLabel">10</span>
              </button>
            </div>

            {/* Progress bar */}
            <div className="ytProgressArea">
              <span className="ytTime">{fmt(currentTime)}</span>
              <div className="ytProgressTrack" onClick={handleSeek} title="Seek">
                <div className="ytProgressRail">
                  <div
                    className="ytProgressFill"
                    style={{ width: `${progress}%`, background: activePl?.color }}
                  />
                  <div
                    className="ytProgressThumb"
                    style={{ left: `${progress}%`, background: activePl?.color }}
                  />
                </div>
              </div>
              <span className="ytTime">{fmt(duration)}</span>
            </div>
          </div>

          <div className="ytInlineRight">
            <i
              className={`fas ${muted || volume === 0 ? 'fa-volume-xmark' : volume < 50 ? 'fa-volume-low' : 'fa-volume-high'} ytVolIcon`}
              onClick={toggleMute}
              title="Toggle Mute"
            />
            <input
              type="range"
              className="ytVolSlider"
              min="0" max="100"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              title="Volume"
            />
            <a
              href={`https://youtu.be/${activePl?.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ytOpenLink"
              title="Open in YouTube"
            >
              <i className="fab fa-youtube" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
