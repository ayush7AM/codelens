export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on server.' });

  try {
    const { code, language } = req.body;
    if (!code || code.trim().length === 0) {
      return res.status(400).json({ error: 'No code provided.' });
    }

    const prompt = `You are an expert code reviewer. Analyze the following ${language === 'auto' ? '' : language} code and return a JSON object only — no markdown, no extra text.

Return this exact JSON structure:
{
  "overall_score": <number 1-10>,
  "summary": "<2-3 sentence overall assessment>",
  "positives": [
    { "title": "<short title>", "description": "<what is done well>" }
  ],
  "issues": [
    {
      "severity": "<Critical|Warning|Suggestion>",
      "title": "<short issue title>",
      "description": "<clear explanation of the problem and why it matters>",
      "fix_suggestion": "<fixed code snippet or null>"
    }
  ]
}

Code to review:
\`\`\`
${code}
\`\`\`

Focus on: bugs, logic errors, security vulnerabilities, performance problems, bad practices, readability, and missing edge case handling. Be specific and actionable. Return ONLY the JSON.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1500 }
        })
      }
    );

    const rawText = await geminiRes.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(500).json({ error: `Gemini returned unexpected response. Raw: ${rawText.slice(0, 200)}` });
    }

    if (!geminiRes.ok) {
      const msg = data.error?.message || JSON.stringify(data);
      return res.status(geminiRes.status).json({ error: `Gemini API error: ${msg}` });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: `Failed to parse response as JSON. Got: ${cleaned.slice(0, 300)}` });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
