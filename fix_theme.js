const fs = require('fs');
let css = fs.readFileSync('client/src/index.css', 'utf8').replace(/\r\n/g, '\n');

const replacements = [
  // Navbar background
  [
    'background: rgba(10, 10, 14, 0.75);',
    'background: var(--nav-bg);'
  ],
  // proHeroHeader background
  [
    'background: linear-gradient(145deg, rgba(28, 28, 34, 0.75), rgba(14, 14, 18, 0.85));',
    'background: linear-gradient(145deg, color-mix(in srgb, var(--container-bg) 75%, transparent), color-mix(in srgb, var(--container-bg) 85%, transparent));'
  ],
  // proStationCard background
  [
    'background: rgba(20, 20, 26, 0.7);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  border-radius: 18px;\n  padding: 14px;\n  cursor: pointer;\n  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);\n  position: relative;\n  overflow: hidden;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);\n  flex-shrink: 0;\n  width: 200px;\n  scroll-snap-align: start;',
    'background: color-mix(in srgb, var(--container-bg) 80%, transparent);\n  border: 1px solid var(--border, rgba(255,255,255,0.08));\n  border-radius: 18px;\n  padding: 14px;\n  cursor: pointer;\n  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);\n  position: relative;\n  overflow: hidden;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);\n  flex-shrink: 0;\n  width: 200px;\n  scroll-snap-align: start;'
  ],
  // proStationCard hover
  [
    'background: rgba(30, 30, 40, 0.85);',
    'background: color-mix(in srgb, var(--container-bg) 90%, var(--song-accent) 10%);'
  ],
  // proTrackRow background (inside proTrackList)
  [
    '.proTrackRow {\n  display: flex;\n  align-items: center;\n  padding: 10px 12px;\n  border-radius: 12px;\n  cursor: pointer;\n  transition: background 0.18s, transform 0.15s;\n  gap: 12px;\n  border: 1px solid transparent;',
    '.proTrackRow {\n  display: flex;\n  align-items: center;\n  padding: 10px 12px;\n  border-radius: 12px;\n  cursor: pointer;\n  transition: background 0.18s, transform 0.15s;\n  gap: 12px;\n  border: 1px solid transparent;\n  color: var(--text-1);'
  ],
  // proTrackRow hover
  [
    '.proTrackRow:hover {\n  background: rgba(255, 255, 255, 0.05);\n  border-color: rgba(255, 255, 255, 0.06);\n}',
    '.proTrackRow:hover {\n  background: color-mix(in srgb, var(--text-1) 5%, transparent);\n  border-color: color-mix(in srgb, var(--text-1) 6%, transparent);\n}'
  ],
  // proTrackRow active
  [
    '.proTrackRow.trackActive {\n  background: rgba(29, 185, 84, 0.1);\n  border-color: rgba(29, 185, 84, 0.2);\n}',
    '.proTrackRow.trackActive {\n  background: color-mix(in srgb, var(--song-accent) 10%, transparent);\n  border-color: color-mix(in srgb, var(--song-accent) 20%, transparent);\n}'
  ],
  // trackListPanelHeader
  [
    'background: rgba(255, 255, 255, 0.03);\n  border-bottom: 1px solid rgba(255, 255, 255, 0.07);',
    'background: color-mix(in srgb, var(--text-1) 3%, transparent);\n  border-bottom: 1px solid color-mix(in srgb, var(--text-1) 7%, transparent);'
  ],
  // proTrackListPanel
  [
    'background: rgba(14, 14, 18, 0.6);\n  border: 1px solid rgba(255, 255, 255, 0.07);\n  border-radius: 20px;\n  overflow: hidden;',
    'background: color-mix(in srgb, var(--container-bg) 60%, transparent);\n  border: 1px solid color-mix(in srgb, var(--text-1) 7%, transparent);\n  border-radius: 20px;\n  overflow: hidden;'
  ],
  // trackName color
  [
    '.trackName {\n  font-size: 0.88rem;\n  font-weight: 600;\n  color: #e8e8e8;',
    '.trackName {\n  font-size: 0.88rem;\n  font-weight: 600;\n  color: var(--text-1);'
  ],
  // trackArtist color
  [
    '.trackArtist {\n  font-size: 0.75rem;\n  color: #999;',
    '.trackArtist {\n  font-size: 0.75rem;\n  color: var(--text-3);'
  ],
  // trackDuration color
  [
    '.trackDuration {\n  font-size: 0.78rem;\n  color: #888;',
    '.trackDuration {\n  font-size: 0.78rem;\n  color: var(--text-3);'
  ],
  // colHeader colors
  [
    'color: #777;',
    'color: var(--text-4);'
  ],
  // proHeroTitle color
  [
    '.proHeroTitle {\n  font-family: \'Outfit\', sans-serif;\n  font-size: 2.2rem;\n  font-weight: 900;\n  color: #ffffff;',
    '.proHeroTitle {\n  font-family: \'Outfit\', sans-serif;\n  font-size: 2.2rem;\n  font-weight: 900;\n  color: var(--text-1);'
  ],
  // proHeroSubtitle color
  [
    '.proHeroSubtitle {\n  font-size: 1rem;\n  color: #b3b3b3;',
    '.proHeroSubtitle {\n  font-size: 1rem;\n  color: var(--text-2);'
  ],
  // proHeroSearchWrap background
  [
    'background: rgba(255, 255, 255, 0.07);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  border-radius: 14px;\n  padding: 10px 16px;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  max-width: 520px;\n  transition: border-color 0.2s, background 0.2s;',
    'background: color-mix(in srgb, var(--text-1) 7%, transparent);\n  border: 1px solid color-mix(in srgb, var(--text-1) 12%, transparent);\n  border-radius: 14px;\n  padding: 10px 16px;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  max-width: 520px;\n  transition: border-color 0.2s, background 0.2s;'
  ],
  // proSearchInput color
  [
    '.proSearchInput {\n  background: none;\n  border: none;\n  outline: none;\n  color: #fff;',
    '.proSearchInput {\n  background: none;\n  border: none;\n  outline: none;\n  color: var(--text-1);'
  ],
  // bottom player background
  [
    'background: linear-gradient(135deg, rgba(32, 32, 36, 0.72), rgba(16, 16, 18, 0.68));',
    'background: linear-gradient(135deg, color-mix(in srgb, var(--container-bg) 72%, transparent), color-mix(in srgb, var(--container-bg) 68%, transparent));'
  ],
  // quickStationWidget background
  [
    'background: rgba(14, 14, 18, 0.7);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  border-radius: 20px;\n  padding: 20px;',
    'background: color-mix(in srgb, var(--container-bg) 70%, transparent);\n  border: 1px solid color-mix(in srgb, var(--text-1) 8%, transparent);\n  border-radius: 20px;\n  padding: 20px;'
  ],
  // widgetItem background
  [
    '.widgetItem {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px;\n  border-radius: 12px;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n\n.widgetItem:hover {\n  background: rgba(255, 255, 255, 0.06);\n}',
    '.widgetItem {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px;\n  border-radius: 12px;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n\n.widgetItem:hover {\n  background: color-mix(in srgb, var(--text-1) 6%, transparent);\n}'
  ],
  // widgetName color
  [
    '.widgetName {\n  font-size: 0.82rem;\n  font-weight: 600;\n  color: #e0e0e0;',
    '.widgetName {\n  font-size: 0.82rem;\n  font-weight: 600;\n  color: var(--text-1);'
  ],
  // widgetGenre color
  [
    '.widgetGenre {\n  font-size: 0.7rem;\n  color: #888;',
    '.widgetGenre {\n  font-size: 0.7rem;\n  color: var(--text-3);'
  ],
  // stationTitle color
  [
    '.stationTitle {\n  font-size: 0.92rem;\n  font-weight: 700;\n  color: var(--text-1);',
    '.stationTitle {\n  font-size: 0.92rem;\n  font-weight: 700;\n  color: var(--text-1);'
  ],
  // stationArtist color
  [
    '.stationArtist {\n  font-size: 0.76rem;\n  color: var(--text-3);',
    '.stationArtist {\n  font-size: 0.76rem;\n  color: var(--text-3);'
  ],
  // categoryTabsBar background
  [
    'background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.07);\n  border-radius: 16px;\n  padding: 6px;',
    'background: color-mix(in srgb, var(--text-1) 3%, transparent);\n  border: 1px solid color-mix(in srgb, var(--text-1) 7%, transparent);\n  border-radius: 16px;\n  padding: 6px;'
  ],
  // catTabBtn color
  [
    '.catTabBtn {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 8px 14px;\n  border-radius: 10px;\n  border: none;\n  background: none;\n  color: #999;',
    '.catTabBtn {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 8px 14px;\n  border-radius: 10px;\n  border: none;\n  background: none;\n  color: var(--text-3);'
  ],
  // catTabBtn active background
  [
    '.catTabBtn.catActive {\n  background: rgba(29, 185, 84, 0.15);\n  color: var(--song-accent);\n  border: 1px solid rgba(29, 185, 84, 0.25);\n}',
    '.catTabBtn.catActive {\n  background: color-mix(in srgb, var(--song-accent) 15%, transparent);\n  color: var(--song-accent);\n  border: 1px solid color-mix(in srgb, var(--song-accent) 25%, transparent);\n}'
  ],
  // genreTag background
  [
    '.genreTag {\n  background: rgba(255, 255, 255, 0.07);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  color: #aaa;',
    '.genreTag {\n  background: color-mix(in srgb, var(--text-1) 7%, transparent);\n  border: 1px solid color-mix(in srgb, var(--text-1) 10%, transparent);\n  color: var(--text-2);'
  ],
  // trackIndex color
  [
    '.trackIndex {\n  font-size: 0.78rem;\n  color: #666;',
    '.trackIndex {\n  font-size: 0.78rem;\n  color: var(--text-4);'
  ],
];

let count = 0;
for (const [from, to] of replacements) {
  if (css.includes(from)) {
    css = css.replace(from, to);
    count++;
  }
}

fs.writeFileSync('client/src/index.css', css, 'utf8');
console.log(`Done — ${count}/${replacements.length} replacements made`);
