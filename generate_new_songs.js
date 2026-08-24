const videoIds = [
"maNMfH1dVR0","slM5s55Jz0k","VNs_cCtdbPc","6piRLp7BV8o","nqUN530Rgtw","-YlmnPh-6rE","cl0a3i2wFcc","IltsOcCj1Ak","FfOwqhckUH8","ZUR5E18dvrA",
"3ONzh3tf884","fG70qm6usR8","6RrEQJNZwPQ","RVh647FkPtA","6BYIKEH0RCQ","TVbI55pDdaI","8nGFWWJLHio","jADTdg-o8i0","vX2cDW8LUWk","0pWsCiBvLOk",
"cWMxCE2HTag","YsCeMprm2O0","IAvw60x0Kn4","pGuc4hPhiKw","BWczaSneA0Q","2FhgKp_lfJQ","5GCfYLguTIs","3KXZduvOfDo","mGbkArS9Eyo","CqDRlVWpzk8",
"bZxtKxiA2qo","AsEd5OAys9E","hjWf8A0YNSE","sxUh-Mq1t6Q","cfBLtdg5lYY","Mz2yP0A3t4o","IAvw60x0Kn4","4DfVxVeqk2o","cl0a3i2wFcc","N2-HsIYd0Go",
"WJP1HWB21EI","E_SbwSe15y0","mpjNh-uGBY4","PRXIG7ZWnG8","oMesPehN_Do"
];

// Deduplicate
const uniqueIds = [...new Set(videoIds)];
console.log("Unique count:", uniqueIds.length);
console.log(uniqueIds.join(','));

let clientOutput = "";
let serverOutput = "";
let id = 128;

uniqueIds.forEach((ytVideoId, index) => {
  const cover = `https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`;
  const title = `Track ${id}`;
  const artist = "YouTube Music";
  const genre = "YouTube";
  
  clientOutput += `  {\n    id: ${id},\n    title: "${title}",\n    artist: "${artist}",\n    cover: "${cover}",\n    file: "",\n    duration: "LIVE",\n    ytVideoId: "${ytVideoId}",\n    genre: "${genre}",\n    isSpecial: false\n  }${index < uniqueIds.length - 1 ? ',' : ''}\n`;
  
  serverOutput += `  { id: ${id}, title: "${title}", artist: "${artist}", cover: "${cover}", file: "", duration: "LIVE", ytVideoId: "${ytVideoId}", genre: "${genre}", isSpecial: false }${index < uniqueIds.length - 1 ? ',' : ''}\n`;
  
  id++;
});

console.log("\n=== CLIENT SONGS (append to DEFAULT_SONGS) ===");
console.log(clientOutput);
console.log("\n=== SERVER SONGS (append to songs array) ===");
console.log(serverOutput);