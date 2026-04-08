const router = require("express").Router();
const axios = require("axios");
const { GROQ_API_KEY } = require("../config/keys");

const GROQ_BASE = "https://api.groq.com/openai/v1";
const headers = () => ({
  Authorization: `Bearer ${GROQ_API_KEY}`,
  "Content-Type": "application/json",
});

//api/groq/balance 
router.get("/balance", async (req, res) => {
  try {
    const resp = await axios.get(`${GROQ_BASE}/models`, { headers: headers() });
    const models = resp.data.data || [];
    const activeModels = models.filter((m) => !m.id.includes("whisper"));

    res.json({
      status: "active",
      tier: "Free / Pay-as-you-go",
      models_available: activeModels.length,
      note: "Groq does not expose a public balance API. Account is active.",
      top_models: activeModels.slice(0, 5).map((m) => m.id),
    });
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.error?.message || err.message,
    });
  }
});

//api/groq/models 
router.get("/models", async (req, res) => {
  try {
    const resp = await axios.get(`${GROQ_BASE}/models`, { headers: headers() });
    const models = (resp.data.data || []).map((m) => ({
      id: m.id,
      context_window: m.context_window,
    }));
    res.json({ models });
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// Post-process transcript with Groq LLM
// Body: { text, mode, targetLanguage, model }
router.post("/process", async (req, res) => {
  const { text, mode, targetLanguage = "English", model = "llama-3.1-8b-instant" } = req.body;

  if (!text || !mode || mode === "none") {
    return res.json({ result: text });
  }

  const prompts = {
    spelling: `You are a spelling corrector. Fix only spelling errors in the following text. Return ONLY the corrected text with no explanation or preamble:\n\n"${text}"`,
    grammar: `You are a grammar corrector. Fix grammar and punctuation in the following text. Return ONLY the corrected text with no explanation or preamble:\n\n"${text}"`,
    transliteration: `You are a transliteration expert. The following text may contain code-mixed language (e.g. Hinglish, Tanglish, Spanglish). Convert it to the proper native script or clean English. Return ONLY the result:\n\n"${text}"`,
    translation: `Translate the following text to ${targetLanguage}. Return ONLY the translation with no explanation:\n\n"${text}"`,
  };

  const prompt = prompts[mode];
  if (!prompt) return res.status(400).json({ error: `Unknown mode: ${mode}` });

  try {
    const resp = await axios.post(
      `${GROQ_BASE}/chat/completions`,
      {
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.1,
      },
      { headers: headers() }
    );

    const result = resp.data.choices?.[0]?.message?.content?.trim() || text;
    const usage = resp.data.usage;

    res.json({
      result,
      original: text,
      tokens_used: usage?.total_tokens || 0,
    });
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.error?.message || err.message,
    });
  }
});

module.exports = router;
