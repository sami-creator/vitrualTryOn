export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.status(200).end();
  
  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer nvapi-jY1b7G67...",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await response.json();
  res.status(response.status).json(data);
}
