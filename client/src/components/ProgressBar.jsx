import { useRef, useState, useCallback, useEffect } from 'react';
import { usePlayer, formatTime } from '../context/PlayerContext';

function ProgressBar() {
  const { currentTime, duration, seek } = usePlayer();
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverX, setHoverX] = useState(null);

  const max = duration || 0;
  const shownTime = isDragging ? dragTime : currentTime;
  const pct = max > 0 ? Math.min((shownTime / max) * 100, 100) : 0;

  const timeFromEvent = useCallback((clientX) => {
    const rect = barRef.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    return { ratio, time: ratio * max };
  }, [max]);

  const onPointerDown = (e) => {
    if (max <= 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragTime(timeFromEvent(e.clientX).time);
  };

  const onPointerMove = (e) => {
    const { ratio, time } = timeFromEvent(e.clientX);
    setHoverTime(time);
    setHoverX(ratio * 100);
    if (isDragging) setDragTime(time);
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    const { time } = timeFromEvent(e.clientX);
    seek(time);
    setIsDragging(false);
  };

  useEffect(() => {
    if (max <= 0 && isDragging) setIsDragging(false);
  }, [max, isDragging]);

  return (
    <div className="progressArea">
      <span className="timeDisplay currentTimeDisplay">{formatTime(shownTime)}</span>
      <div
        ref={barRef}
        className={`progressTrack${isDragging ? ' dragging' : ''}`}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(max)}
        aria-valuenow={Math.round(shownTime)}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          setHoverTime(null);
          setHoverX(null);
        }}
      >
        <div className="progressRail">
          <div className="progressFill" style={{ width: `${pct}%` }} />
          <div className="progressThumb" style={{ left: `${pct}%` }} />
        </div>
        {(hoverTime != null || isDragging) && (
          <div
            className={`progressTooltip${isDragging ? ' dragging' : ''}`}
            style={{ left: `${hoverX ?? 0}%` }}
          >
            {formatTime(isDragging ? dragTime : hoverTime)}
          </div>
        )}
      </div>
      <span className="timeDisplay totalDurationDisplay">{formatTime(duration)}</span>
    </div>
  );
}

export default ProgressBar;
