import SongList from './SongList';
import SongBanner from './SongBanner';

function HomePage() {
  return (
    <div className="container">
      <SongList />
      <SongBanner />
    </div>
  );
}

export default HomePage;
