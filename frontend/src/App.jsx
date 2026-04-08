import { useState, useCallback, useRef } from "react";
import RecordButton from "./components/RecordButton";
import Transcript from "./components/Transcript";
import Settings from "./components/Settings";
import BalanceDisplay from "./components/BalanceDisplay";
import StatusBar from "./components/StatusBar";
import { useAudioStream } from "./hooks/useAudioStream";
import { useWebSocket } from "./hooks/useWebSocket";
import { useHotkey } from "./hooks/useHotkey";
import { processWithGroq } from "./services/api";
import defaults from "./config/defaults";
import "./App.css";

export default function App() {
  const [settings, setSettings] = useState(defaults);
  const [isRecording, setIsRecording] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [finalText, setFinalText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("main"); // main | settings | balance
  const accumulatedFinalRef = useRef("");

  const { connected, startRecording, stopRecording, sendChunk } = useWebSocket({
    onTranscript: async ({ transcript, isFinal }) => {
      if (isFinal) {
        accumulatedFinalRef.current += (accumulatedFinalRef.current ? " " : "") + transcript;
        setFinalText(accumulatedFinalRef.current);
        setInterimText("");
      } else {
        setInterimText(transcript);
      }
    },
    onError: (msg) => setError(msg),
  });

  const { start: startAudio, stop: stopAudio } = useAudioStream({
    onChunk: sendChunk,
    onError: (msg) => setError(msg),
  });

  const handleStartRecording = useCallback(async () => {
    if (isRecording) return;
    setError(null);
    setIsRecording(true);
    startRecording(settings.deepgramModel, settings.deepgramLanguage);
    await startAudio();
  }, [isRecording, settings, startRecording, startAudio]);

  const handleStopRecording = useCallback(async () => {
    if (!isRecording) return;
    stopAudio();
    stopRecording();
    setIsRecording(false);
    setInterimText("");

    // Post-process with Groq 
    const raw = accumulatedFinalRef.current;
    if (raw && settings.postProcessMode !== "none") {
      setProcessing(true);
      try {
        const resp = await processWithGroq(
          raw,
          settings.postProcessMode,
          settings.targetLanguage,
          settings.groqModel
        );
        const processed = resp.data.result;
        accumulatedFinalRef.current = processed;
        setFinalText(processed);
      } catch (e) {
        setError("Groq processing failed: " + e.message);
      }
      setProcessing(false);
    }

    // Auto-copy to clipboard
    if (settings.autoInject && accumulatedFinalRef.current) {
      try {
        await navigator.clipboard.writeText(accumulatedFinalRef.current);
      } catch (e) {
        // clipboard permission not granted 
      }
    }
  }, [isRecording, settings, stopAudio, stopRecording]);

  useHotkey({
    hotkey: settings.hotkey,
    onHold: handleStartRecording,
    onRelease: handleStopRecording,
    enabled: activeTab === "main",
  });

  const handleCopy = async () => {
    const text = finalText + (interimText ? " " + interimText : "");
    if (text) await navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setFinalText("");
    setInterimText("");
    accumulatedFinalRef.current = "";
  };

return (
  <div className="bg-[#080a0e]">
  <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-[#0c0e12] text-[#e8ecf4] font-['Syne']">
    <header className="flex items-center justify-between px-6 py-4 bg-[#12151c] border-b border-[#252a38] sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎙</span>
        <span className="text-xl font-black tracking-tight">VocalFlow</span>
        <span className="text-[10px] font-bold tracking-widest uppercase bg-[#00e5ff] text-[#0c0e12] px-2 py-0.5 rounded-full">Windows</span>
      </div>
      <nav className="flex gap-1 bg-[#1a1e28] p-1 rounded-xl border border-[#252a38]">
        {["main", "settings", "balance"].map((tab) => (
          <button
            key={tab}
            className={`text-[13px] font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap
              ${activeTab === tab ? "bg-[#00e5ff] text-[#0c0e12]" : "text-[#7a8299] hover:text-[#e8ecf4] hover:bg-[#252a38]"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "main" && "🎤 Record"}
            {tab === "settings" && "⚙️ Settings"}
            {tab === "balance" && "💳 Balance"}
          </button>
        ))}
      </nav>
    </header>

    <StatusBar connected={connected} isRecording={isRecording} error={error} />

    <main className="flex-1 px-6 py-7 overflow-y-auto">
      {activeTab === "main" && (
        <div className="flex flex-col gap-7">
          <RecordButton isRecording={isRecording} hotkey={settings.hotkey} onMouseDown={handleStartRecording} onMouseUp={handleStopRecording} />
          <Transcript interim={interimText} final={finalText} onCopy={handleCopy} onClear={handleClear} processing={processing} />
        </div>
      )}
      {activeTab === "settings" && <Settings settings={settings} onChange={setSettings} />}
      {activeTab === "balance" && <BalanceDisplay />}
    </main>

    <footer className="px-6 py-3 text-center text-[11px] text-[#4a5068] border-t border-[#252a38] font-['JetBrains_Mono'] tracking-wide">
      Powered by Deepgram · Groq · React · Node.js
    </footer>
  </div>
  </div>
);
}
