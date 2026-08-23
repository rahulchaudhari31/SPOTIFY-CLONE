export const THEME_KEY = 'tuneify.theme.v1';
export const THEMES = ['midnight', 'salon'];

export function getSavedTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return THEMES.includes(t) ? t : 'midnight';
  } catch {
    return 'midnight';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage unavailable */
  }
}

export function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = 'midnight';
  document.documentElement.setAttribute('data-theme', theme);
}

export function initTheme() {
  applyTheme(getSavedTheme());
}
