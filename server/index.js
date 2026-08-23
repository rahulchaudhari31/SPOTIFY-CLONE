const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const songs = [
  // Core Collection
  { id: 1, title: "Mortals", artist: "Warriyo ft. Laura Brehm", cover: "/covers/1.jpg", file: "/songs/1.mp3", duration: "3:48", ytVideoId: "ltyf0PjonQg", genre: "Trap" },
  { id: 2, title: "Cielo", artist: "Huma-Huma", cover: "/covers/2.jpg", file: "/songs/2.mp3", duration: "2:02", ytVideoId: "ltyf0PjonQg", genre: "Electronic" },
  { id: 3, title: "Invincible", artist: "DEAF KEV", cover: "/covers/3.jpg", file: "/songs/3.mp3", duration: "4:33", ytVideoId: "5Dkfo0IjoBk", genre: "Gaming EDM" },
  { id: 4, title: "My Heart", artist: "Different Heaven & EH!DE", cover: "/covers/4.jpg", file: "/songs/4.mp3", duration: "4:27", ytVideoId: "5Dkfo0IjoBk", genre: "Dubstep" },
  { id: 5, title: "Heroes Tonight", artist: "Janji ft. Johnning", cover: "/covers/5.jpg", file: "/songs/5.mp3", duration: "3:28", ytVideoId: "jJbr4tzIGBI", genre: "Melodic House" },
  { id: 6, title: "Rabba", artist: "Salam-e-Ishq", cover: "/covers/6.jpg", file: "/songs/6.mp3", duration: "4:15", ytVideoId: "jJbr4tzIGBI", genre: "Bollywood" },
  { id: 7, title: "Sakhiyaan", artist: "Salam-e-Ishq", cover: "/covers/7.jpg", file: "/songs/7.mp3", duration: "3:50", ytVideoId: "jJbr4tzIGBI", genre: "Bollywood" },
  { id: 8, title: "Bhula Dena", artist: "Salam-e-Ishq", cover: "/covers/8.jpg", file: "/songs/8.mp3", duration: "4:40", ytVideoId: "7Pw5qk4wJAw", genre: "Romantic" },
  { id: 9, title: "Tumhari Kasam", artist: "Salam-e-Ishq", cover: "/covers/9.jpg", file: "/songs/9.mp3", duration: "3:30", ytVideoId: "7Pw5qk4wJAw", genre: "Melody" },
  { id: 10, title: "Na Jaana", artist: "Salam-e-Ishq", cover: "/covers/10.jpg", file: "/songs/10.mp3", duration: "4:10", ytVideoId: "7Pw5qk4wJAw", genre: "Lo-Fi" },

  // Special Pro YouTube Stream Stations (Direct In-App Audio)
  { id: 11, title: "NCS 24/7 Top Hits", artist: "NCS Official", cover: "https://img.youtube.com/vi/ltyf0PjonQg/hqdefault.jpg", file: "", ytVideoId: "ltyf0PjonQg", genre: "NCS Electronic", isSpecial: true, tag: "POPULAR" },
  { id: 12, title: "NCS Melodic & Chill Vibes", artist: "NCS Chill", cover: "https://img.youtube.com/vi/jJbr4tzIGBI/hqdefault.jpg", file: "", ytVideoId: "jJbr4tzIGBI", genre: "Chillstep", isSpecial: true, tag: "TRENDING" },
  { id: 13, title: "NCS Gaming Bass & Trap", artist: "NCS Bass", cover: "https://img.youtube.com/vi/5Dkfo0IjoBk/hqdefault.jpg", file: "", ytVideoId: "5Dkfo0IjoBk", genre: "Bass & Trap", isSpecial: true, tag: "GAMING" },
  { id: 14, title: "NCS Cyber Synth & Energy", artist: "NCS Synth", cover: "https://img.youtube.com/vi/Y8ETNh_IQjs/hqdefault.jpg", file: "", ytVideoId: "Y8ETNh_IQjs", genre: "Synthwave", isSpecial: true, tag: "CYBER" },
  { id: 15, title: "NCS Electro & Future House", artist: "NCS Club", cover: "https://img.youtube.com/vi/Z4B4mVV0NzM/hqdefault.jpg", file: "", ytVideoId: "Z4B4mVV0NzM", genre: "Future House", isSpecial: true, tag: "CLUB" },
  { id: 16, title: "NCS Lo-Fi & Ambient Beats", artist: "NCS Lounge", cover: "https://img.youtube.com/vi/7Pw5qk4wJAw/hqdefault.jpg", file: "", ytVideoId: "7Pw5qk4wJAw", genre: "Lo-Fi Chill", isSpecial: true, tag: "RELAX" },
];

app.get('/api/songs', (req, res) => {
  res.json(songs);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

