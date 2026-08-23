/* ================================================================
   TUNEIFY — Premium Music Player Script
   ================================================================ */

console.log('%c🎵 Tuneify — Premium Music Player', 'color:#1db954;font-size:14px;font-weight:bold;');

// ---- SONG DATA ----
// Two YouTube playlist links are attached:
//   Vol.1: https://youtu.be/ltyf0PjonQg?si=_2Zyd0NvKHTWcHW9
//   Vol.2: https://youtu.be/jJbr4tzIGBI?si=z8bzb9qdaA46kNKX
//
// Each song below also carries its own YouTube watch URL (ytUrl).
// Songs 1–5  are mapped to Playlist Vol.1
// Songs 6–10 are mapped to Playlist Vol.2

const YT_PLAYLIST_1 = 'https://youtu.be/ltyf0PjonQg?si=_2Zyd0NvKHTWcHW9';
const YT_PLAYLIST_2 = 'https://youtu.be/jJbr4tzIGBI?si=z8bzb9qdaA46kNKX';

const songs = [
  {
    id: 1,
    songName: 'Mortals',
    artist: 'Warriyo ft. Laura Brehm',
    filePath: 'songs/1.mp3',
    coverPath: 'covers/1.jpg',
    ytUrl: YT_PLAYLIST_1,
  },
  {
    id: 2,
    songName: 'Cielo',
    artist: 'Huma-Huma',
    filePath: 'songs/2.mp3',
    coverPath: 'covers/2.jpg',
    ytUrl: YT_PLAYLIST_1,
  },
  {
    id: 3,
    songName: 'Invincible',
    artist: 'DEAF KEV',
    filePath: 'songs/3.mp3',
    coverPath: 'covers/3.jpg',
    ytUrl: YT_PLAYLIST_1,
  },
  {
    id: 4,
    songName: 'My Heart',
    artist: 'Different Heaven & EH!DE',
    filePath: 'songs/4.mp3',
    coverPath: 'covers/4.jpg',
    ytUrl: YT_PLAYLIST_1,
  },
  {
    id: 5,
    songName: 'Heroes Tonight',
    artist: 'Janji ft. Johnning',
    filePath: 'songs/5.mp3',
    coverPath: 'covers/5.jpg',
    ytUrl: YT_PLAYLIST_1,
  },
  {
    id: 6,
    songName: 'Rabba',
    artist: 'Salam-e-Ishq',
    filePath: 'songs/6.mp3',
    coverPath: 'covers/6.jpg',
    ytUrl: YT_PLAYLIST_2,
  },
  {
    id: 7,
    songName: 'Sakhiyaan',
    artist: 'Salam-e-Ishq',
    filePath: 'songs/7.mp3',
    coverPath: 'covers/7.jpg',
    ytUrl: YT_PLAYLIST_2,
  },
  {
    id: 8,
    songName: 'Bhula Dena',
    artist: 'Salam-e-Ishq',
    filePath: 'songs/8.mp3',
    coverPath: 'covers/8.jpg',
    ytUrl: YT_PLAYLIST_2,
  },
  {
    id: 9,
    songName: 'Tumhari Kasam',
    artist: 'Salam-e-Ishq',
    filePath: 'songs/9.mp3',
    coverPath: 'covers/9.jpg',
    ytUrl: YT_PLAYLIST_2,
  },
  {
    id: 10,
    songName: 'Na Jaana',
    artist: 'Salam-e-Ishq',
    filePath: 'songs/10.mp3',
    coverPath: 'covers/10.jpg',
    ytUrl: YT_PLAYLIST_2,
  },
];

// ---- STATE ----
let songIndex = 0;
let audioElement = new Audio();
let isPlaying = false;
let isDragging = false;

// ---- DOM REFS ----
const masterPlay       = document.getElementById('masterPlay');
const progressTrack    = document.getElementById('progressTrack');
const progressFill     = document.getElementById('progressFill');
const progressThumb    = document.getElementById('progressThumb');
const gif              = document.getElementById('gif');
const masterSongName   = document.getElementById('masterSongName');
const masterArtistName = document.getElementById('masterArtistName');
const playerCover      = document.getElementById('playerCover');
const currentTimeEl    = document.getElementById('currentTime');
const totalTimeEl      = document.getElementById('totalTime');
const volumeSlider     = document.getElementById('volumeSlider');
const volIcon          = document.getElementById('volIcon');
const ytMiniBtn        = document.getElementById('ytMiniBtn');
const songItemContainer = document.getElementById('songItemContainer');

// Banner refs
const bannerEmpty      = document.getElementById('bannerEmpty');
const bannerContent    = document.getElementById('bannerContent');
const bannerCoverImg   = document.getElementById('bannerCoverImg');
const bannerGlow       = document.getElementById('bannerGlow');
const bannerTitle      = document.getElementById('bannerTitle');
const bannerArtist     = document.getElementById('bannerArtist');
const bannerPlayBtn    = document.getElementById('bannerPlayBtn');
const bannerPlayIcon   = document.getElementById('bannerPlayIcon');
const bannerPlayText   = document.getElementById('bannerPlayText');
const bannerYtBtn      = document.getElementById('bannerYtBtn');
const nowPlayingLabel  = document.getElementById('nowPlayingLabel');

// YouTube modal refs
const ytModalOverlay   = document.getElementById('ytModalOverlay');
const ytModal          = document.getElementById('ytModal');
const ytModalTitle     = document.getElementById('ytModalTitle');
const ytModalClose     = document.getElementById('ytModalClose');
const ytIframe         = document.getElementById('ytIframe');
const ytModalOpenLink  = document.getElementById('ytModalOpenLink');

// Nav YT badge
const ytPlaylistBtn    = document.getElementById('ytPlaylistBtn');

// ---- HELPERS ----
function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function getYtEmbedId(url) {
  // Extract video ID from youtube URL
  const match = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

// ---- BUILD SONG LIST ----
function buildSongList() {
  songItemContainer.innerHTML = '';
  songs.forEach((song, i) => {
    const div = document.createElement('div');
    div.className = 'songItem';
    div.id = `song-item-${i}`;
    div.innerHTML = `
      <img src="${song.coverPath}" alt="${song.songName}" loading="lazy">
      <span class="songName">${song.songName}</span>
      <span class="song-artist-tag">${song.artist}</span>
      <span class="songlistplay">
        <a href="${song.ytUrl}" target="_blank" class="song-yt-icon" title="Watch on YouTube" onclick="event.stopPropagation()">
          <i class="fab fa-youtube"></i>
        </a>
        <span class="timestamp">
          <i id="play-icon-${i}" class="far songItemPlay fa-play-circle"></i>
        </span>
      </span>
    `;
    div.addEventListener('click', () => {
      if (songIndex === i && isPlaying) {
        pauseAudio();
      } else {
        loadAndPlay(i);
      }
    });
    songItemContainer.appendChild(div);
  });
}

// ---- LOAD AND PLAY ----
function loadAndPlay(index) {
  songIndex = index;
  const song = songs[index];

  // Update audio source
  audioElement.src = song.filePath;
  audioElement.currentTime = 0;

  audioElement.play()
    .then(() => {
      isPlaying = true;
      updatePlayState();
    })
    .catch(err => {
      // Audio may not exist — still update UI so YouTube links work
      console.warn('Audio playback failed (file may not exist):', err);
      isPlaying = false;
    });

  updateSongUI(index);
}

function pauseAudio() {
  audioElement.pause();
  isPlaying = false;
  updatePlayState();
}

function resumeAudio() {
  audioElement.play()
    .then(() => { isPlaying = true; updatePlayState(); })
    .catch(() => {});
}

// ---- UPDATE UI ----
function updateSongUI(index) {
  const song = songs[index];

  // Player bar
  masterSongName.textContent   = song.songName;
  masterArtistName.textContent = song.artist;
  playerCover.src              = song.coverPath;
  playerCover.style.opacity    = '1';

  // YouTube mini button
  ytMiniBtn.href = song.ytUrl;

  // Banner
  bannerEmpty.style.display   = 'none';
  bannerContent.style.display = 'block';
  bannerCoverImg.src          = song.coverPath;
  bannerTitle.textContent     = song.songName;
  bannerArtist.textContent    = song.artist;
  bannerYtBtn.href            = song.ytUrl;

  // Highlight active song in list
  document.querySelectorAll('.songItem').forEach((el, i) => {
    el.classList.toggle('activeSong', i === index);
  });

  // Sync all play icons
  syncPlayIcons();
}

function updatePlayState() {
  // Master play button
  masterPlay.classList.toggle('fa-play-circle', !isPlaying);
  masterPlay.classList.toggle('fa-pause-circle', isPlaying);

  // GIF
  gif.style.opacity = isPlaying ? '1' : '0';

  // Banner play button
  bannerPlayIcon.className = `fas ${isPlaying ? 'fa-pause' : 'fa-play'}`;
  bannerPlayText.textContent = isPlaying ? 'Pause' : 'Play';

  // Now playing label
  nowPlayingLabel.style.opacity = isPlaying ? '1' : '0.6';

  syncPlayIcons();
}

function syncPlayIcons() {
  songs.forEach((_, i) => {
    const icon = document.getElementById(`play-icon-${i}`);
    if (!icon) return;
    const isActive = i === songIndex && isPlaying;
    icon.classList.toggle('fa-pause-circle', isActive);
    icon.classList.toggle('fa-play-circle', !isActive);
  });
}

// ---- EVENTS ----

// Master play/pause
masterPlay.addEventListener('click', () => {
  if (!audioElement.src || audioElement.src === window.location.href) {
    loadAndPlay(0);
    return;
  }
  if (isPlaying) { pauseAudio(); } else { resumeAudio(); }
});

// Banner play button
bannerPlayBtn.addEventListener('click', () => {
  if (isPlaying) { pauseAudio(); } else { resumeAudio(); }
});

// Previous
document.getElementById('previous').addEventListener('click', () => {
  songIndex = songIndex <= 0 ? songs.length - 1 : songIndex - 1;
  loadAndPlay(songIndex);
});

// Next
document.getElementById('next').addEventListener('click', () => {
  songIndex = songIndex >= songs.length - 1 ? 0 : songIndex + 1;
  loadAndPlay(songIndex);
});

// Auto next
audioElement.addEventListener('ended', () => {
  songIndex = songIndex >= songs.length - 1 ? 0 : songIndex + 1;
  loadAndPlay(songIndex);
});

// Time update → progress bar
audioElement.addEventListener('timeupdate', () => {
  if (isDragging) return;
  const pct = audioElement.duration
    ? (audioElement.currentTime / audioElement.duration) * 100
    : 0;
  progressFill.style.width = `${pct}%`;
  progressThumb.style.left = `${pct}%`;
  currentTimeEl.textContent = formatTime(audioElement.currentTime);
});

audioElement.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audioElement.duration);
});

// Progress bar click / drag
progressTrack.addEventListener('click', scrub);
progressTrack.addEventListener('mousedown', (e) => {
  isDragging = true;
  scrub(e);
  progressTrack.classList.add('dragging');
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  scrub(e);
});

document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;
  progressTrack.classList.remove('dragging');
});

function scrub(e) {
  const rail = progressTrack.querySelector('.progress-rail');
  const rect = rail.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  progressFill.style.width = `${pct * 100}%`;
  progressThumb.style.left  = `${pct * 100}%`;
  if (audioElement.duration) {
    audioElement.currentTime = pct * audioElement.duration;
    currentTimeEl.textContent = formatTime(audioElement.currentTime);
  }
}

// Volume
volumeSlider.addEventListener('input', () => {
  const val = parseFloat(volumeSlider.value);
  audioElement.volume = val;
  volIcon.className = val === 0
    ? 'fas fa-volume-mute vol-icon'
    : val < 0.5
    ? 'fas fa-volume-down vol-icon'
    : 'fas fa-volume-up vol-icon';
});

volIcon.addEventListener('click', () => {
  if (audioElement.volume > 0) {
    audioElement.volume = 0;
    volumeSlider.value = 0;
    volIcon.className = 'fas fa-volume-mute vol-icon';
  } else {
    audioElement.volume = 1;
    volumeSlider.value = 1;
    volIcon.className = 'fas fa-volume-up vol-icon';
  }
});

// ---- YOUTUBE MODAL ----
function openYtModal(url, title) {
  const videoId = getYtEmbedId(url);
  if (!videoId) {
    // fallback: open in new tab
    window.open(url, '_blank');
    return;
  }
  ytIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  ytModalTitle.textContent  = title || 'Now Playing on YouTube';
  ytModalOpenLink.href      = url;
  ytModalOverlay.classList.add('open');
}

function closeYtModal() {
  ytModalOverlay.classList.remove('open');
  ytIframe.src = ''; // stop playback
}

ytModalClose.addEventListener('click', closeYtModal);
ytModalOverlay.addEventListener('click', (e) => {
  if (e.target === ytModalOverlay) closeYtModal();
});

// Nav playlist badge opens first playlist in modal
ytPlaylistBtn.addEventListener('click', () => {
  openYtModal(YT_PLAYLIST_1, 'NCS Mix Vol.1 — YouTube Playlist');
});

// Banner YT button → open modal instead of new tab (UX upgrade)
bannerYtBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const song = songs[songIndex];
  openYtModal(song.ytUrl, `${song.songName} — ${song.artist}`);
});

// Player mini YT button → open modal
ytMiniBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const song = songs[songIndex];
  openYtModal(song.ytUrl, `${song.songName} — ${song.artist}`);
});

// ---- KEYBOARD SHORTCUTS ----
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  switch (e.code) {
    case 'Space':
      e.preventDefault();
      masterPlay.click();
      break;
    case 'ArrowRight':
      document.getElementById('next').click();
      break;
    case 'ArrowLeft':
      document.getElementById('previous').click();
      break;
    case 'Escape':
      closeYtModal();
      break;
  }
});

// ---- NAVBAR SCROLL EFFECT ----
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.background = window.scrollY > 20
    ? 'rgba(5,5,7,0.96)'
    : 'rgba(5,5,7,0.82)';
});

// ---- INIT ----
buildSongList();
updatePlayState();

console.log('%c✅ Tuneify ready. Press Space to play, ← → to navigate.', 'color:#1db954;');