import { useState, useEffect } from "react";
import { fetchDeepgramModels, fetchGroqModels } from "../services/api";
import defaults from "../config/defaults";

const HOTKEYS = ["Alt", "Control", "Shift", "CapsLock", "F9", "F10"];
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
  { code: "pt", label: "Portuguese" },
  { code: "ar", label: "Arabic" },
];
const PROCESS_MODES = [
  { value: "none", label: "None (raw transcript)" },
  { value: "spelling", label: "Spelling correction" },
  { value: "grammar", label: "Grammar correction" },
  { value: "transliteration", label: "Code-mix transliteration" },
  { value: "translation", label: "Translation" },
];

export default function Settings({ settings, onChange }) {
  const [dgModels, setDgModels] = useState([]);
  const [groqModels, setGroqModels] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const [dg, g] = await Promise.all([fetchDeepgramModels(), fetchGroqModels()]);
      setDgModels(dg.data.models || []);
      setGroqModels(g.data.models || []);
    } catch (e) {
      console.error("Failed to fetch models", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const set = (key, value) => onChange({ ...settings, [key]: value });

return (
  <div className="bg-[#12151c] border border-[#252a38] rounded-xl p-6 flex flex-col gap-6">
    <h3 className="text-base font-bold text-[#e8ecf4]">⚙️ Settings</h3>

    {[
      { title: "🎙 Deepgram (Speech-to-Text)", content: (
        <>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#7a8299]">
            Model
            <select value={settings.deepgramModel} onChange={(e) => set("deepgramModel", e.target.value)} className="bg-[#1a1e28] border border-[#252a38] rounded-lg text-[#e8ecf4] font-['JetBrains_Mono'] text-sm px-3 py-2 outline-none focus:border-[#00e5ff]">
              <option value="nova-2">nova-2 (recommended)</option>
              <option value="nova">nova</option>
              <option value="enhanced">enhanced</option>
              <option value="base">base</option>
              {dgModels.map((m, i) => <option key={`${m.canonical_name}-${i}`} value={m.canonical_name}>{m.name}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#7a8299]">
            Language
            <select value={settings.deepgramLanguage} onChange={(e) => set("deepgramLanguage", e.target.value)} className="bg-[#1a1e28] border border-[#252a38] rounded-lg text-[#e8ecf4] font-['JetBrains_Mono'] text-sm px-3 py-2 outline-none focus:border-[#00e5ff]">
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </label>
        </>
      )},
      { title: "⚡ Groq (Post-Processing)", content: (
        <>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#7a8299]">
            Post-processing
            <select value={settings.postProcessMode} onChange={(e) => set("postProcessMode", e.target.value)} className="bg-[#1a1e28] border border-[#252a38] rounded-lg text-[#e8ecf4] font-['JetBrains_Mono'] text-sm px-3 py-2 outline-none focus:border-[#00e5ff]">
              {PROCESS_MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </label>
          {settings.postProcessMode === "translation" && (
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#7a8299]">
              Target language
              <input type="text" value={settings.targetLanguage} onChange={(e) => set("targetLanguage", e.target.value)} placeholder="e.g. Spanish, French, Hindi"
                className="bg-[#1a1e28] border border-[#252a38] rounded-lg text-[#e8ecf4] font-['JetBrains_Mono'] text-sm px-3 py-2 outline-none focus:border-[#00e5ff] w-full" />
            </label>
          )}
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#7a8299]">
            Groq model
            <select value={settings.groqModel} onChange={(e) => set("groqModel", e.target.value)} className="bg-[#1a1e28] border border-[#252a38] rounded-lg text-[#e8ecf4] font-['JetBrains_Mono'] text-sm px-3 py-2 outline-none focus:border-[#00e5ff]">
              <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (fast)</option>
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (accurate)</option>
              <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
              {groqModels.map((m, i) => <option key={`${m.id}-${i}`} value={m.id}>{m.id}</option>)}
            </select>
          </label>
        </>
      )},
      { title: "⌨️ Hotkey", content: (
        <>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#7a8299]">
            Hold-to-record key
            <select value={settings.hotkey} onChange={(e) => set("hotkey", e.target.value)} className="bg-[#1a1e28] border border-[#252a38] rounded-lg text-[#e8ecf4] font-['JetBrains_Mono'] text-sm px-3 py-2 outline-none focus:border-[#00e5ff]">
              {HOTKEYS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2.5 text-xs font-semibold text-[#7a8299] cursor-pointer">
            <input type="checkbox" checked={settings.autoInject} onChange={(e) => set("autoInject", e.target.checked)}
              className="w-4 h-4 accent-[#00e5ff] cursor-pointer" />
            Auto-copy final transcript to clipboard
          </label>
        </>
      )},
    ].map(({ title, content }) => (
      <section key={title} className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-[#7a8299] tracking-wide pb-2 border-b border-[#252a38]">{title}</h4>
        {content}
      </section>
    ))}

    <button onClick={fetchModels} disabled={loading}
      className="self-start text-xs font-semibold px-4 py-2 rounded-lg border border-[#252a38] text-[#7a8299] bg-[#1a1e28] hover:border-[#00e5ff] hover:text-[#00e5ff] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
      {loading ? "Loading models…" : "↻ Refresh Models"}
    </button>
  </div>
);
}
