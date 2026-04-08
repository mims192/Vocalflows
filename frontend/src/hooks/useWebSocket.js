import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";


export function useWebSocket({ onTranscript, onError }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("https://render-apis-production.up.railway.app", { transports: ["websocket"],withCredentials: true,
 });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("transcript", (data) => onTranscript?.(data));
    socket.on("error", (data) => onError?.(data.message));

    return () => {
      socket.disconnect();
    };
  }, []);

  const startRecording = useCallback((model, language) => {
    socketRef.current?.emit("start-recording", { model, language });
  }, []);

  const stopRecording = useCallback(() => {
    socketRef.current?.emit("stop-recording");
  }, []);

  const sendChunk = useCallback((buffer) => {
    socketRef.current?.emit("audio-chunk", buffer);
  }, []);

  return { connected, startRecording, stopRecording, sendChunk };
}
