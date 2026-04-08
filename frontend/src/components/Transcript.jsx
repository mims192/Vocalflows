export default function Transcript({ interim, final, onCopy, onClear, processing }) {
  const display = final + (interim ? (final ? " " : "") + interim : "");
  return (
    <div className="bg-[#12151c] border border-[#252a38] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1e28] border-b border-[#252a38]">
        <span className="text-xs font-bold tracking-widest uppercase text-[#7a8299]">Transcript</span>
        <div className="flex items-center gap-2">
          {processing && (
            <span className="text-[11px] bg-[#a259ff]/15 text-[#a259ff] border border-[#a259ff]/30 px-2.5 py-0.5 rounded-full font-['JetBrains_Mono'] animate-pulse">
              ⚡ Processing…
            </span>
          )}
          <button onClick={onCopy} disabled={!display}
            className="text-xs font-semibold px-3 py-1 rounded-md border border-[#252a38] text-[#7a8299] bg-[#12151c] hover:bg-[#252a38] hover:text-[#e8ecf4] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            📋 Copy
          </button>
          <button onClick={onClear} disabled={!display}
            className="text-xs font-semibold px-3 py-1 rounded-md border border-[#252a38] text-[#7a8299] bg-[#12151c] hover:bg-[#ff4d6d]/15 hover:border-[#ff4d6d] hover:text-[#ff4d6d] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            🗑 Clear
          </button>
        </div>
      </div>
      <div className={`px-5 py-4 min-h-[140px] font-['JetBrains_Mono'] text-[15px] leading-relaxed text-[#e8ecf4] whitespace-pre-wrap break-words ${!display ? "flex items-center" : ""}`}>
        {display ? (
          <p>{final}<span className="text-[#7a8299] italic">{interim ? ` ${interim}` : ""}</span></p>
        ) : (
          <p className="text-[#4a5068] italic text-sm">Your transcribed text will appear here…</p>
        )}
      </div>
    </div>
  );
}