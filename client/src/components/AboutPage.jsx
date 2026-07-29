function AboutPage() {
  return (
    <div className="container pageContainer">
      <div className="pageContent">
        <h1 className="pageTitle">About Spotify</h1>
        <div className="aboutCard">
          <img src="/logo.png" alt="Spotify" className="aboutLogo" />
          <p className="aboutDesc">
            This is a Spotify clone built with React. Enjoy your favorite NCS (No Copyright
            Sounds) music with a sleek player interface.
          </p>
        </div>
        <div className="featuresGrid">
          <div className="featureCard">
            <i className="fas fa-play-circle featureIcon"></i>
            <h3>Music Player</h3>
            <p>Play, pause, skip through your favorite tracks</p>
          </div>
          <div className="featureCard">
            <i className="fas fa-sliders-h featureIcon"></i>
            <h3>Volume Control</h3>
            <p>Adjust volume and mute/unmute easily</p>
          </div>
          <div className="featureCard">
            <i className="fas fa-random featureIcon"></i>
            <h3>Shuffle & Repeat</h3>
            <p>Shuffle your playlist or repeat songs</p>
          </div>
          <div className="featureCard">
            <i className="fas fa-search featureIcon"></i>
            <h3>Search</h3>
            <p>Find your favorite songs and artists</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
