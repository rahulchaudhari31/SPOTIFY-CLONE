import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import {
   loadFavorites,
   saveFavorites,
   loadRecentlyPlayed,
   saveRecentlyPlayed,
   MAX_RECENT,
 } from '../lib/storage';
import { DEFAULT_SONGS } from '../data/songs';

const PlayerContext = createContext(null);

export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function PlayerProvider({ children }) {
  const [songs, setSongs] = useState(DEFAULT_SONGS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [repeatMode, setRepeatMode] = useState('off');
  const [isShuffled, setIsShuffled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [songDurations, setSongDurations] = useState({});
  const [favoriteIds, setFavoriteIds] = useState(() => loadFavorites());
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => loadRecentlyPlayed());
  const [loading, setLoading] = useState(false);
  const [playbackSource, setPlaybackSource] = useState('audio'); // 'audio' | 'youtube'

  const audioRef = useRef(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    return audio;
  })();
  const currentIndexRef = useRef(0);
  const songsRef = useRef(DEFAULT_SONGS);
  const repeatModeRef = useRef('off');
  const isShuffledRef = useRef(false);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const ytTimerRef = useRef(null);
  const ytReadyRef = useRef(false);
  const volumeRef = useRef(1);
  const isMutedRef = useRef(false);

  volumeRef.current = volume;
  isMutedRef.current = isMuted;

  // Preload first song for instant playback
  useEffect(() => {
    if (songs.length > 0 && songs[0].file) {
      audioRef.current.src = songs[0].file;
      audioRef.current.load();
    }
  }, [songs]);

  // Initialize Web Audio API for visualizer
  const ensureAudioGraph = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx || !audioRef.current) return null;
      try {
        const ctx = new AudioCtx();
        const source = ctx.createMediaElementSource(audioRef.current);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.82;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        audioCtxRef.current = ctx;
        analyserRef.current = analyser;
      } catch (err) {
        console.warn('AudioContext init note:', err);
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return analyserRef.current;
  }, []);

  currentIndexRef.current = currentIndex;
  songsRef.current = songs;
  repeatModeRef.current = repeatMode;
  isShuffledRef.current = isShuffled;

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initYTPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        initYTPlayer();
      };
    }

    function initYTPlayer() {
      if (ytPlayerRef.current) return;
      const el = document.getElementById('global-yt-player');
      if (!el) return;
      ytPlayerRef.current = new window.YT.Player('global-yt-player', {
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            ytReadyRef.current = true;
          },
          onStateChange: (e) => {
            const YTState = window.YT?.PlayerState;
            if (YTState && e.data === YTState.PLAYING) {
              setIsPlaying(true);
            } else if (YTState && e.data === YTState.PAUSED) {
              setIsPlaying(false);
            } else if (YTState && e.data === YTState.ENDED) {
              handleNextRef.current?.();
            }
          },
        },
      });
    }

    return () => {
      clearInterval(ytTimerRef.current);
    };
  }, []);

  // Fetch songs list from server (optional backend enhancement)
  useEffect(() => {
    fetch('/api/songs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSongs(data);
          songsRef.current = data;
        }
      })
      .catch(() => {
        // Standalone mode / Vercel fallback - already initialized with DEFAULT_SONGS
      })
      .finally(() => setLoading(false));
  }, []);

  // Listen to HTML5 Audio events
  useEffect(() => {
    const audio = audioRef.current;
    const onTimeUpdate = () => {
      if (playbackSource === 'audio') {
        setCurrentTime(audio.currentTime);
      }
    };
    const onLoadedMetadata = () => {
      if (playbackSource === 'audio') {
        setDuration(audio.duration);
        setSongDurations((prev) => ({
          ...prev,
          [currentIndexRef.current]: audio.duration,
        }));
      }
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [playbackSource]);

  // Sync volume with both Audio and YouTube player
  useEffect(() => {
    const audio = audioRef.current;
    const effVol = isMuted ? 0 : volume;
    audio.volume = effVol;
    if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      if (isMuted) {
        ytPlayerRef.current.mute();
      } else {
        ytPlayerRef.current.unMute();
        ytPlayerRef.current.setVolume(Math.round(volume * 100));
      }
    }
  }, [volume, isMuted]);

  useEffect(() => {
    saveFavorites(favoriteIds);
  }, [favoriteIds]);

  useEffect(() => {
    saveRecentlyPlayed(recentlyPlayed);
  }, [recentlyPlayed]);

  const currentSongId = songs[currentIndex]?.id ?? null;

  useEffect(() => {
    if (currentSongId == null) return;
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((e) => e.id !== currentSongId);
      return [{ id: currentSongId, playedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT);
    });
  }, [currentSongId]);

  const toggleFavorite = useCallback((songId) => {
    setFavoriteIds((prev) => {
      if (prev.includes(songId)) {
        return prev.filter((id) => id !== songId);
      }
      return [songId, ...prev];
    });
  }, []);

  const isFavorite = useCallback((songId) => favoriteIds.includes(songId), [favoriteIds]);

  // Timer for tracking YouTube playback progress
  const startYtProgressTracking = useCallback(() => {
    clearInterval(ytTimerRef.current);
    ytTimerRef.current = setInterval(() => {
      if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
        try {
          const cur = ytPlayerRef.current.getCurrentTime() || 0;
          const dur = ytPlayerRef.current.getDuration() || 0;
          setCurrentTime(cur);
          if (dur > 0) setDuration(dur);
        } catch (_) {}
      }
    }, 400);
  }, []);

  // Primary play function handling both local audio & YouTube in-app audio
  const playSong = useCallback((index) => {
    const list = songsRef.current;
    const targetSong = list[index];
    if (!targetSong) return;

    const audio = audioRef.current;
    const isSameSong = index === currentIndexRef.current;

    // Direct YouTube Audio Stream
    if (!targetSong.file && targetSong.ytVideoId) {
      // Pause local audio
      audio.pause();
      setPlaybackSource('youtube');

      if (isSameSong && isPlaying) {
        if (ytPlayerRef.current?.pauseVideo) ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
        clearInterval(ytTimerRef.current);
        return;
      }

      if (isSameSong && ytPlayerRef.current?.playVideo) {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
        startYtProgressTracking();
        return;
      }

      setCurrentIndex(index);
      setCurrentTime(0);

      const loadAndPlayYt = () => {
        if (ytPlayerRef.current?.loadVideoById) {
          ytPlayerRef.current.loadVideoById(targetSong.ytVideoId);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          startYtProgressTracking();
        } else {
          setTimeout(loadAndPlayYt, 200);
        }
      };
      loadAndPlayYt();
      return;
    }

    // HTML5 Audio
    if (ytPlayerRef.current?.pauseVideo) {
      try { ytPlayerRef.current.pauseVideo(); } catch (_) {}
    }
    clearInterval(ytTimerRef.current);
    setPlaybackSource('audio');

    if (isSameSong && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    if (isSameSong) {
      ensureAudioGraph();
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      return;
    }

    audio.src = targetSong.file;
    audio.currentTime = 0;
    ensureAudioGraph();
    audio.play().then(() => {
      setCurrentIndex(index);
      setIsPlaying(true);
    }).catch(() => {
      // If audio file doesn't exist locally, fallback to YouTube video stream seamlessly!
      if (targetSong.ytVideoId && ytPlayerRef.current?.loadVideoById) {
        setPlaybackSource('youtube');
        ytPlayerRef.current.loadVideoById(targetSong.ytVideoId);
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
        startYtProgressTracking();
      }
    });
  }, [ensureAudioGraph, isPlaying, startYtProgressTracking]);

  const togglePlay = useCallback(() => {
    const list = songsRef.current;
    if (list.length === 0) return;
    const current = list[currentIndexRef.current];

    if (playbackSource === 'youtube' || (!current?.file && current?.ytVideoId)) {
      if (isPlaying) {
        ytPlayerRef.current?.pauseVideo?.();
        setIsPlaying(false);
        clearInterval(ytTimerRef.current);
      } else {
        if (!ytPlayerRef.current) {
          playSong(currentIndexRef.current);
        } else {
          ytPlayerRef.current?.playVideo?.();
          setIsPlaying(true);
          startYtProgressTracking();
        }
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio.src) {
      playSong(0);
      return;
    }
    if (audio.paused) {
      ensureAudioGraph();
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [ensureAudioGraph, isPlaying, playbackSource, playSong, startYtProgressTracking]);

  const handleNextRef = useRef(null);

  const handleNext = useCallback(() => {
    const list = songsRef.current;
    if (list.length === 0) return;
    let nextIndex;
    if (repeatModeRef.current === 'one') {
      nextIndex = currentIndexRef.current;
    } else if (isShuffledRef.current) {
      do {
        nextIndex = Math.floor(Math.random() * list.length);
      } while (nextIndex === currentIndexRef.current && list.length > 1);
    } else {
      nextIndex = currentIndexRef.current >= list.length - 1 ? 0 : currentIndexRef.current + 1;
    }
    playSong(nextIndex);
  }, [playSong]);

  handleNextRef.current = handleNext;

  useEffect(() => {
    const audio = audioRef.current;
    const onEnded = () => handleNext();
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [handleNext]);

  const handlePrevious = useCallback(() => {
    const list = songsRef.current;
    if (list.length === 0) return;
    let prevIndex;
    if (isShuffledRef.current) {
      do {
        prevIndex = Math.floor(Math.random() * list.length);
      } while (prevIndex === currentIndexRef.current && list.length > 1);
    } else {
      prevIndex = currentIndexRef.current <= 0 ? list.length - 1 : currentIndexRef.current - 1;
    }
    playSong(prevIndex);
  }, [playSong]);

  const seek = useCallback((time) => {
    if (playbackSource === 'youtube') {
      if (ytPlayerRef.current?.seekTo) {
        ytPlayerRef.current.seekTo(time, true);
        setCurrentTime(time);
      }
    } else {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, [playbackSource]);

  const setVolume = useCallback((val) => {
    setVolumeState(val);
    if (val > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => !prev);
  }, []);

  const reorderSongs = useCallback((fromIndex, toIndex) => {
    const prev = songsRef.current;
    if (
      fromIndex === toIndex ||
      fromIndex < 0 || toIndex < 0 ||
      fromIndex >= prev.length || toIndex >= prev.length
    ) return;
    const next = [...prev];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    const curId = prev[currentIndexRef.current]?.id ?? null;
    songsRef.current = next;
    setSongs(next);
    if (curId != null) {
      const ni = next.findIndex((s) => s.id === curId);
      if (ni >= 0) {
        currentIndexRef.current = ni;
        setCurrentIndex(ni);
      }
    }
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const currentSong = songs[currentIndex] || null;

  const value = {
    songs,
    loading,
    currentSong,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatMode,
    isShuffled,
    isMuted,
    playbackSource,
    songDurations,
    playSong,
    togglePlay,
    ensureAudioGraph,
    analyserRef,
    playNext: handleNext,
    playPrevious: handlePrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    reorderSongs,
    favoriteIds,
    recentlyPlayed,
    toggleFavorite,
    isFavorite,
  };

  return (
    <PlayerContext.Provider value={value}>
      {/* Hidden global YouTube player container for seamless in-app audio */}
      <div style={{ position: 'fixed', bottom: -9999, left: -9999, width: 1, height: 1, pointerEvents: 'none', opacity: 0 }}>
        <div id="global-yt-player"></div>
      </div>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
