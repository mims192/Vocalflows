#  VocalFlow Windows

A Windows port of [VocalFlow](https://github.com/Vocallabsai/vocalflow) — a hold-to-record speech-to-text app with real-time Deepgram transcription and optional Groq LLM post-processing.

Built with **React + Node.js + Electron**.

---

## Features

| Feature | Description |
|---|---|
|  Hold-to-record | Hold a hotkey (Alt, Ctrl, Shift, F9, etc.) to record |
|  Real-time streaming | Audio streamed live to Deepgram WebSocket API |
|  Groq post-processing | Spelling fix, grammar fix, transliteration, translation |
|  **Balance display** | Shows your Deepgram credit balance + Groq account status |
|  Auto clipboard | Final transcript auto-copied for paste anywhere |
|  Electron tray | Runs as a Windows system tray app |
|  Multi-language | Supports 9+ languages via Deepgram |

---

##  Project Structure

```
vocalflow-windows/
├── backend/                        # Node.js Express + Socket.IO server
│   ├── config/
│   │   └── keys.js                 #  API keys (hardcoded here)
│   ├── routes/
│   │   ├── deepgram.js             # Balance + models endpoints
│   │   └── groq.js                 # Balance + LLM post-processing
│   ├── services/
│   │   └── deepgramService.js      # WebSocket audio streaming proxy
│   ├── server.js                   # Express + Socket.IO entry point
│   └── package.json
│
├── frontend/                       # React (Vite) app
│   ├── src/
│   │   ├── components/
│   │   │   ├── BalanceDisplay.jsx  #  Deepgram + Groq balance
│   │   │   ├── RecordButton.jsx    # Hold-to-record UI
│   │   │   ├── Transcript.jsx      # Live transcript display
│   │   │   ├── Settings.jsx        # Model, hotkey, Groq config
│   │   │   └── StatusBar.jsx       # Connection status
│   │   ├── hooks/
│   │   │   ├── useAudioStream.js   # Microphone capture (PCM)
│   │   │   ├── useHotkey.js        # Global hold-key detection
│   │   │   └── useWebSocket.js     # Socket.IO client
│   │   ├── services/
│   │   │   └── api.js              # Axios API wrapper
│   │   ├── config/
│   │   │   └── defaults.js         # Default settings
│   │   ├── App.jsx                 # Root component
│   │   └── App.css                 # Dark industrial theme
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── electron/                       # Electron wrapper (system tray)
│   ├── main.js                     # Tray, window management
│   ├── preload.js                  # Secure IPC bridge
│   └── package.json
│
├── start.bat                       # One-click Windows launcher
├── .gitignore
└── README.md
```

---

## Quick Start (Browser Mode — Recommended for Testing)

### Prerequisites
- [Node.js](https://nodejs.org) v18 or later
- Deepgram API key → [console.deepgram.com](https://console.deepgram.com/signup)
- Groq API key → [console.groq.com](https://console.groq.com) *(optional)*

### Step 1 — Add your API keys

Open `backend/config/keys.js` and replace the placeholders:

```js
module.exports = {
  DEEPGRAM_API_KEY: "your_actual_deepgram_key",
  GROQ_API_KEY: "your_actual_groq_key",
  PORT: 3001,
  CORS_ORIGIN: "http://localhost:5173",
};
```

### Step 2 — Run with one click (Windows)

Double-click `start.bat`

**OR** run manually in two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm install
node server.js

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

### Step 3 — Open the app

Visit **http://localhost:5173** in your browser.

> **Allow microphone access** when prompted by the browser.

---

## 🖥 Running as Windows Tray App (Electron)

```bash
cd electron
npm install
npm run dev
```

This opens VocalFlow as a native Windows app with a system tray icon.

---

##  Configuration

All settings are available in the **Settings tab** of the UI:

| Setting | Options |
|---|---|
| Deepgram Model | nova-2 *(recommended)*, nova, enhanced, base |
| Language | English, Hindi, Spanish, French, German, Japanese, Chinese... |
| Post-processing | None, Spelling, Grammar, Transliteration, Translation |
| Target language | Any language (for translation mode) |
| Groq model | llama3-8b-8192, llama3-70b-8192, mixtral-8x7b-32768 |
| Hold-to-record key | Alt, Control, Shift, CapsLock, F9, F10 |
| Auto clipboard | On/Off — copies transcript on release |

---

##  Balance Display (Extra Feature)

Click the **Balance tab** to see:

- **Deepgram**: Live credit balance in USD from your project
- **Groq**: Account status and number of available models

> Groq does not expose a monetary balance via their public API. The display shows account activity status instead.

---

##  API Keys

| Service | Where to get | Free tier |
|---|---|---|
| Deepgram | https://console.deepgram.com/signup | $200 credit |
| Groq | https://console.groq.com | Yes (rate limited) |

---

##  How It Works

1. **Hold** the configured hotkey (default: `Alt`) or click & hold the button
2. **Speak** — audio is captured from your mic and streamed to backend
3. Backend **proxies audio** to Deepgram's WebSocket API in real-time
4. **Transcripts** stream back and appear live in the UI
5. On **release**, Groq post-processes the text (if enabled)
6. Transcript is **auto-copied** to clipboard — paste anywhere with `Ctrl+V`

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Socket.IO client |
| Backend | Node.js, Express, Socket.IO, ws |
| Speech AI | Deepgram Nova-2 (WebSocket streaming) |
| LLM | Groq (llama3 / mixtral) |
| Desktop | Electron (system tray, frameless window) |
| Audio | Web Audio API → PCM Linear16 |

---

##  Building for Distribution

```bash
# 1. Build frontend
cd frontend && npm run build

# 2. Build Electron installer (.exe)
cd electron && npm run pack
```

Installer will be in `electron/dist/`.

---

##  Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes
4. Open a pull request

---




