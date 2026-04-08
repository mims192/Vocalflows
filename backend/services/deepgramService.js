const WebSocket = require("ws");
const { DEEPGRAM_API_KEY } = require("../config/keys");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);
    let dgSocket = null;
    let isRecording = false;


    socket.on("start-recording", ({ model = "nova-2", language = "en" } = {}) => {
      if (dgSocket) {
        dgSocket.terminate();
        dgSocket = null;
      }
      isRecording = false;

      if (isRecording) {
        socket.emit("error", { message: "Already recording" });
        return;
      }

      const params = new URLSearchParams({
        model,
        language,
        punctuate: "true",
        interim_results: "true",
        smart_format: "true",
        endpointing: "500",
        encoding: "linear16",
        sample_rate: "16000",
        channels: "1",
      });

      const url = `wss://api.deepgram.com/v1/listen?${params.toString()}`;

      try {
        dgSocket = new WebSocket(url, ["token", DEEPGRAM_API_KEY]);

        dgSocket.on("open", () => {
          isRecording = true;
          console.log(`[Deepgram] WebSocket opened for ${socket.id}`);
          socket.emit("recording-started");
        });

        dgSocket.on("message", (data) => {
          try {
            const parsed = JSON.parse(data.toString());
            const alt = parsed?.channel?.alternatives?.[0];
            const transcript = alt?.transcript || "";
            const isFinal = parsed?.is_final === true;
            const confidence = alt?.confidence || 0;

            if (transcript) {
              socket.emit("transcript", { transcript, isFinal, confidence });
            }
          } catch (e) {
            // ignore parse errors
          }
        });

        dgSocket.on("close", (code, reason) => {
          isRecording = false;
          console.log(`[Deepgram] WebSocket closed: ${code}`);
          socket.emit("recording-stopped");
        });

        dgSocket.on("error", (err) => {
          isRecording = false;
          console.error(`[Deepgram] Error: ${err.message}`);
          socket.emit("error", { message: `Deepgram error: ${err.message}` });
        });
      } catch (err) {
        socket.emit("error", { message: `Failed to connect to Deepgram: ${err.message}` });
      }
    });

    socket.on("audio-chunk", (chunk) => {
      if (dgSocket && dgSocket.readyState === WebSocket.OPEN) {
        dgSocket.send(chunk);
      }
    });

    socket.on("stop-recording", () => {
      if (dgSocket) {
        if (dgSocket.readyState === WebSocket.OPEN) {
          dgSocket.send(JSON.stringify({ type: "CloseStream" }));
        }
        dgSocket.close();
        dgSocket = null;
      }
      isRecording = false;
      socket.emit("recording-stopped");
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
      if (dgSocket) {
        dgSocket.close();
        dgSocket = null;
      }
    });
  });
};
//Deepgram real-time streaming service via Socket.IO
//Proxies audio chunks from the browser to Deepgram's WebSocket API and forwards transcripts back to the client.