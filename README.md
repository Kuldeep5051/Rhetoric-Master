# Rhetoric Master 🎤

Rhetoric Master — an AI-powered debate coaching assistant that helps users improve their debating skills. Built with Flask and powered by Groq's fast LLM inference.

## Features

- **Classify Motion** — Categorize debate motions by theme (Politics, Economics, Ethics, etc.)
- **Analyze Argument** — Get summaries and stance detection for your arguments
- **Score Performance** — Receive detailed scoring on clarity, logic, and persuasion
- **Delivery Feedback** — Analyze speech transcripts for pitch, tempo, and confidence
- **Dark/Light Mode** — Toggle between themes
- **Responsive Design** — Works on desktop, tablet, and mobile

## Tech Stack

- **Backend:** Flask + Groq API (LLaMA 3.1 8B Instant)
- **Frontend:** HTML, CSS, JavaScript
- **Icons:** Phosphor Icons
- **Font:** Inter (Google Fonts)

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Set your Groq API key
set GROQ_API_KEY=your_api_key_here

# Run locally
python app.py
```

## Deployment

This app is ready for deployment on **Render**, **Railway**, or **Heroku**.

1. Push to GitHub
2. Connect your repo to Render/Railway
3. Set the `GROQ_API_KEY` environment variable
4. Deploy — the `Procfile` handles the rest

## Project Structure

```
ai_debate_coach/
├── app.py                  # Flask app entry point
├── Procfile                # Production server config
├── requirements.txt        # Python dependencies
├── services/               # AI service modules
│   ├── topic_service.py
│   ├── argument_service.py
│   ├── scoring_service.py
│   └── delivery_service.py
├── utils/
│   └── groq_client.py      # Groq API client
└── frontend/
    ├── templates/
    │   └── chat.html        # Main UI template
    └── static/
        ├── style.css        # Styles + responsive
        └── script.js        # Chat logic + theme toggle
```
