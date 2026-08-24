const fs = require('fs');
let css = fs.readFileSync('client/src/index.css', 'utf8').replace(/\r\n/g, '\n');

// ── 1. Fix black tap highlight on buttons (mobile webkit) ──
// Add -webkit-tap-highlight-color to the existing button reset
css = css.replace(
  'button {\n  background: none;\n  border: none;\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n  -webkit-appearance: none;\n  appearance: none;\n}',
  'button {\n  background: none;\n  border: none;\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n  -webkit-appearance: none;\n  appearance: none;\n  -webkit-tap-highlight-color: transparent;\n  tap-highlight-color: transparent;\n}'
);

// Also add to * reset for all elements
css = css.replace(
  '*, *::before, *::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}',
  '*, *::before, *::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n}'
);

// ── 2. Station cards bigger on mobile (inside existing 768px block) ──
// Find the existing mobile station card rule and make it bigger
css = css.replace(
  '  .proStationCard {\n    padding: 10px;\n  }\n\n  .stationCoverWrap {\n    aspect-ratio: 1;\n  }',
  '  .proStationCard {\n    padding: 12px;\n    width: 185px;\n  }\n\n  .stationCoverWrap {\n    aspect-ratio: 1;\n  }'
);

// ── 3. Track list rows slightly bigger / zoom in on mobile ──
css = css.replace(
  '  .trackThumbWrap {\n    width: 40px;\n    height: 40px;\n    border-radius: 6px;\n  }',
  '  .trackThumbWrap {\n    width: 46px;\n    height: 46px;\n    border-radius: 8px;\n  }'
);

css = css.replace(
  '  .trackName {\n    font-size: 0.82rem;\n  }',
  '  .trackName {\n    font-size: 0.88rem;\n  }'
);

css = css.replace(
  '  .trackArtist {\n    font-size: 0.68rem;\n  }',
  '  .trackArtist {\n    font-size: 0.74rem;\n  }'
);

css = css.replace(
  '  .proTrackRow {\n    grid-template-columns: 1fr 80px;\n    padding: 8px 10px;\n  }',
  '  .proTrackRow {\n    grid-template-columns: 1fr 80px;\n    padding: 10px 10px;\n  }'
);

// ── 4. Player bar smaller height on mobile ──
css = css.replace(
  '  .bottom {\n    bottom: 8px;\n    left: 8px;\n    right: 8px;\n    width: auto;\n    transform: none;\n    border-radius: 16px;\n    padding: 8px 12px;\n  }',
  '  .bottom {\n    bottom: 6px;\n    left: 6px;\n    right: 6px;\n    width: auto;\n    transform: none;\n    border-radius: 14px;\n    padding: 5px 10px;\n  }'
);

css = css.replace(
  '  .playerCoverContainer {\n    width: 44px;\n    height: 44px;\n    border-radius: 4px;\n  }\n\n  .playerCover {\n    width: 44px;\n    height: 44px;\n  }',
  '  .playerCoverContainer {\n    width: 36px;\n    height: 36px;\n    border-radius: 4px;\n  }\n\n  .playerCover {\n    width: 36px;\n    height: 36px;\n  }'
);

css = css.replace(
  '  .playerSongTitle {\n    font-size: 0.78rem;\n    max-width: 120px;\n  }\n\n  .playerSongArtist {\n    font-size: 0.62rem;\n    max-width: 120px;\n  }',
  '  .playerSongTitle {\n    font-size: 0.72rem;\n    max-width: 110px;\n  }\n\n  .playerSongArtist {\n    font-size: 0.58rem;\n    max-width: 110px;\n  }'
);

fs.writeFileSync('client/src/index.css', css, 'utf8');
console.log('Done');
