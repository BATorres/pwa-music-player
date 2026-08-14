import { useCallback, useEffect, useRef, useState } from 'react';

import './RecordPlayer.css';

export default function RecordPlayer({ assets, isPlaying, track, theme }) {
  const [isDefaultTheme, setDefaultTheme] = useState(theme === 'dark');
  const [needleChangeFrame, setNeedleChangeFrame] = useState(0);
  const [needleFrame, setNeedleFrame] = useState(0);
  const [needleLifted, setNeedleLifted] = useState(false);
  const [recordFrame, setRecordFrame] = useState(0);
  const [swapping, setSwapping] = useState(false);

  const prevTrackRef = useRef(null);

  const currentFrames = isDefaultTheme ? assets.recordFramesA : assets.recordFramesB;
  const incomingFrames = isDefaultTheme ? assets.recordFramesB : assets.recordFramesA;

  // Spin animation while playing
  useEffect(() => {
    if (!isPlaying || swapping) return;
    const interval = setInterval(() => {
      setRecordFrame((f) => (f + 1) % currentFrames.length);
      setNeedleFrame((f) => (f + 1) % assets.needlePlayFrames.length);
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying, swapping, currentFrames.length]);

  // Detect song change and trigger swap
  // Sequence: needle lifts (0→1→2) → records swap → needle lowers (2→1→0)
  useEffect(() => {
      if (prevTrackRef.current === track.title) return;
      const wasInitialOrPlaceholder = prevTrackRef.current === null || prevTrackRef.current === 'No track';
      prevTrackRef.current = track.title;
      if (track.title === 'No track') return;
      if (wasInitialOrPlaceholder) return;
      if (needleLifted) return;
  
      setNeedleLifted(true);
      setNeedleChangeFrame(0);
  
      // Show needle lifted (frame 1 = index 1)
      setTimeout(() => setNeedleChangeFrame(1), 200);
  
      // Start record swap
      setTimeout(() => setSwapping(true), 400);
  
      // Finish swap, switch color
      setTimeout(() => {
        setDefaultTheme((p) => !p);
        setRecordFrame(0);
        setSwapping(false);
      }, 1000);
  
      // Needle lower after swap is done, reset to frame 1
      setTimeout(() => {
        setNeedleChangeFrame(0);
        setNeedleLifted(false);
        setNeedleFrame(0);
      }, 1100);
  
    }, [track.title, needleLifted]);

  return (
    <div>
      <img src={assets.recordPlayerTop} className="record-player-top" alt="" draggable={false} />
      <img src={assets.recordPlayer} className="record-player" alt="" draggable={false} />
      <img
        src={currentFrames[recordFrame]}
        className={`record-player ${swapping ? 'record-slide-out' : ''}`}
        alt=""
        draggable={false}
      />
      {swapping && (
        <img
          src={incomingFrames[0]}
          className="record-player record-slide-in"
          alt=""
          draggable={false}
        />
      )}
      <img
        src={needleLifted ? assets.needleChangeFrames[needleChangeFrame] : assets.needlePlayFrames[needleFrame]}
        className="record-player"
        alt=""
        draggable={false}
      />

      {/* Frame overlay (no background) to clip sliding records */}
      <img src={assets.frameNoBg} className="layer frame-overlay" alt="" draggable={false} />

      {/* SVG clip-path for pixel-art album mask */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="album-mask" clipPathUnits="objectBoundingBox">
            {/* 35x41 centered vertically */}
            <rect x="0" y="0" width="1" height="1" />
            {/* 37x39 */}
            <rect x="0.04878" y="0.02439" width="1" height="1" />
            {/* 39x37 */}
            <rect x="0.02439" y="0.04878" width="1" height="1" />
            {/* 41x35 */}
            <rect x="0" y="0.07317" width="1" height="1" />
          </clipPath>
        </defs>
      </svg>

      {/* Album art clipped to pixel mask */}
      {track.art && (
        <div className="album-mask">
          <img src={track.art} className="album-art" alt="" draggable={false} />
        </div>
      )}

      {/* Album frame overlay */}
      {<img src={assets.albumFrame} className="layer album-frame-layer" alt="" draggable={false} />}
    </div>
  );
}
