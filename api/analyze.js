export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, language } = req.body;

  if (!code || code.length > 5000) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // ✅ SAFE MODEL
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Analyze this ${language} code:\n\n${code}`
          }
        ]
      })
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Invalid JSON from API",
        raw: text
      });
    }

    if (!response.ok) {
      return res.status(500).json({
        error: "Anthropic API error",
        details: data
      });
    }

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
