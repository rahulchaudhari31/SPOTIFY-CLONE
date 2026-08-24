const fs = require('fs');

const newIds = [
  'ajGo94h0JxE','8of5w7RgcTc','9T-Zbxg9X_4','bP8ATWCvqzw','nJZcbidTutE',
  '0pKGaMHBCII','25s_TeRqyHg','KUpwupYj_tY','jdxM0w253Gg','b5WF7yZcc1w',
  'mX3RdZGEGDM','rmzeFqtk68s','ZBMVHhSbF4U','DDYSI_GaNOU','poT3qmuIarU',
  'T94PHkuydcw','4YbAaRFk70o','xRb8hxwN5zc','08CJzaeH8h4','E45J_yOyUcA',
  'DB3D-mtWR0c','orYf6VDtj_k','IZF-rOe9u-g','B4-HoKdW6j0','RLzC55ai0eo',
  'JtnPpxe8K7c','1nWQs6IxTrY','GLGuLXKT9Ng','8_KBlCKK-0k','LlI1IkgP6BQ',
  '8A1XPxaeoZA','-rmGyJnTKXw','CQNJE7ZXHg0','YrJ6OZ7VVWc','HZHVbmnkuzU',
  '3u__IvHX_rI','LPeZOE8ZIHI','piUHBTXsoiY','vJiDTHrq6DI','ESpTwlItxpQ',
  'vJQCAtzSfuo','lBvbNxiVmZA','amWKXh9_EQE','se9DDAwwGQY','JQuVBmyhW08',
  'akjdj6iHttY','psXl8w6gQuA','MOh4qB12vJY','tsVe7wHl_GQ','yDv0WSgXJVg',
  '8z5GZVURqAg','M7vXOK_ZKY0','dpwTb9ecLXE','c2gSzYLJ8sY','yy-ELf7JpMw',
  'udgrClXV26Y','_mR6bY-ndso','KTki8bU8wg8','ZJ5HxNWYDtM','pmId7mXRKS4',
  'B7SkAq_94J8','7Qq4m-bw71g','SivCc33LxyA','xgbgjQWwwIE','AIWBZbHyNpI',
  't_sCtNmZPwQ','xdZiUuwZeOI','LV_wiOhO40Q','SQ4jZ-EAL88','D9yb5ffKkVo',
  'prKlWuv3-PQ','RG-a2kVQcGg','SMlGGRAB3Hc','ilNt2bikxDI','jfOi7dscWc8',
  'SxTYjptEzZs','U0EI7XFkkV4','GnGhZtIcIh0','BWczaSneA0Q','usvVGXFIpTM',
  'NLKwRW2y-sg','a18py61_F_w','TuUVVKVdZm4','WPwTPhFMm3k','Cb6wuzOurPc',
  '2mWaqsC3U7k','6vKucgAeF_Q','xHLnZMjJ8bY','b_sCZbYyuO4','yIyVhIspa2I',
  'dTu5dTEzVM4','u7hfwX81bY4','DKOLynNhWxo','ru_5PA8cwkE','o1RducJbUdc',
  'HqUeSjsYLNU','JbDktrsnH40','kPtn26x8TZM','QYO6AlxiRE4','RbcG85TK-wM',
  'kyDXsLhlwv0','0gLqP1IZUPg','Rwy8nryH3gY','cWMxCE2HTag','k85UB5b6pJU',
  'vsWxs1tuwDk','LK7-_dgAVQE','XTp5jaRU3Ws','Fbv6-50S1lc','0dXiVYq8HBc'
];

// Build server entries (inline format)
let serverLines = '';
newIds.forEach((vid, i) => {
  const id = 171 + i;
  serverLines += `  { id: ${id}, title: "Track ${id}", artist: "YouTube Music", cover: "https://img.youtube.com/vi/${vid}/hqdefault.jpg", file: "", duration: "LIVE", ytVideoId: "${vid}", genre: "YouTube", isSpecial: false },\n`;
});

// Patch server/index.js
const serverPath = './server/index.js';
let serverContent = fs.readFileSync(serverPath, 'utf8');
// Normalize to LF for matching, then write back
const serverNorm = serverContent.replace(/\r\n/g, '\n');
const serverPatched = serverNorm.replace(
  '  { id: 170, title: "Track 170", artist: "YouTube Music", cover: "https://img.youtube.com/vi/oMesPehN_Do/hqdefault.jpg", file: "", duration: "LIVE", ytVideoId: "oMesPehN_Do", genre: "YouTube", isSpecial: false }\n];',
  '  { id: 170, title: "Track 170", artist: "YouTube Music", cover: "https://img.youtube.com/vi/oMesPehN_Do/hqdefault.jpg", file: "", duration: "LIVE", ytVideoId: "oMesPehN_Do", genre: "YouTube", isSpecial: false },\n' + serverLines.slice(0, -2) + '\n];'
);
if (serverPatched === serverNorm) { console.error('server patch did not match!'); process.exit(1); }
fs.writeFileSync(serverPath, serverPatched, 'utf8');
console.log('server/index.js updated');

// Build client entries (object format)
let clientLines = '';
newIds.forEach((vid, i) => {
  const id = 171 + i;
  clientLines += `  {\n    id: ${id},\n    title: "Track ${id}",\n    artist: "YouTube Music",\n    cover: "https://img.youtube.com/vi/${vid}/hqdefault.jpg",\n    file: "",\n    duration: "LIVE",\n    ytVideoId: "${vid}",\n    genre: "YouTube",\n    isSpecial: false\n  },\n`;
});

// Patch client/src/data/songs.js
const clientPath = './client/src/data/songs.js';
let clientContent = fs.readFileSync(clientPath, 'utf8');
const clientNorm = clientContent.replace(/\r\n/g, '\n');
const clientPatched = clientNorm.replace(
  '  {\n    id: 170,\n    title: "Track 170",\n    artist: "YouTube Music",\n    cover: "https://img.youtube.com/vi/oMesPehN_Do/hqdefault.jpg",\n    file: "",\n    duration: "LIVE",\n    ytVideoId: "oMesPehN_Do",\n    genre: "YouTube",\n    isSpecial: false\n  }\n];',
  '  {\n    id: 170,\n    title: "Track 170",\n    artist: "YouTube Music",\n    cover: "https://img.youtube.com/vi/oMesPehN_Do/hqdefault.jpg",\n    file: "",\n    duration: "LIVE",\n    ytVideoId: "oMesPehN_Do",\n    genre: "YouTube",\n    isSpecial: false\n  },\n' + clientLines.slice(0, -2) + '\n];\n'
);
if (clientPatched === clientNorm) { console.error('client patch did not match!'); process.exit(1); }
fs.writeFileSync(clientPath, clientPatched, 'utf8');
console.log('client/src/data/songs.js updated');
