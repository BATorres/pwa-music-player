# Awesome Mix Player

## Disclaimer

This is a custome pixel-art desktop music player originally created by [@cupidbity](https://github.com/cupidbity) with Electron, Vite, and React . You can find the original code [here](https://github.com/cupidbity/cupid-music-player) 

## Features

- Pixel-art UI with animated record player, spinning vinyl, and needle
- Record swap animation on song change (dark/light themed vinyl alternation)
- Interactive progress bar with draggable ghost indicator (the ghost is a reference of Bad Omens band)
- Marquee scrolling for long track titles
- Dark and light theme switching with persistent preference
- YouTube playlists — paste any public playlist URL (no sign-in) or sign in with Google to browse your own
- Local MP3 playback that works entirely offline
- Custom frameless window with drag and resize
- Dynamic dock/taskbar icon that matches the active theme

## Aditional Featurres/Bugs Fixed

While customizing the app customization, I found some bugs and implemented the next improvements:

- I eliminated the use of a JSON file for local tracks; consequently, this feature functions entirely offline.
- The original code contained a minor bug that prevented the artist's name from displaying correctly when loading a YouTube playlist.
- Due to certain YouTube policies, some tracks did not work as expected, so, I adjusted the logic to skip them.
- Finally, I added a bounce animation to the playback buttons (play/pause, prev, next, shuffle).

## Getting Started
You only need 4 commands. Copy them one at a time:

```bash
# 1. Download the code
git clone https://github.com/cupidbity/cupid-music-player.git

# 2. Step INTO the folder you just downloaded (this step is required!)
cd cupid-music-player

# 3. Set up the app (installs deps, downloads the yt-dlp binary, and
#    auto-checks/repairs the Electron binary issue some hit on Windows)
npm run setup

# 4. Run the app in dev mode
npm run dev
```

`npm run setup` is the recommended one-command setup — it installs dependencies, downloads the yt-dlp binary, and automatically checks for and repairs the Electron binary issue that can otherwise break `npm run dev` on Windows. If anything was off, just re-run `npm run setup`. (Plain `npm install` still works too.)

> Hitting an Electron `path.txt` / "failed to install correctly" error, or streaming not working? See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — including the manual Electron binary fix for too-new Node versions.


### Prerequisites

Before the commands above will work, you need these installed:

| Tool | Why | Install link |
|------|-----|--------------|
| **Node.js 18 or newer** | Runs `npm` and the app's build tools | [nodejs.org](https://nodejs.org/) — download the LTS version |
| **Git** | Used by the `git clone` command above | [git-scm.com](https://git-scm.com/downloads) — usually pre-installed on macOS/Linux |

To check if you already have them, run:

```bash
node --version    # should print v18.x.x or higher
npm --version     # should print 9.x or higher
git --version     # should print git version 2.x.x
```

If any of those says "command not found," install that tool first.

> No Python is needed. The `npm install` step automatically downloads a standalone `yt-dlp` binary for your OS into the project's `bin/` folder.

---

### Where the audio folder lives

- **Running from source (dev):** `audio/` in the project root.
- **Installed app (macOS):** `~/Library/Application Support/pwa-music-player/audio/`
- **Installed app (Windows):** `%APPDATA%\pwa-music-player\audio\`
- **Installed app (Linux):** `~/.config/pwa-music-player/audio/`

On first launch, the installed app seeds this folder with the bundled defaults. After that it's yours to edit — the app never overwrites it.

### Building your playlist

1. Drop `.mp3` files into the audio folder.
2. In the app, hit the settings icon and the local tab is selected by default. Reload the app to pick up new edits — `playlist.json` is read on launch.

### Supported formats

`.mp3`, `.m4a`, `.aac`, `.flac`, `.wav`, `.ogg`, `.opus`.

## YouTube Setup

Two flows — pick whichever you want by configuring (or not) your `.env`. **No YouTube Premium / no subscription required** in either case.

**Paste any public playlist URL** (zero setup):

1. Click the settings icon in the player > switch to youtube
2. Paste a YouTube/YouTube Music playlist URL into the box
3. Hit `load playlist`

**Browse your own playlists** (requires Google OAuth setup):

1. Create a Google Cloud project at [console.cloud.google.com](https://console.cloud.google.com/), enable **YouTube Data API v3**
2. Configure the OAuth consent screen (External, add yourself as a test user, scope `youtube.readonly`)
3. Create OAuth credentials of type **Desktop app**
4. Add `VITE_YOUTUBE_CLIENT_ID` and `VITE_YOUTUBE_CLIENT_SECRET` to your `.env`
5. Click the settings icon > switch to youtube > log in with google

The sign-in option only appears when `VITE_YOUTUBE_CLIENT_ID` is set; otherwise the URL-paste box shows instead.

See [YOUTUBE_SETUP.md](YOUTUBE_SETUP.md) for detailed instructions and troubleshooting.

## Build

```bash
npm run package
```

### Install as Desktop App

**macOS:**
```bash
cp -r "out/mac-arm64/Cupid Player.app" /Applications/
```

**Windows:** Run the installer from `out/Cupid Player Setup.exe`. If `npm run package` fails at the NSIS step with "Cannot create symbolic link," enable **Developer Mode** in Settings → System → For developers, then re-run. The unpacked app at `out/win-unpacked/Cupid Player.exe` is fully runnable in the meantime — no installer required.

**Linux:** Run the AppImage from `out/`.

> Note: The macOS build is unsigned. On first launch you may need to right-click > Open, or go to System Settings > Privacy & Security to allow it.

## Tech Stack

- **Electron** — desktop app shell (frameless window, IPC, system tray)
- **Vite** — build tool and dev server
- **React** — UI framework
- **HTML5 Audio** — local MP3 playback
- **yt-dlp** — YouTube audio streaming for Spotify/Apple/YouTube tracks; also fetches public YouTube playlist contents via `--flat-playlist`
- **YouTube Data API v3** — sign-in browsing of the user's own playlists (Google OAuth PKCE, free quota)
- **CSS** — custom properties for theming, calc-based responsive scaling
- **Node.js** — main process (JWT generation, yt-dlp execution)
