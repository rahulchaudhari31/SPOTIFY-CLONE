const videoIds = [
"ajGo94h0JxE","8of5w7RgcTc","9T-Zbxg9X_4","bP8ATWCvqzw","nJZcbidTutE","0pKGaMHBCII","25s_TeRqyHg","KUpwupYj_tY","jdxM0w253Gg","b5WF7yZcc1w",
"mX3RdZGEGDM","rmzeFqtk68s","ZBMVHhSbF4U","DDYSI_GaNOU","poT3qmuIarU","T94PHkuydcw","4YbAaRFk70o","xRb8hxwN5zc","08CJzaeH8h4","E45J_yOyUcA",
"DB3D-mtWR0c","orYf6VDtj_k","IZF-rOe9u-g","B4-HoKdW6j0","RLzC55ai0eo","JtnPpxe8K7c","1nWQs6IxTrY","GLGuLXKT9Ng","8_KBlCKK-0k","LlI1IkgP6BQ",
"8A1XPxaeoZA","-rmGyJnTKXw","CQNJE7ZXHg0","YrJ6OZ7VVWc","HZHVbmnkuzU","3u__IvHX_rI","LPeZOE8ZIHI","piUHBTXsoiY","vJiDTHrq6DI","ESpTwlItxpQ",
"vJQCAtzSfuo","lBvbNxiVmZA","amWKXh9_EQE","se9DDAwwGQY","JQuVBmyhW08","akjdj6iHttY","psXl8w6gQuA","MOh4qB12vJY","tsVe7wHl_GQ","yDv0WSgXJVg",
"8z5GZVURqAg","M7vXOK_ZKY0","dpwTb9ecLXE","c2gSzYLJ8sY","yy-ELf7JpMw","udgrClXV26Y","_mR6bY-ndso","KTki8bU8wg8","ZJ5HxNWYDtM","pmId7mXRKS4",
"B7SkAq_94J8","7Qq4m-bw71g","SivCc33LxyA","xgbgjQWwwIE","AIWBZbHyNpI","t_sCtNmZPwQ","xdZiUuwZeOI","LV_wiOhO40Q","SQ4jZ-EAL88","D9yb5ffKkVo",
"prKlWuv3-PQ","RG-a2kVQcGg","SMlGGRAB3Hc","ilNt2bikxDI","jfOi7dscWc8","SxTYjptEzZs","U0EI7XFkkV4","GnGhZtIcIh0","BWczaSneA0Q","usvVGXFIpTM",
"NLKwRW2y-sg","a18py61_F_w","TuUVVKVdZm4","WPwTPhFMm3k","Cb6wuzOurPc","2mWaqsC3U7k","6vKucgAeF_Q","xHLnZMjJ8bY","b_sCZbYyuO4","yIyVhIspa2I",
"dTu5dTEzVM4","u7hfwX81bY4","DKOLynNhWxo","ru_5PA8cwkE","o1RducJbUdc","HqUeSjsYLNU","JbDktrsnH40","kPtn26x8TZM","QYO6AlxiRE4","RbcG85TK-wM",
"kyDXsLhlwv0","0gLqP1IZUPg","Rwy8nryH3gY","cWMxCE2HTag","k85UB5b6pJU","vsWxs1tuwDk","LK7-_dgAVQE","XTp5jaRU3Ws","Fbv6-50S1lc","0dXiVYq8HBc"
];

let clientOutput = "";
let serverOutput = "";
let id = 18;

videoIds.forEach((ytVideoId, index) => {
  const cover = `https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`;
  const title = `Track ${id}`;
  const artist = "YouTube Music";
  const genre = "YouTube";
  
  clientOutput += `  {\n    id: ${id},\n    title: "${title}",\n    artist: "${artist}",\n    cover: "${cover}",\n    file: "",\n    duration: "LIVE",\n    ytVideoId: "${ytVideoId}",\n    genre: "${genre}",\n    isSpecial: false\n  }${index < videoIds.length - 1 ? ',' : ''}\n`;
  
  serverOutput += `  { id: ${id}, title: "${title}", artist: "${artist}", cover: "${cover}", file: "", duration: "LIVE", ytVideoId: "${ytVideoId}", genre: "${genre}", isSpecial: false }${index < videoIds.length - 1 ? ',' : ''}\n`;
  
  id++;
});

console.log("=== CLIENT SONGS (append to DEFAULT_SONGS) ===");
console.log(clientOutput);
console.log("\n=== SERVER SONGS (append to songs array) ===");
console.log(serverOutput);