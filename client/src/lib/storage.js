const KEYS = {
  LIKES: 'tuneify.favorites.v1',
  RECENT: 'tuneify.recentlyPlayed.v1',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export const MAX_RECENT = 20;

export function loadFavorites() {
  return read(KEYS.LIKES, []);
}

export function saveFavorites(favoriteIds) {
  write(KEYS.LIKES, favoriteIds);
}

export function loadRecentlyPlayed() {
  return read(KEYS.RECENT, []);
}

export function saveRecentlyPlayed(entries) {
  write(KEYS.RECENT, entries);
}
