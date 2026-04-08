export default function RecordButton({ isRecording, hotkey, onMouseDown, onMouseUp }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <button
        className={`w-28 h-28 rounded-full border-2 relative transition-all outline-none select-none cursor-pointer
          ${isRecording
            ? "border-[#ff4d6d] bg-[#ff4d6d]/10 shadow-[0_0_0_10px_rgba(255,77,109,0.15),0_0_0_20px_rgba(255,77,109,0.07)] animate-pulse"
            : "border-[#252a38] bg-[#1a1e28] hover:border-[#00e5ff] hover:shadow-[0_0_0_6px_rgba(0,229,255,0.1)]"}`}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchEnd={onMouseUp}
      >
        <span className="flex items-center justify-center w-full h-full relative">
          <span className={`absolute inset-2 rounded-full border-[1.5px] transition-colors
            ${isRecording ? "border-[#ff4d6d]" : "border-[#252a38]"}`} />
          <span className="text-4xl relative z-10">{isRecording ? "🔴" : "🟥"}</span>
        </span>
      </button>
      <div className="text-[13px] text-[#7a8299] font-['JetBrains_Mono'] text-center">
        {isRecording ? (
          <span className="text-[#ff4d6d] font-semibold">Recording… release to transcribe</span>
        ) : (
          <span>
            Hold <kbd className="bg-[#1a1e28] border border-[#252a38] rounded px-1.5 py-0.5 text-[#00e5ff] text-xs">{hotkey}</kbd> or click & hold
          </span>
        )}
      </div>
    </div>
  );
}