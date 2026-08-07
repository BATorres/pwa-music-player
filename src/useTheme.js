import { useState, useCallback, useMemo } from 'react';

// Dark theme assets
import darkFrame from '../assets/dark/frame.png';
import darkFrameNoBg from '../assets/dark/frame_no_background.png';
import darkRecordPlayer from '../assets/dark/record_player.png';
import darkRecordPlayerTop from '../assets/dark/record_player_top.png';
import darkFavicon from '../assets/dark/favicon.png';
import darkProgressBar from '../assets/dark/progress_bar.png';
import darkVolumeBarHigh from '../assets/dark/volume_bar_high.png';
import darkVolumeBarLow from '../assets/dark/volume_bar_low.png';

// Dark theme animations
import darkNeedlePlay1 from '../assets/animations/dark/needle-playing/frame-1.png';
import darkNeedlePlay2 from '../assets/animations/dark/needle-playing/frame-2.png';
import darkNeedlePlay3 from '../assets/animations/dark/needle-playing/frame-3.png';
import darkNeedleChange1 from '../assets/animations/dark/needle-change/frame-1.png';
import darkNeedleChange2 from '../assets/animations/dark/needle-change/frame-2.png';
import darkNeedleChange3 from '../assets/animations/dark/needle-change/frame-3.png';

// Light theme assets
import lightFrame from '../assets/light/frame.png';
import lightFrameNoBg from '../assets/light/frame_no_background.png';
import lightRecordPlayer from '../assets/light/record_player.png';
import lightRecordPlayerTop from '../assets/light/record_player_top.png';
import lightFavicon from '../assets/light/favicon.png';
import lightProgressBar from '../assets/light/progress_bar.png';
import lightVolumeBarHigh from '../assets/light/volume_bar_high.png';
import lightVolumeBarLow from '../assets/light/volume_bar_low.png';

// Light theme animations
import lightNeedlePlay1 from '../assets/animations/light/needle-playing/frame-1.png';
import lightNeedlePlay2 from '../assets/animations/light/needle-playing/frame-2.png';
import lightNeedlePlay3 from '../assets/animations/light/needle-playing/frame-3.png';
import lightNeedleChange1 from '../assets/animations/light/needle-change/frame-1.png';
import lightNeedleChange2 from '../assets/animations/light/needle-change/frame-2.png';
import lightNeedleChange3 from '../assets/animations/light/needle-change/frame-3.png';

// Common assets
import backwardsButton from '../assets/commons/backwards_button.png';
import exitButton from '../assets/commons/exit_button.png';
import forwardsButton from '../assets/commons/forwards_button.png';
import minimizerButton from '../assets/commons/minimizer_button.png';
import muteButton from '../assets/commons/mute_button.png';
import pauseButton from '../assets/commons/pause_button.png';
import playButton from '../assets/commons/play_button.png';
import repeatButton from '../assets/commons/repeat_button.png';
import settings from '../assets/commons/settings.png';
import shuffleButton from '../assets/commons/shuffle_button.png';
import volumeButton from '../assets/commons/volume_button.png';
import windowButton from '../assets/commons/window_button.png';

// Records frames
import recordDark1 from '../assets/animations/record-dark/frame-1.png';
import recordDark2 from '../assets/animations/record-dark/frame-2.png';
import recordDark3 from '../assets/animations/record-dark/frame-3.png';
import recordDark4 from '../assets/animations/record-dark/frame-4.png';
import recordLight1 from '../assets/animations/record-light/frame-1.png';
import recordLight2 from '../assets/animations/record-light/frame-2.png';
import recordLight3 from '../assets/animations/record-light/frame-3.png';
import recordLight4 from '../assets/animations/record-light/frame-4.png';

const RECORD_FRAMES = {
  recordFramesA: [recordDark1, recordDark2, recordDark3, recordDark4],
  recordFramesB: [recordLight1, recordLight2, recordLight3, recordLight4],
};

const THEME_ASSETS = {
  dark: {
    frame: darkFrame,
    frameNoBg: darkFrameNoBg,
    recordPlayer: darkRecordPlayer,
    recordPlayerTop: darkRecordPlayerTop,
    backwardsButton: backwardsButton,
    pauseButton: pauseButton,
    playButton: playButton,
    forwardsButton: forwardsButton,
    exitButton: exitButton,
    minimizerButton: minimizerButton,
    windowButton: windowButton,
    favicon: darkFavicon,
    progressBar: darkProgressBar,
    settings: settings,
    volumeButton: volumeButton,
    muteButton: muteButton,
    shuffleButton: shuffleButton,
    repeatButton: repeatButton,
    volumeBarHigh: darkVolumeBarHigh,
    volumeBarLow: darkVolumeBarLow,
    ...RECORD_FRAMES,
    needlePlayFrames: [darkNeedlePlay1, darkNeedlePlay2, darkNeedlePlay3],
    needleChangeFrames: [darkNeedleChange1, darkNeedleChange2, darkNeedleChange3],
  },
  light: {
    frame: lightFrame,
    frameNoBg: lightFrameNoBg,
    recordPlayer: lightRecordPlayer,
    recordPlayerTop: lightRecordPlayerTop,
    backwardsButton: backwardsButton,
    pauseButton: pauseButton,
    playButton: playButton,
    forwardsButton: forwardsButton,
    exitButton: exitButton,
    minimizerButton: minimizerButton,
    windowButton: windowButton,
    favicon: lightFavicon,
    progressBar: lightProgressBar,
    settings: settings,
    volumeButton: volumeButton,
    muteButton: muteButton,
    shuffleButton: shuffleButton,
    repeatButton: repeatButton,
    volumeBarHigh: lightVolumeBarHigh,
    volumeBarLow: lightVolumeBarLow,
    ...RECORD_FRAMES,
    needlePlayFrames: [lightNeedlePlay1, lightNeedlePlay2, lightNeedlePlay3],
    needleChangeFrames: [lightNeedleChange1, lightNeedleChange2, lightNeedleChange3],
  }
};

const STORAGE_KEY = 'cupid-player-theme';

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // localStorage unavailable
  }
  return 'dark'; // default theme
}

/**
 * Theme hook — stores preference in localStorage and provides
 * the correct asset set for the active theme.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(getStoredTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      window.cupid?.setTheme(next);
      return next;
    });
  }, []);

  const assets = useMemo(() => THEME_ASSETS[theme], [theme]);

  return { theme, toggleTheme, assets };
}
