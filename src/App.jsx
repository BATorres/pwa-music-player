import { useRef, useEffect, useState } from 'react';
import './App.css';

// Components
import PlaybackControl from './components/Player/PlaybackControl/PlaybackControl.jsx';
import RecordPlayer from './components/Player/RecordPlayer/RecordPlayer.jsx';
import ProgressBar from './components/Player/ProgressBar/ProgressBar.jsx';
import VolumeBar from './components/Player/VolumeBar/VolumeBar.jsx';
import SettingsPanel from './components/Settings/SettingsPanel/SettingsPanel.jsx';

// Hooks
import useAudioPlayer from './hooks/useAudioPlayer.js';
import useSpotifyPlayer from './hooks/useSpotifyPlayer.js';
import useResize from './hooks/useResize.js';
import useTheme from './hooks/useTheme.js';

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function MarqueeText({ className, text }) {
  const outerRef = useRef(null);
  const textRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const outer = outerRef.current;
    const textEl = textRef.current;
    if (!outer || !textEl) return;
    setShouldScroll(textEl.offsetWidth > outer.clientWidth);
  }, [text]);

  return (
    <div className={`${className} marquee-container`} ref={outerRef}>
      {/* Hidden span to measure true text width */}
      <span ref={textRef} className="marquee-measure">{text}</span>
      <span className={shouldScroll ? 'marquee-scroll' : ''}>
        {text}
        {shouldScroll && <span className="marquee-gap">{text}</span>}
      </span>
    </div>
  );
}

export default function App() {
  // ── Source state ─────────────────────────────────────────
  const { theme, toggleTheme, assets } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [source, setSource] = useState('local'); // 'local' | 'streaming'
  const [streamTracks, setStreamTracks] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [playMode, setPlayMode] = useState('normal'); // 'normal' | 'shuffle' | 'repeat'
  const [showDebug] = useState(false);

  const local = useAudioPlayer(localTracks, playMode, window.cupid?.getLocalAudioPath);
  const streaming = useSpotifyPlayer(streamTracks, playMode);

  useEffect(() => {
    if (source === 'streaming') {
      local.pause();
    } else {
      streaming.pause();
    }
  }, [source, local.pause, streaming.pause]);

  const player = source === 'streaming' ? streaming : local;

  const {
    track,
    isPlaying,
    progress,
    duration,
    currentTime,
    togglePlay,
    next,
    prev,
    seek,
    volume,
    setVolume,
    muted,
    toggleMute,
  } = player;
  
  const resizeTL = useResize('top-left');
  const resizeTR = useResize('top-right');
  const resizeBL = useResize('bottom-left');
  const resizeBR = useResize('bottom-right');

  return (
    <div className={`player ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Base frame */}
      <img src={assets.frame} className="layer" alt="" draggable={false} />

      {/* Window title */}
      <div className="window-title">Karlita's Awesome Mix</div>

      <RecordPlayer 
        assets={assets} 
        isPlaying={isPlaying} 
        track={track} 
        theme={theme}
      />

      {/* Progress bar layers */}
      <ProgressBar 
        assets={assets} 
        progress={progress} 
        seek={seek} 
      /> 

      {/* Window control layers (visual only) */}
      <img src={assets.minimizerButton} className="layer layer-ui" alt="" draggable={false} />
      <img src={assets.windowButton} className="layer layer-ui" alt="" draggable={false} />
      <img src={assets.exitButton} className="layer layer-ui" alt="" draggable={false} />

      {/* Settings button layer */}
      <img src={assets.settings} className="layer layer-ui settings-layer" alt="" draggable={false} />

      {/* Now playing section */}
      <div className="now-playing">
        <div className="track-info">
          <div className="now-playing-label">
            now playing...
          </div>
          <MarqueeText className="track-title" text={track.title} />
          <div className="track-artist">by {track.artist}</div>
        </div>
      </div>

      {/* Time display */}
      <div className="time-display">
        <span className="time-current">{formatTime(currentTime)}</span>
        <span className="time-remaining">{formatTime(duration - currentTime)}</span>
      </div>

      {/* Drag region for moving the window */}
      <div className="drag-region" />

      {/* Custom resize handles at frame corners */}
      <div className="resize-handle top-left" onMouseDown={resizeTL} />
      <div className="resize-handle top-right" onMouseDown={resizeTR} />
      <div className="resize-handle bottom-left" onMouseDown={resizeBL} />
      <div className="resize-handle bottom-right" onMouseDown={resizeBR} />

      {/* Playback control */}
      <PlaybackControl 
        assets={assets} 
        isPlaying={isPlaying} 
        next={next}
        playMode={playMode}
        prev={prev}
        setPlayMode={setPlayMode}
        togglePlay={togglePlay}
      /> 

      {/* Volume bar */}
      <VolumeBar 
        assets={assets} 
        muted={muted} 
        setVolume={setVolume}
        toggleMute={toggleMute}
        volume={volume}
      /> 

      {/* Window control click targets */}
      <div className="btn btn-minimize" onClick={() => window.cupid?.minimize()} />
      <div className="btn btn-window" onClick={() => window.cupid?.maximize()} />
      <div className="btn btn-exit" onClick={() => window.cupid?.close()} />

      {/* Settings button */}
      <div className="btn btn-settings" onClick={() => setShowSettings((v) => !v)} />

      {/* Debug overlays — toggle with showDebug state */}
      {showDebug && (
        <>
          <div className="debug-overlay btn btn-prev" />
          <div className="debug-overlay btn btn-play" />
          <div className="debug-overlay btn btn-next" />
          <div className="debug-overlay volume-hover-zone" />
          <div className="debug-overlay volume-bar-area-debug" />
          <div className="debug-overlay btn btn-playmode" />
        </>
      )}

      {/* Settings panel */}
      <SettingsPanel
        player={player}
        showSettings={showSettings}
        source={source}
        setSource={setSource}
        setLocalTracks={setLocalTracks}
        setStreamTracks={setStreamTracks}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </div>
  );
}
