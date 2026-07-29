function Navbar({ page, setPage }) {
  const links = ['Home', 'Search', 'Browse', 'Library', 'About'];

  return (
    <nav>
      <ul>
        <li className="brand">
          <img src="/logo.png" alt="Spotify" /> Spotify
        </li>
        {links.map((link) => (
          <li
            key={link}
            className={`navLink${page === link ? ' active' : ''}`}
            onClick={() => setPage(link)}
          >
            {link}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
