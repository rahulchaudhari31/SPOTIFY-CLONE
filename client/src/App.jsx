import { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import BrowsePage from './components/BrowsePage';
import LibraryPage from './components/LibraryPage';
import AboutPage from './components/AboutPage';
import Player from './components/Player';

function App() {
  const [page, setPage] = useState('Home');

  function renderPage() {
    switch (page) {
      case 'Home': return <HomePage />;
      case 'Search': return <SearchPage />;
      case 'Browse': return <BrowsePage />;
      case 'Library': return <LibraryPage />;
      case 'About': return <AboutPage />;
      default: return <HomePage />;
    }
  }

  return (
    <PlayerProvider>
      <Navbar page={page} setPage={setPage} />
      {renderPage()}
      <Player />
    </PlayerProvider>
  );
}

export default App;
