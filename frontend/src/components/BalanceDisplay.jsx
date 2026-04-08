import { useEffect, useState } from "react";
import { fetchDeepgramBalance, fetchGroqBalance } from "../services/api";

export default function BalanceDisplay() {
  const [dg, setDg] = useState({ loading: true, data: null, error: null });
  const [groq, setGroq] = useState({ loading: true, data: null, error: null });

  const loadBalances = () => {
    setDg({ loading: true, data: null, error: null });
    setGroq({ loading: true, data: null, error: null });
    fetchDeepgramBalance()
      .then((r) => setDg({ loading: false, data: r.data, error: null }))
      .catch((e) => setDg({ loading: false, data: null, error: e.response?.data?.error || e.message }));
    fetchGroqBalance()
      .then((r) => setGroq({ loading: false, data: r.data, error: null }))
      .catch((e) => setGroq({ loading: false, data: null, error: e.response?.data?.error || e.message }));
  };

  useEffect(() => { loadBalances(); }, []);

  const Card = ({ icon, label, state }) => (
    <div className={`flex items-center gap-4 p-6 relative border-r border-[#252a38] last:border-r-0 hover:bg-[#1a1e28] transition-colors ${state.error ? "bg-[#ff4d6d]/5" : ""}`}>
      <span className="text-3xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold tracking-widest uppercase text-[#7a8299] mb-1">{label}</div>
        {state.loading && <div className="text-sm text-[#4a5068] font-['JetBrains_Mono'] animate-pulse">Loading…</div>}
        {state.error && <div className="text-xs text-[#ff4d6d] font-['JetBrains_Mono']">{state.error}</div>}
        {state.data && (
          <>
            <div className="text-xl font-bold font-['JetBrains_Mono'] text-[#e8ecf4] truncate">
              {label === "Deepgram" ? `$${state.data.balance}` : state.data.tier}
              {label === "Deepgram" && state.data.currency && (
                <span className="text-sm text-[#7a8299] font-normal ml-1">{state.data.currency}</span>
              )}
            </div>
            <div className="text-[11px] text-[#4a5068] font-['JetBrains_Mono'] mt-0.5 truncate">
              {label === "Deepgram" ? state.data.project_name : `${state.data.models_available} models available`}
            </div>
          </>
        )}
      </div>
      <span className={`absolute top-3 right-3 w-2 h-2 rounded-full
        ${state.data ? "bg-[#00e676] shadow-[0_0_6px_#00e676]" : state.error ? "bg-[#ff4d6d]" : "bg-[#4a5068]"}`} />
    </div>
  );

  return (
    <div className="bg-[#12151c] border border-[#252a38] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-[#1a1e28] border-b border-[#252a38]">
        <span className="text-xs font-bold tracking-widest uppercase text-white">API Balance</span>
        <button onClick={loadBalances}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-[#252a38] text-[#7a8299] hover:border-[#00e5ff] hover:text-[#00e5ff] transition-all text-base">
          ↻
        </button>
      </div>
      <div className="grid grid-cols-2">
        <Card icon="🎙" label="Deepgram" state={dg} />
        <Card icon="⚡" label="Groq" state={groq} />
      </div>
    </div>
  );
}