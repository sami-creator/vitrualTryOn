export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { image, prompt } = req.body;

    const response = await fetch("https://ai.api.nvidia.com/v1/images/edits", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen-image-edit",
        image: image,
        prompt: prompt,
        n: 1,
        response_format: "b64_json"
      })
    });

    const rawText = await response.text();
    try {
      const data = JSON.parse(rawText);
      return res.status(response.status).json(data);
    } catch(e) {
      return res.status(200).json({ raw: rawText, httpStatus: response.status });
    }

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
