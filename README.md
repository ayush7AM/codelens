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

## 🚀 Tech Stack

- **Frontend** — Vanilla HTML, CSS, JavaScript (zero dependencies)
- **AI** — Anthropic Claude Sonnet API (`claude-sonnet-4-20250514`)
- **Deployment** — Vercel

## 📦 Setup & Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/codelens.git
cd codelens

# Open directly in browser (no build step needed)
open index.html
```

> **Note:** The app uses the Anthropic API. The API key is handled via Anthropic's browser-based auth — no `.env` setup needed for the hosted version.

## 🛠 How It Works

1. Paste your code into the editor
2. Select the programming language
3. Click **Analyze Code**
4. The app sends your code to Claude with a structured prompt
5. Claude returns a JSON report with classified issues and fix suggestions
6. Results render as color-coded cards with an exportable report

## 📁 Project Structure

```
codelens/
├── index.html        # Full app (single-file architecture)
├── vercel.json       # Vercel deployment config
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT — feel free to use this in your own projects.

---

Built by [Ayush](https://github.com/YOUR_USERNAME) · Powered by [Anthropic Claude](https://anthropic.com)
