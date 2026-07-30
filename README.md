# 🎵 Spotify Clone

A full-stack Spotify clone with a sleek music player interface, built using React, Vite, Express.js, and vanilla JavaScript. Browse, search, and play your favorite NCS tracks with controls like shuffle, repeat, and volume adjustments.

## 🧠 How It Works (The Logic)

### 1. 🎶 The "Player" Engine (Audio Control)
The core player uses the HTML5 `<audio>` element wrapped in a React Context (`PlayerContext`) that manages global state.

**Playback State Machine:**
- When a user clicks a song, `playSong(index)` checks if the same song is already playing → pauses it, or loads a new `audio.src` and plays.
- The `togglePlay()` function checks `audio.paused` and either resumes or pauses the current track.
- `handleNext()` and `handlePrevious()` compute the next index based on current mode:
  - **Normal mode:** increment/decrement in the list, wrapping around at edges.
  - **Shuffle mode:** picks a random index that differs from the current one.
  - **Repeat one:** re-plays the same index.

**Auto-advance:** An `ended` event listener on the audio element automatically triggers `handleNext()` so the playlist never stops.

### 2. 🔀 The "Smart" Controls (Shuffle & Repeat)
- **Shuffle (`toggleShuffle`):** toggles `isShuffled` boolean. When active, `handleNext` and `handlePrevious` pick random songs instead of sequential ones.
- **Repeat (`cycleRepeat`):** cycles through `off → all → one → off`. In `one` mode, the same track loops. In `all` mode, the playlist loops from end to start.

### 3. 🔍 The "Search" Algorithm (Filtering)
The `SearchPage` component filters the songs array in real-time:
- Takes the user's text input and lowercases it.
- Matches against both `song.title` and `song.artist` using `.includes()`.
- Renders matching results instantly as the user types — no API call needed since the song list is already in state.

### 4. 📡 The "Backend" API (Express.js)
A lightweight Express server runs on port 5000:
- Single endpoint `GET /api/songs` returns a JSON array of 10 NCS tracks.
- The React client fetches this on mount via a Vite proxy (`/api` → `http://localhost:5000`) to avoid CORS issues.

### 5. 🖼️ The "Visual" Layer (React Components)
The UI is split into modular components:
- **Layout:** `Navbar` (5-page navigation), `Player` (fixed bottom bar).
- **Pages:** `HomePage` (song list + banner), `SearchPage`, `BrowsePage` (genres), `LibraryPage` (now-playing + all songs), `AboutPage`.
- **Player sub-components:** `SongInfo` (cover + metadata), `Controls` (play/pause/next/prev + progress bar), `VolumeControl` (slider + mute).

## 📂 Project Structure

| File / Folder | Description |
|---|---|
| `app.py` | ⚠️ *(Not applicable — this is a JS project)* |
| `client/` | **React Frontend** built with Vite |
| `client/src/App.jsx` | **Main Entry Point** — renders Navbar, pages, and Player |
| `client/src/context/PlayerContext.jsx` | **The Brain** — global audio state, all playback logic |
| `client/src/components/Player.jsx` | **Bottom Bar** — assembles SongInfo, Controls, VolumeControl |
| `client/src/components/Controls.jsx` | **Playback UI** — progress bar + play/pause/next/prev buttons |
| `client/src/components/VolumeControl.jsx` | **Volume Slider** — mute toggle + range slider |
| `client/src/components/SongInfo.jsx` | **Now Playing** — current song cover, title, artist, playing GIF |
| `client/src/components/SongList.jsx` | **Song List** — renders all SongItem components |
| `client/src/components/SongItem.jsx` | **Single Song Row** — cover, name, duration, play icon |
| `client/src/components/Navbar.jsx` | **Top Navigation** — page links with active state |
| `client/src/components/HomePage.jsx` | **Home Page** — combines SongList + SongBanner |
| `client/src/components/SearchPage.jsx` | **Search Page** — real-time song/artist filtering |
| `client/src/components/BrowsePage.jsx` | **Browse Page** — genre cards + all songs |
| `client/src/components/LibraryPage.jsx` | **Library Page** — now playing + full song list |
| `client/src/components/AboutPage.jsx` | **About Page** — app info and features grid |
| `client/src/index.css` | **Global Styles** — Spotify-dark theme, responsive layout |
| `server/` | **Express Backend** — serves song data via REST API |
| `server/index.js` | **API Server** — `GET /api/songs` returns 10 NCS tracks |
| `index.html` | **Vanilla JS Version** — legacy single-file music player |
| `script.js` | **Vanilla JS Player** — original audio player logic |
| `style.css` | **Vanilla CSS** — styles for the legacy player |
| `public/covers/` | **Album Art** — 10 cover images (1.jpg – 10.jpg) |
| `public/songs/` | **Audio Files** — 10 MP3 tracks (1.mp3 – 10.mp3) |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite |
| **State Management** | React Context API |
| **Backend** | Express.js (Node.js) |
| **Audio** | HTML5 `<audio>` API |
| **Icons** | Font Awesome |
| **Styling** | Custom CSS (Dark Theme) |
| **Language** | JavaScript (ES6+) |

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm installed
- A terminal (PowerShell, bash, etc.)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/spotify-clone.git
cd spotify-clone
```

### 2. Install All Dependencies
Install dependencies for root, server, and client in one go:
```bash
npm run install-all
```

Or manually:
```bash
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Run the Application
Start both the Express server (port 5000) and Vite dev server (port 5173) concurrently:
```bash
npm run dev
```

- **Frontend:** opens at `http://localhost:5173`
- **Backend API:** runs at `http://localhost:5000`

### 4. Or Run Individually

**Start server only:**
```bash
npm run server
```

**Start client only:**
```bash
npm run client
```

## 🌟 Features Breakdown

### 🎧 Music Player
- Play / Pause with a central toggle button
- Skip to Next / Previous track
- Smooth progress bar — click or drag to seek
- Auto-advance to next song on track end

### 🔀 Smart Playback Modes
- **Shuffle:** randomizes the next/previous track selection
- **Repeat All:** loops the entire playlist
- **Repeat One:** continuously replays the current track

### 🔊 Volume Controls
- Slider to adjust volume from 0 to 100%
- Mute / Unmute toggle with visual icon change (volume-off / volume-down / volume-up)

### 🔍 Search
- Real-time search by song title or artist name
- Instant results appear as you type

### 🗂️ Browse & Library
- **Browse Page:** genre cards (Pop, Rock, Hip Hop, Jazz, etc.) + full song list
- **Library Page:** shows currently playing song + all songs with numbered list

### 📱 Responsive Design
- Grid layout adapts from desktop → tablet → mobile
- Bottom player bar collapses to single-column on small screens

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

---

Built with ❤️ using React, Vite, Express, and vanilla JS
