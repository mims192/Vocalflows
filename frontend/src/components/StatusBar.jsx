export default function StatusBar({ connected, isRecording, error }) {
  return (
    <div className="flex items-center gap-5 px-6 py-2 bg-[#12151c] border-b border-[#252a38] text-xs font-['JetBrains_Mono'] text-[#7a8299]">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${connected ? "bg-[#00e676] shadow-[0_0_6px_#00e676]" : "bg-[#ff4d6d]"}`} />
        <span>{connected ? "Backend connected" : "Backend disconnected"}</span>
      </div>
      {isRecording && (
        <div className="flex items-center gap-2 text-[#ff4d6d] animate-pulse">
          <span className="w-2 h-2 rounded-full bg-[#ff4d6d]" />
          <span>Recording</span>
        </div>
      )}
    </div>
  );
}