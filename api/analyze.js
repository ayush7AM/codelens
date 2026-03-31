export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
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

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    // Get raw text first so we can debug non-JSON responses
    const rawText = await anthropicRes.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(500).json({
        error: `Anthropic returned unexpected response (status ${anthropicRes.status}). Raw: ${rawText.slice(0, 200)}`
      });
    }

    if (!anthropicRes.ok) {
      const msg = data.error?.message || JSON.stringify(data);
      if (anthropicRes.status === 401) return res.status(401).json({ error: 'Invalid API key. Check ANTHROPIC_API_KEY in Vercel environment variables.' });
      if (anthropicRes.status === 429) return res.status(429).json({ error: 'Rate limit hit. Wait a moment and try again.' });
      return res.status(anthropicRes.status).json({ error: `Anthropic API error: ${msg}` });
    }

    const text = data.content?.map(b => b.text || '').join('') || '';
    const cleaned = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: `Failed to parse Claude response as JSON. Got: ${cleaned.slice(0, 300)}` });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
