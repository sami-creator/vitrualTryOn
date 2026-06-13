export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    let bodyStr;
    if (typeof req.body === "string") bodyStr = req.body;
    else if (Buffer.isBuffer(req.body)) bodyStr = req.body.toString();
    else bodyStr = JSON.stringify(req.body);

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: bodyStr
    });

    const rawText = await response.text();

    // محاولة 1: JSON مباشر
    if (rawText.trimStart().startsWith("{")) {
      try {
        const data = JSON.parse(rawText);
        return res.status(response.status).json(data);
      } catch(e) {}
    }

    // محاولة 2: SSE format (data: {...})
    const lines = rawText.split("\n").filter(l => l.startsWith("data: ") && !l.includes("[DONE]"));
    if (lines.length > 0) {
      try {
        const data = JSON.parse(lines[0].replace("data: ", ""));
        return res.status(200).json(data);
      } catch(e) {}
    }

    // إذا فشل كل شيء: أرجع النص الخام
    return res.status(200).json({ raw: rawText, status: response.status });

  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
