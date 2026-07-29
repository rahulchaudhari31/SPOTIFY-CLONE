const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

const songs = [
  { id: 1, title: "Mortals", artist: "Warriyo", cover: "/covers/1.jpg", file: "/songs/1.mp3", duration: "" },
  { id: 2, title: "Huma-Huma", artist: "Cielo", cover: "/covers/2.jpg", file: "/songs/2.mp3", duration: "" },
  { id: 3, title: "Invincible", artist: "DEAF KEV", cover: "/covers/3.jpg", file: "/songs/3.mp3", duration: "" },
  { id: 4, title: "My Heart", artist: "Different Heaven & EH!DE", cover: "/covers/4.jpg", file: "/songs/4.mp3", duration: "" },
  { id: 5, title: "Heroes Tonight", artist: "Janji feat. Johnning", cover: "/covers/5.jpg", file: "/songs/5.mp3", duration: "" },
  { id: 6, title: "Rabba", artist: "Salam-e-Ishq", cover: "/covers/6.jpg", file: "/songs/6.mp3", duration: "" },
  { id: 7, title: "Sakhiyaan", artist: "Salam-e-Ishq", cover: "/covers/7.jpg", file: "/songs/7.mp3", duration: "" },
  { id: 8, title: "Bhula Dena", artist: "Salam-e-Ishq", cover: "/covers/8.jpg", file: "/songs/8.mp3", duration: "" },
  { id: 9, title: "Tumhari Kasam", artist: "Salam-e-Ishq", cover: "/covers/9.jpg", file: "/songs/9.mp3", duration: "" },
  { id: 10, title: "Na Jaana", artist: "Salam-e-Ishq", cover: "/covers/10.jpg", file: "/songs/10.mp3", duration: "" },
];

app.get('/api/songs', (req, res) => {
  res.json(songs);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
