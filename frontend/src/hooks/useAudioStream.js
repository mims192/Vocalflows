import { useRef, useCallback } from "react";


export function useAudioStream({ onChunk, onError }) {
  const streamRef = useRef(null);
  const contextRef = useRef(null);
  const processorRef = useRef(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: 16000 });
      contextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);

      
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);

        const pcm = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          pcm[i] = Math.max(-32768, Math.min(32767, input[i] * 32768));
        }
        onChunk(pcm.buffer);
      };

      source.connect(processor);
      processor.connect(ctx.destination);
    } catch (err) {
      onError?.(err.message);
    }
  }, [onChunk, onError]);

  const stop = useCallback(() => {
    processorRef.current?.disconnect();
    processorRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    contextRef.current?.close();
    contextRef.current = null;
  }, []);

  return { start, stop };
}
//Uses AudioWorklet (preferred) or ScriptProcessor as fallback