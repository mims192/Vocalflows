const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { PORT, CORS_ORIGIN } = require("./config/keys");

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use("/api/deepgram", require("./routes/deepgram"));
app.use("/api/groq", require("./routes/groq"));

app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, methods: ["GET", "POST"] },
});

require("./services/deepgramService")(io);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`VocalFlow backend running at http://localhost:${PORT}`);
  console.log(`   WebSocket ready for audio streaming`);
});
