import axios from "axios";

const api = axios.create({
  //baseURL: "https://render-apis-qg52.onrender.com/api",
  baseURL: "https://render-apis-production.up.railway.app/api",
  timeout: 10000,
});

export const fetchDeepgramBalance = () => api.get("/deepgram/balance");
export const fetchDeepgramModels = () => api.get("/deepgram/models");

export const fetchGroqBalance = () => api.get("/groq/balance");
export const fetchGroqModels = () => api.get("/groq/models");
export const processWithGroq = (text, mode, targetLanguage, model) =>
  api.post("/groq/process", { text, mode, targetLanguage, model });

export default api;
