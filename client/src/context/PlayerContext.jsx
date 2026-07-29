import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const PlayerContext = createContext(null);

export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function PlayerProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [repeatMode, setRepeatMode] = useState('off');
  const [isShuffled, setIsShuffled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [songDurations, setSongDurations] = useState({});

  const audioRef = useRef(new Audio());
  const currentIndexRef = useRef(0);
  const songsRef = useRef([]);
  const repeatModeRef = useRef('off');
  const isShuffledRef = useRef(false);

  currentIndexRef.current = currentIndex;
  songsRef.current = songs;
  repeatModeRef.current = repeatMode;
  isShuffledRef.current = isShuffled;

  useEffect(() => {
    fetch('/api/songs')
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        songsRef.current = data;
      })
      .catch((err) => console.error('Failed to fetch songs:', err));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setSongDurations((prev) => ({
        ...prev,
        [currentIndexRef.current]: audio.duration,
      }));
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const playSong = useCallback((index) => {
    const list = songsRef.current;
    if (!list[index]) return;
    const audio = audioRef.current;
    if (index === currentIndexRef.current && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    if (index === currentIndexRef.current) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      return;
    }
    audio.src = list[index].file;
    audio.currentTime = 0;
    audio.play().then(() => {
      setCurrentIndex(index);
      setIsPlaying(true);
    }).catch(() => {});
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio.src) {
      playSong(0);
      return;
    }
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [playSong]);

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
    const audio = audioRef.current;
    audio.src = list[nextIndex].file;
    audio.currentTime = 0;
    audio.play().then(() => {
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    }).catch(() => {});
  }, []);

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
    const audio = audioRef.current;
    audio.src = list[prevIndex].file;
    audio.currentTime = 0;
    audio.play().then(() => {
      setCurrentIndex(prevIndex);
      setIsPlaying(true);
    }).catch(() => {});
  }, []);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);

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
    currentSong,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatMode,
    isShuffled,
    isMuted,
    songDurations,
    playSong,
    togglePlay,
    playNext: handleNext,
    playPrevious: handlePrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
