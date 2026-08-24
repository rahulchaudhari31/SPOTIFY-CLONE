import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { usePlayer } from '../context/PlayerContext';

function Navbar({ page, setPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: 'Home', icon: 'fa-house' },
    { name: 'Search', icon: 'fa-magnifying-glass' },
    { name: 'Browse', icon: 'fa-compass' },
    { name: 'Library', icon: 'fa-layer-group' },
    { name: 'About', icon: 'fa-circle-info' },
  ];

  const { songs, playSong, isPlaying } = usePlayer();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="proNavbar">
      <ul className="proNavList">
        <li className="brand" onClick={() => setPage('Home')}>
          <div className="brandLogoWrap">
            <img src="/logo.png" alt="Spotify" />
          </div>
          <div className="brandTextWrap">
            <span className="brandTitle">Tuneify</span>
            <span className="brandBadge">PRO</span>
          </div>
        </li>

        <div className={`navLinksContainer ${mobileMenuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <li
              key={link.name}
              className={`navLink${page === link.name ? ' active' : ''}`}
              onClick={() => {
                setPage(link.name);
                closeMobileMenu();
              }}
            >
              <i className={`fas ${link.icon}`} />
              <span>{link.name}</span>
            </li>
          ))}
        </div>

        <li className="navSpacer"></li>

        {/* Quick Stream Launch Badge */}
        <li className="navQuickStreamItem">
          <button
            className="navStreamPill"
            onClick={() => {
              const specialIdx = songs.findIndex((s) => s.isSpecial);
              if (specialIdx !== -1) playSong(specialIdx);
            }}
            title="Launch 24/7 NCS Live Stream in App"
          >
            <span className="navLiveDot" />
            <i className="fab fa-youtube" />
            <span>NCS 24/7 Live</span>
          </button>
        </li>

        <li className="themeToggleItem">
          <ThemeToggle />
        </li>
      </ul>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="mobileMenuOverlay" onClick={closeMobileMenu} />
      )}
    </nav>
  );
}

export default Navbar;
