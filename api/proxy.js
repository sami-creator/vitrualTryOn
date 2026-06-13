export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: typeof req.body === "string" ? req.body : JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
