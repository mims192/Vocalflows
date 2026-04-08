require("dotenv").config();
module.exports = {
  DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  PORT: process.env.PORT || 5000,
  CORS_ORIGIN: "*",
};
