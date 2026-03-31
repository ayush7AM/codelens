# CodeLens — AI Code Quality Reviewer

> An AI-powered code review tool that analyzes code for bugs, security vulnerabilities, performance issues, and style problems — built with the Claude API.

![CodeLens Preview](https://img.shields.io/badge/Powered%20by-Claude%20AI-7c6aff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge)

## 🔍 Features

- **Multi-language support** — Python, JavaScript, Java, C++, Go, Rust, TypeScript, SQL, and more
- **Severity classification** — Critical bugs, Warnings, Suggestions, and Positive highlights
- **Fix suggestions** — AI-generated code snippets showing how to fix each issue
- **Quality score** — Overall code quality score out of 10
- **Export report** — Download the full analysis as a `.txt` file
- **Live editor** — Syntax-aware editor with line numbers and Tab support
- **Secure backend** — API key stored server-side via Vercel environment variables

## 🚀 Tech Stack

- **Frontend** — Vanilla HTML, CSS, JavaScript (zero dependencies)
- **Backend** — Vercel Serverless Function (Node.js proxy)
- **AI** — Anthropic Claude Sonnet API (`claude-sonnet-4-20250514`)
- **Deployment** — Vercel

## 📦 Setup & Deploy

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/codelens.git
cd codelens

# 2. Install Vercel CLI
npm install -g vercel

# 3. Deploy (follow prompts)
vercel

# 4. Add your Anthropic API key as an environment variable
#    → Go to vercel.com → your project → Settings → Environment Variables
#    → Add: ANTHROPIC_API_KEY = sk-ant-...
#    → Redeploy once after adding the key
```

## 📁 Project Structure

```
codelens/
├── index.html        # Frontend (single-file)
├── api/
│   └── analyze.js    # Vercel serverless function (API proxy)
├── vercel.json       # Vercel config
├── .gitignore
└── README.md
```

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key — set in Vercel dashboard |

## 🛠 How It Works

1. User pastes code → clicks Analyze
2. Frontend sends `POST /api/analyze` with `{ code, language }`
3. Vercel serverless function forwards request to Anthropic API (with secret key)
4. Claude returns a structured JSON report
5. Results render as color-coded issue cards

---

Built by [Ayush](https://github.com/ayush7AM) · Powered by [Anthropic Claude](https://anthropic.com)
