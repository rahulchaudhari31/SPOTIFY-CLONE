import { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

function KeyboardShortcuts() {
  const {
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    seek,
    volume,
    isMuted,
    setVolume,
    toggleMute,
    currentSong,
    toggleFavorite,
  } = usePlayer();

  useEffect(() => {
    const state = {
      get currentTime() { return currentTime; },
      get duration() { return duration; },
      get volume() { return volume; },
      get isMuted() { return isMuted; },
      get hasSong() { return Boolean(currentSong); },
    };
    void state;

    function onKeyDown(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target;
      if (isTypingTarget(target)) {
        if (e.code === 'Space' && target.tagName === 'BUTTON') return;
        return;
      }
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight': {
          e.preventDefault();
          const max = Number.isFinite(duration) ? duration : Infinity;
          seek(Math.min(currentTime + 5, max));
          break;
        }
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(currentTime - 5, 0));
          break;
        case 'ArrowUp': {
          e.preventDefault();
          setVolume(Math.min(volume + 0.05, 1));
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const next = Math.max(volume - 0.05, 0);
          setVolume(next);
          if (next === 0 && !isMuted) toggleMute();
          break;
        }
        case 'KeyL':
          if (!e.shiftKey && currentSong) {
            toggleFavorite(currentSong.id);
          }
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleFavorite,
    currentTime,
    duration,
    volume,
    isMuted,
    currentSong,
    isPlaying,
  ]);

  return null;
}

export default KeyboardShortcuts;
