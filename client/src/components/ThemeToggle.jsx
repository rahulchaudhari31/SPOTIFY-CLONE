import { useEffect, useState } from 'react';
import { getSavedTheme, saveTheme } from '../theme';

function ThemeToggle() {
  const [theme, setTheme] = useState(getSavedTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  const isSalon = theme === 'salon';

  return (
    <button
      className="themeToggle"
      onClick={() => setTheme(isSalon ? 'midnight' : 'salon')}
      title={isSalon ? 'Switch to Midnight theme' : 'Switch to Warm Salon theme'}
      aria-label="Toggle color theme"
    >
      <i className={`fas ${isSalon ? 'fa-moon' : 'fa-sun'}`}></i>
    </button>
  );
}

export default ThemeToggle;
