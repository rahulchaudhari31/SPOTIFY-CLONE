const fs = require('fs');
let css = fs.readFileSync('client/src/index.css', 'utf8').replace(/\r\n/g, '\n');

// ── 1. Replace old themeToggle CSS ──────────────────────────────────────────
const oldTheme = `.themeToggleItem {
  display: flex;
  align-items: center;
}

.themeToggle {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-2);
  font-size: 0.9rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.25s ease, transform 0.3s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.themeToggle:hover {
  color: #ffd98a;
  transform: rotate(24deg) scale(1.08);
  box-shadow: 0 0 18px rgba(224, 169, 79, 0.45);
}

.themeToggle .fa-sun {
  color: #e0a94f;
}`;

const newTheme = `.themeToggleItem {
  display: flex;
  align-items: center;
}

/* ── Theme Pill Toggle ── */
.themePillToggle {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 999px;
  padding: 5px 10px 5px 6px;
  cursor: pointer;
  transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
  position: relative;
}
.themePillToggle:hover {
  background: rgba(255,255,255,0.13);
  box-shadow: 0 0 14px rgba(255,255,255,0.08);
}
.themePillTrack {
  width: 32px;
  height: 18px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  position: relative;
  transition: background 0.3s;
  flex-shrink: 0;
}
.themePillThumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #b3b3b3;
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s;
}
/* Dark mode — thumb right, track green */
.themeDark .themePillTrack {
  background: rgba(29,185,84,0.35);
}
.themeDark .themePillThumb {
  transform: translateX(14px);
  background: #1db954;
}
/* Light mode — thumb left, track amber */
.themeLight .themePillTrack {
  background: rgba(224,169,79,0.35);
}
.themeLight .themePillThumb {
  transform: translateX(0);
  background: #e0a94f;
}
.themePillSun {
  font-size: 0.82rem;
  color: #e0a94f;
  transition: opacity 0.25s;
}
.themePillMoon {
  font-size: 0.78rem;
  color: #a0b4ff;
  transition: opacity 0.25s;
}
.themeDark .themePillSun  { opacity: 0.4; }
.themeDark .themePillMoon { opacity: 1;   }
.themeLight .themePillSun  { opacity: 1;   }
.themeLight .themePillMoon { opacity: 0.4; }`;

if (css.includes(oldTheme)) {
  css = css.replace(oldTheme, newTheme);
  console.log('✓ themeToggle CSS replaced');
} else {
  console.log('✗ themeToggle old block not found');
}

// ── 2. Replace old mobile hamburger CSS with bottom tab bar CSS ──────────────
const oldMobile = `.mobileMenuToggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-1);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

.mobileMenuToggle:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--accent-ui);
}

.mobileMenuOverlay {
  display: none;
}

@media (max-width: 768px) {
  .mobileMenuToggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .navLinksContainer {
    position: fixed;
    top: var(--nav-h);
    left: 0;
    right: 0;
    background: var(--nav-bg);
    backdrop-filter: blur(24px) saturate(140%);
    -webkit-backdrop-filter: blur(24px) saturate(140%);
    border-bottom: 1px solid var(--border);
    padding: 16px;
    display: none;
    flex-direction: column;
    gap: 8px;
    z-index: 99;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  }

  .navLinksContainer.open {
    display: flex;
  }

  .navLinksContainer .navLink {
    width: 100%;
    justify-content: flex-start;
    padding: 12px 16px;
    font-size: 1rem;
    border-radius: 12px;
  }

  .navLinksContainer .navLink i {
    font-size: 1.1rem;
    width: 24px;
    text-align: center;
  }

  .mobileMenuOverlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 98;
    opacity: 0;
    animation: fadeIn 0.2s ease forwards;
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }
}`;

const newMobile = `/* ── Mobile Bottom Tab Bar ── */
.mobileBottomNav {
  display: none;
}

@media (max-width: 768px) {
  .mobileBottomNav {
    display: flex;
    position: fixed;
    bottom: 72px; /* sit above the player bar */
    left: 0;
    right: 0;
    height: 60px;
    background: var(--nav-bg);
    backdrop-filter: blur(24px) saturate(140%);
    -webkit-backdrop-filter: blur(24px) saturate(140%);
    border-top: 1px solid var(--border);
    z-index: 200;
    align-items: stretch;
  }

  .mobileTabBtn {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    background: none;
    border: none;
    color: var(--text-3);
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    transition: color 0.2s;
    padding: 0;
  }
  .mobileTabBtn i {
    font-size: 1.1rem;
    transition: transform 0.2s, color 0.2s;
  }
  .mobileTabBtn.mobileTabActive {
    color: var(--song-accent);
  }
  .mobileTabBtn.mobileTabActive i {
    transform: scale(1.15);
  }
  .mobileTabBtn:active i {
    transform: scale(0.9);
  }

  /* Hide top nav links on mobile */
  .navLinksContainer {
    display: none !important;
  }
  /* Hide live stream pill on mobile to save space */
  .navQuickStreamItem {
    display: none;
  }
}`;

if (css.includes(oldMobile)) {
  css = css.replace(oldMobile, newMobile);
  console.log('✓ mobile hamburger CSS replaced with bottom tab bar');
} else {
  console.log('✗ mobile hamburger old block not found — appending bottom tab bar CSS');
  css += '\n' + newMobile;
}

fs.writeFileSync('client/src/index.css', css, 'utf8');
console.log('Done');
