import { useCallback, useEffect, useState } from 'react';
import {
  login as youtubeLogin,
  logout as youtubeLogout,
  isLoggedIn as isYouTubeLoggedIn,
  isConfigured as isYouTubeConfigured,
} from '../../../integrations/youtube/auth.js';
import {
  parsePlaylistUrl as parseYouTubePlaylistUrl,
  fetchPlaylistByUrl as fetchYouTubePlaylistByUrl,
  fetchMyPlaylists as fetchYouTubePlaylists,
  fetchPlaylistTracks as fetchYouTubeTracks,
} from '../../../integrations/youtube/api.js';

import PlaylistList from '../PlaylistList/PlaylistList.jsx';
import SettingsDropdown from '../SettingsDropdown/SettingsDropdown.jsx';
import './SettingsPanel.css';

export default function SettingsPanel({
  player,
  showSettings,
  source,
  setSource,
  setLocalTracks,
  setStreamTracks,
  theme,
  toggleTheme,
}) {
  const [youtubeConnected, setYoutubeConnected] = useState(isYouTubeLoggedIn());
  const [youtubeLoggingIn, setYoutubeLoggingIn] = useState(false);
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
  const [youtubePlaylists, setYoutubePlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [settingsError, setSettingsError] = useState(null);
  const [musicService, setMusicService] = useState(() => {
    try {
      const stored = localStorage.getItem('cupid-player-music-service');
      if (stored === 'youtube' || stored === 'local') return stored;
    } catch {
      // ignore
    }
    return 'local';
  });

  const loadLocalPlaylist = useCallback(async () => {
    if (!window.cupid?.getLocalPlaylist) return;
    try {
      const tracks = await window.cupid.getLocalPlaylist();
      setLocalTracks(Array.isArray(tracks) ? tracks : []);
    } catch (err) {
      console.error('Failed to load local playlist:', err);
    }
  }, [setLocalTracks]);

  useEffect(() => { loadLocalPlaylist(); }, [loadLocalPlaylist]);

  const loadYoutubePlaylists = useCallback((silent = false) => {
    setLoadingPlaylists(true);
    if (!silent) setSettingsError(null);
    fetchYouTubePlaylists()
      .then((p) => { setYoutubePlaylists(p); setSettingsError(null); })
      .catch((err) => { if (!silent) setSettingsError(err.message); })
      .finally(() => setLoadingPlaylists(false));
  }, []);

  const loadYoutubePlaylistFromUrl = useCallback(async (rawInput) => {
    setSettingsError(null);
    const parsed = parseYouTubePlaylistUrl(rawInput);
    if (!parsed) {
      setSettingsError('Not a recognised YouTube playlist URL');
      return;
    }
    setLoadingPlaylist(true);
    try {
      const tracks = await fetchYouTubePlaylistByUrl(rawInput);
      if (tracks.length === 0) {
        setSettingsError('Playlist is empty or private');
        return;
      }
      setStreamTracks(tracks);
      setSource('streaming');
      setYoutubeUrlInput('');
    } catch (err) {
      setSettingsError(err.message);
    } finally {
      setLoadingPlaylist(false);
    }
  }, [setStreamTracks, setSource]);

  const loadPlaylist = useCallback(async (id, service) => {
    setLoadingPlaylist(true);
    setSettingsError(null);
    try {
      const fetcher = service === 'apple'
        ? fetchAppleTracks
        : service === 'youtube'
          ? fetchYouTubeTracks
          : fetchSpotifyTracks;
      const tracks = await fetcher(id);
      if (tracks.length === 0) {
        setSettingsError('Playlist is empty');
        return;
      }
      setStreamTracks(tracks);
      setSource('streaming');
    } catch (err) {
      setSettingsError(err.message);
    } finally {
      setLoadingPlaylist(false);
    }
  }, [setStreamTracks, setSource]);

  return (
    showSettings && (
      <div className="settings-panel">
        <div className="settings-panel-inner">
          <div className="settings-label">theme</div>
          <div className="settings-theme-row">
            <button
              className={`settings-theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => { if (theme !== 'dark') toggleTheme(); }}
            >
              dark
            </button>
            <button
              className={`settings-theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => { if (theme !== 'light') toggleTheme(); }}
            >
              light
            </button>
          </div>
          <div className="settings-label">Wanna listen something else?</div>
          <div className="settings-label">You can copy/paste a YouTube playlist URL!</div>

          <SettingsDropdown
            value={musicService}
            options={[
              { value: 'local', label: 'local' },
              { value: 'youtube', label: 'youtube' },
            ]}
            onChange={(next) => {
              setMusicService(next);
              try { localStorage.setItem('cupid-player-music-service', next); } catch { /* ignore */ }
              if (next === 'local') setSource('local');
            }}
          />

          {musicService === 'local' && (
            <button
              className="settings-theme-btn"
              onClick={loadLocalPlaylist}
            >
              reload
            </button>
          )}

          {musicService === 'youtube' && (
            isYouTubeConfigured() ? (
              !youtubeConnected ? (
                <button
                  className={`settings-theme-btn ${youtubeLoggingIn ? 'disabled' : ''}`}
                  disabled={youtubeLoggingIn}
                  onClick={async () => {
                    setYoutubeLoggingIn(true);
                    setSettingsError(null);
                    try {
                      await youtubeLogin();
                      setYoutubeConnected(true);
                      loadYoutubePlaylists();
                    } catch (err) {
                      setSettingsError(err.message);
                    } finally {
                      setYoutubeLoggingIn(false);
                    }
                  }}
                >
                  {youtubeLoggingIn ? 'waiting for browser...' : 'log in with google'}
                </button>
              ) : (
                <>
                  <PlaylistList
                    loading={loadingPlaylists}
                    playlists={youtubePlaylists}
                    loadingPlaylist={loadingPlaylist}
                    onSelect={(id) => loadPlaylist(id, 'youtube')}
                  />
                  <div className="settings-theme-row">
                    <button
                      className={`settings-theme-btn ${loadingPlaylists ? 'disabled' : ''}`}
                      disabled={loadingPlaylists}
                      onClick={() => loadYoutubePlaylists()}
                    >
                      refresh
                    </button>
                    <button className="settings-theme-btn" onClick={() => {``
                      youtubeLogout();
                      setYoutubeConnected(false);
                      setYoutubePlaylists([]);
                      if (source === 'streaming') setSource('local');
                    }}>
                      logout
                    </button>
                  </div>
                </>
              )
            ) : (
              <>
                <input
                  className="settings-input"
                  type="text"
                  placeholder="paste a youtube playlist link"
                  value={youtubeUrlInput}
                  onChange={(e) => setYoutubeUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && youtubeUrlInput.trim()) {
                      loadYoutubePlaylistFromUrl(youtubeUrlInput.trim());
                    }
                  }}
                  disabled={loadingPlaylist}
                />
                <button
                  className={`settings-theme-btn ${loadingPlaylist || !youtubeUrlInput.trim() ? 'disabled' : ''}`}
                  onClick={() => loadYoutubePlaylistFromUrl(youtubeUrlInput.trim())}
                  disabled={loadingPlaylist || !youtubeUrlInput.trim()}
                >
                  {loadingPlaylist ? 'loading...' : 'load playlist'}
                </button>
              </>
            )
          )}

          {settingsError && <div className="settings-error">{settingsError}</div>}
        </div>
      </div>
    )
  );
}
