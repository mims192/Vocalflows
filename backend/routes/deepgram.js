const router = require("express").Router();
const axios = require("axios");
const { DEEPGRAM_API_KEY } = require("../config/keys");

const DG_BASE = "https://api.deepgram.com/v1";
const headers = () => ({ Authorization: `Token ${DEEPGRAM_API_KEY}` });



router.get("/balance", async (req, res) => {
  try {
    
    const projectsResp = await axios.get(`${DG_BASE}/projects`, { headers: headers() });
    const projects = projectsResp.data.projects;
    
    if (!projects || projects.length === 0) {
      return res.status(404).json({ error: "No Deepgram projects found" });
    }
    console.log(projects);
    const projectId = projects[0].project_id;
    const projectName = projects[0].name;

 
    const balResp = await axios.get(`${DG_BASE}/projects/${projectId}/balances`, {
      headers: headers(),
    });
    console.log(balResp.data);
    const balances = balResp.data.balances || [];
    const primary = balances[0] || null;

   res.json({
      project_id: projectId,
      project_name: projectName,
      balance: primary ? parseFloat(primary.amount).toFixed(4) : "0.0000",
      currency: primary?.units || "USD",
      all_balances: balances,
    });
 
  } catch (err) {
    const status = err.response?.status || 500;
    const dgData = err.response?.data;
    const messageFromBody =
      typeof dgData === "string"
        ? dgData
        : dgData?.err_msg ||
          dgData?.message ||
          dgData?.error?.message ||
          dgData?.error;
    const message = messageFromBody || err.message;
    res.status(status).json({
      error: message,
      details: dgData ?? null,
      contentType: err.response?.headers?.["content-type"] ?? null,
      statusText: err.response?.statusText ?? null,
    });
  }
});
router.get("/models", async (req, res) => {
  try {
    const resp = await axios.get(`${DG_BASE}/models`, { headers: headers() });
    // Filter to speech-to-text models 
    const models = (resp.data?.stt || []).map((m) => ({
      name: m.name,
      canonical_name: m.canonical_name,
      languages: m.languages,
      version: m.version,
      tier: m.metadata?.tier || "general",
    }));
    res.json({ models });
  } catch (err) {
    const status = err.response?.status || 500;
    const dgData = err.response?.data;
    const messageFromBody =
      typeof dgData === "string"
        ? dgData
        : dgData?.err_msg ||
          dgData?.message ||
          dgData?.error?.message ||
          dgData?.error;
    const message = messageFromBody || err.message;
    res.status(status).json({
      error: message,
      details: dgData ?? null,
      contentType: err.response?.headers?.["content-type"] ?? null,
      statusText: err.response?.statusText ?? null,
    });
  }
});

module.exports = router;
