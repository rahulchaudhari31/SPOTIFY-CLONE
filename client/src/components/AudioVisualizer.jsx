import { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

function AudioVisualizer({ barCount = 56 }) {
  const canvasRef = useRef(null);
  const { analyserRef, ensureAudioGraph } = usePlayer();
  const colorCache = useRef({ colors: null, frame: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    let rafId;
    let t = 0;

    const readColors = () => {
      if (colorCache.current.colors && colorCache.current.frame % 120 !== 0) {
        colorCache.current.frame += 1;
        return colorCache.current.colors;
      }
      colorCache.current.frame += 1;
      const style = getComputedStyle(document.documentElement);
      colorCache.current.colors = [
        style.getPropertyValue('--viz-color-1').trim() || '#1db954',
        style.getPropertyValue('--viz-color-2').trim() || '#1ed760',
      ];
      return colorCache.current.colors;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width === 0 || height === 0) return;

      ctx2d.clearRect(0, 0, width, height);
      const [c1, c2] = readColors();
      const gradient = ctx2d.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, c1);
      gradient.addColorStop(1, c2);

      const analyser = analyserRef?.current;
      let freqData = null;
      if (analyser) {
        freqData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(freqData);
      }

      const gap = 3;
      const barWidth = Math.max((width - gap * (barCount - 1)) / barCount, 1.5);
      ctx2d.fillStyle = gradient;

      for (let i = 0; i < barCount; i++) {
        let level;
        if (freqData && freqData.some((v) => v > 0)) {
          const idx = Math.floor((i / barCount) * freqData.length * 0.85);
          level = freqData[idx] / 255;
        } else {
          level =
            0.08 +
            0.06 * Math.abs(Math.sin(t * 0.02 + i * 0.35)) +
            0.04 * Math.abs(Math.sin(t * 0.008 + i * 0.12));
        }
        const barHeight = Math.max(level * height, 2);
        const x = i * (barWidth + gap);
        const y = height - barHeight;
        const radius = Math.min(barWidth / 2, 2.5);
        ctx2d.beginPath();
        ctx2d.moveTo(x, height);
        ctx2d.lineTo(x, y + radius);
        ctx2d.quadraticCurveTo(x, y, x + radius, y);
        ctx2d.lineTo(x + barWidth - radius, y);
        ctx2d.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx2d.lineTo(x + barWidth, height);
        ctx2d.closePath();
        ctx2d.fill();
      }
      t += 1;
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [analyserRef, barCount, ensureAudioGraph]);

  return <canvas ref={canvasRef} className="audioVisualizer" aria-hidden="true" />;
}

export default AudioVisualizer;
