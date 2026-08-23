import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';
import BrowsePage from './components/BrowsePage';
import LibraryPage from './components/LibraryPage';
import AboutPage from './components/AboutPage';
import Player from './components/Player';
import DynamicBackground from './components/DynamicBackground';

const pageVariants = {
  initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -16, filter: 'blur(6px)' },
};

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
      <DynamicBackground />
      <Navbar page={page} setPage={setPage} />
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          className="pageMotionWrapper"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.32, ease: [0.22, 0.9, 0.3, 1] }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <Player />
    </PlayerProvider>
  );
}

export default App;
