import { useCallback, useState } from 'react';

import './PlaybackControl.css';

export default function PlaybackControl({ assets, isPlaying, next, playMode, prev, setPlayMode, togglePlay }) {
  const [playHovered, setPlayHovered] = useState(false);
  const [nextHovered, setNextHovered] = useState(false);
  const [prevHovered, setPrevHovered] = useState(false);
  const [playModeHovered, setPlayModeHovered] = useState(false);

  const cyclePlayMode = useCallback(() => {
    setPlayMode((m) => m === 'normal' ? 'shuffle' : m === 'shuffle' ? 'repeat' : 'normal');
  }, []);

  return (
    <div className="playback-control">
      {/* Playback control layers (visual only) */}
      <img src={assets.backwardsButton} className={`layer layer-ui ${prevHovered ? 'prev-hovered' : ''}`} alt="" draggable={false} />
      <img src={isPlaying ? assets.pauseButton : assets.playButton} className={`layer layer-ui ${playHovered ? 'play-hovered' : ''}`} alt="" draggable={false} />
      <img src={assets.forwardsButton} className={`layer layer-ui ${nextHovered ? 'next-hovered' : ''}`} alt="" draggable={false} />

      {/* Shuffle/repeat button layer */}
      <img
        src={playMode === 'repeat' ? assets.repeatButton : assets.shuffleButton}
        className={`layer layer-ui ${playModeHovered ? 'playmode-hovered' : ''}`}
        alt=""
        draggable={false}
        style={{ opacity: playMode === 'normal' ? 0.4 : 0.8 }}
      />

      {/* Playback control click targets */}
      <div className="btn btn-prev" onClick={prev} onMouseEnter={() => setPrevHovered(true)} onMouseLeave={() => setPrevHovered(false)} />
      <div className="btn btn-play" onClick={togglePlay} onMouseEnter={() => setPlayHovered(true)} onMouseLeave={() => setPlayHovered(false)} />
      <div className="btn btn-next" onClick={next} onMouseEnter={() => setNextHovered(true)} onMouseLeave={() => setNextHovered(false)} />

      {/* Shuffle/repeat click target */}
      <div className="btn btn-playmode" onClick={cyclePlayMode} onMouseEnter={() => setPlayModeHovered(true)} onMouseLeave={() => setPlayModeHovered(false)} title={playMode} />
    </div>
  );
} 