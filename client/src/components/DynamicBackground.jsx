import { useEffect, useRef, useState } from 'react';
import { FastAverageColor } from 'fast-average-color';
import { usePlayer } from '../context/PlayerContext';

const DEFAULT_IMAGE = '/bg.jpg';

const DEFAULT_LAYER = {
  id: 'default',
  css: 'radial-gradient(1200px 700px at 70% -10%, rgba(29, 185, 84, 0.14), transparent 60%), linear-gradient(160deg, #101010 0%, #191919 45%, #0a0a0a 100%)',
};

function shade(hex, factor, alpha = 1) {
  const n = hex.replace('#', '');
  const r = Math.round(parseInt(n.slice(0, 2), 16) * factor);
  const g = Math.round(parseInt(n.slice(2, 4), 16) * factor);
  const b = Math.round(parseInt(n.slice(4, 6), 16) * factor);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

let layerId = 0;

function DynamicBackground() {
  const { currentSong, analyserRef } = usePlayer();
  const [layers, setLayers] = useState([DEFAULT_LAYER]);
  const parallaxRef = useRef(null);
  const pulseRef = useRef(null);
  const spotlightRef = useRef(null);
  const cover = currentSong?.cover;

  /* Extract dominant color from the active cover */
  useEffect(() => {
    if (!cover) return;
    let cancelled = false;
    const fac = new FastAverageColor();
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (cancelled) return;
      try {
        const { hex } = fac.getColor(img, { algorithm: 'dominant' });
        const glowCss =
          `radial-gradient(1200px 800px at 75% -15%, ${shade(hex, 1, 0.38)}, transparent 62%), ` +
          `radial-gradient(900px 600px at -10% 110%, ${shade(hex, 0.55, 0.3)}, transparent 60%), ` +
          `linear-gradient(160deg, ${shade(hex, 0.22, 0.96)} 0%, #141414 55%, #0a0a0a 100%)`;
        setLayers((prev) => [...prev.slice(-2), { id: ++layerId, css: glowCss }]);
        document.documentElement.style.setProperty('--song-accent', shade(hex, 1));
        document.documentElement.style.setProperty('--song-accent-dim', shade(hex, 0.6, 0.5));
        setTimeout(() => {
          setLayers((prev) => (prev.length > 2 ? prev.slice(-2) : prev));
        }, 1400);
      } catch {
        /* ignore extraction failures */
      }
    };
    img.src = cover;
    return () => {
      cancelled = true;
      fac.destroy();
    };
  }, [cover]);

  /* Unified interaction loop: mouse parallax + 3D tilt + audio-reactive pulse */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let tx = 0, ty = 0;        // parallax targets
    let cx = 0, cy = 0;        // parallax current
    let tiltX = 0, tiltY = 0;  // tilt targets
    let ctx_ = 0, cty = 0;     // tilt current
    let energy = 0;

    let freqData = null;

    const onMove = (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      tx = nx * 42;
      ty = ny * 30;
      tiltX = ny * -4.5;
      tiltY = nx * 5.5;
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--spot-x', `${e.clientX}px`);
        spotlightRef.current.style.setProperty('--spot-y', `${e.clientY}px`);
        spotlightRef.current.classList.add('active');
      }
    };

    const onLeave = () => {
      tx = 0; ty = 0; tiltX = 0; tiltY = 0;
      spotlightRef.current?.classList.remove('active');
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);

      /* Bass energy from the live analyser */
      const analyser = analyserRef?.current;
      if (analyser) {
        if (!freqData || freqData.length !== analyser.frequencyBinCount) {
          freqData = new Uint8Array(analyser.frequencyBinCount);
        }
        analyser.getByteFrequencyData(freqData);
        let sum = 0;
        const bins = Math.min(10, freqData.length);
        for (let i = 0; i < bins; i++) sum += freqData[i];
        const bass = sum / (bins * 255);
        energy += (bass - energy) * 0.12;
      }

      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;
      ctx_ += (tiltX - ctx_) * 0.06;
      cty += (tiltY - cty) * 0.06;

      const beatScale = 1 + energy * 0.045;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform =
          `perspective(1200px) translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) ` +
          `rotateX(${ctx_.toFixed(3)}deg) rotateY(${cty.toFixed(3)}deg) scale(${beatScale.toFixed(4)})`;
      }

      if (pulseRef.current) {
        pulseRef.current.style.opacity = (0.08 + energy * 0.85).toFixed(3);
        pulseRef.current.style.transform = `scale(${(1 + energy * 0.25).toFixed(4)})`;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [analyserRef]);

  return (
    <div className="dynamicBackground" aria-hidden="true">
      <div ref={parallaxRef} className="dynamicBgParallax">
        <div
          className="dynamicBgImage visible"
          style={{ backgroundImage: `url(${DEFAULT_IMAGE})` }}
        />
      </div>
      <div ref={pulseRef} className="dynamicBgPulse" />
      {layers.map((layer, i) => (
        <div
          key={layer.id}
          className={`dynamicBgLayer${i === layers.length - 1 ? ' visible' : ''}`}
          style={{ backgroundImage: layer.css }}
        />
      ))}
      <div ref={spotlightRef} className="dynamicBgSpotlight" />
      <div className="dynamicBgVignette" />
    </div>
  );
}

export default DynamicBackground;
