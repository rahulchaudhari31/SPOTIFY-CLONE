const fs = require('fs');
const path = 'client/src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Fix the backtick-newline mess from PowerShell and replace with proper CSS
const badBlock = `.proStationScroll {\`n  display: flex;\`n  flex-direction: row;\`n  gap: 16px;\`n  overflow-x: auto;\`n  padding-bottom: 12px;\`n  scroll-snap-type: x mandatory;\`n  -webkit-overflow-scrolling: touch;\`n  scrollbar-width: thin;\`n  scrollbar-color: rgba(29,185,84,0.5) rgba(255,255,255,0.05);\`n}\`n.proStationScroll::-webkit-scrollbar { height: 5px; }\`n.proStationScroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 10px; }\`n.proStationScroll::-webkit-scrollbar-thumb { background: rgba(29,185,84,0.5); border-radius: 10px; }\`n.proStationScroll::-webkit-scrollbar-thumb:hover { background: #1db954; }`;

const goodBlock = `.proStationScroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 14px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(29,185,84,0.5) rgba(255,255,255,0.05);
}
.proStationScroll::-webkit-scrollbar { height: 5px; }
.proStationScroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 10px; }
.proStationScroll::-webkit-scrollbar-thumb { background: rgba(29,185,84,0.5); border-radius: 10px; }
.proStationScroll::-webkit-scrollbar-thumb:hover { background: #1db954; }`;

if (css.includes(badBlock)) {
  css = css.replace(badBlock, goodBlock);
  console.log('Fixed backtick block');
} else {
  console.log('Bad block not found, checking if already clean...');
  if (css.includes('.proStationScroll {')) {
    console.log('proStationScroll already exists');
  }
}

// Add flex-shrink + width + scroll-snap to proStationCard
const cardOld = `.proStationCard {
  background: rgba(20, 20, 26, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}`;

const cardNew = `.proStationCard {
  background: rgba(20, 20, 26, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
  width: 200px;
  scroll-snap-align: start;
}`;

if (css.includes(cardOld)) {
  css = css.replace(cardOld, cardNew);
  console.log('Added flex-shrink/width/scroll-snap to proStationCard');
} else {
  console.log('proStationCard block not matched exactly');
}

fs.writeFileSync(path, css, 'utf8');
console.log('Done');
