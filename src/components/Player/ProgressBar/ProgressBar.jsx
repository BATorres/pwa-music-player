import { useEffect, useRef, useState } from 'react';

import ghost from '../../../../assets/ghost.png';
import ghostSelected from '../../../../assets/ghost_selected.png';
import progressBarThorns from '../../../../assets/progress_bar_thorns.png';

import './ProgressBar.css';

export default function ProgressBar({ assets, progress, seek }) {
  const [dragging, setDragging] = useState(false);
  const [ghostHovered, setGhostHovered] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(null);
  // null sentinel = haven't seen any track yet; 'No track' = placeholder while
  // tracks load async. Both should silently set the ref without animating.
  const seekRef = useRef(null);

  useEffect(() => {
    if (!dragging) return;
    const onMouseMove = (e) => {
      const rect = seekRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverProgress(pct);
      seek(pct);
    };
    const onMouseUp = () => {
      setDragging(false);
      setGhostHovered(false);
      setHoverProgress(null);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, seek]);

  return (
    <div className="progress-bar">
      <img src={assets.progressBar} className="layer layer-ui" alt="" draggable={false} />
      <img
        src={progressBarThorns}
        className="layer layer-ui"
        alt=""
        draggable={false}
        style={{
          clipPath: `inset(0 ${(1 - (131 + (hoverProgress ?? progress) * 226 + 10) / 512) * 100}% 0 0)`,
        }}
      />
      <img
        src={ghostHovered ? ghostSelected : ghost}
        className={`layer layer-ui star-indicator ${ghostHovered ? 'star-hovered' : ''}`}
        alt=""
        draggable={false}
        style={{
          transform: `translateX(calc(-3 / 306 * 100vw + ${(hoverProgress ?? progress) * (226 / 512) * 171.9}vw))`,
        }}
      />

      <div
        className="progress-seek"
        ref={seekRef}
        onMouseEnter={() => setGhostHovered(true)}
        onMouseLeave={() => { if (!dragging) { setGhostHovered(false); } }}
        onMouseDown={(e) => {
          e.preventDefault();
          setDragging(true);
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          setHoverProgress(pct);
          seek(pct);
        }}
      />
    </div>
  );
}
