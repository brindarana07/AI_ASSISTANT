AI ASSISTANT

AI ASSISTANT is a calm, focused AI workspace built with React and Flask. It helps users ask questions, summarize long content, create original writing, and get study guidance using the Google Gemini API.

The app is designed to feel simple and thoughtful, with a clean interface that keeps the experience comfortable and distraction-free.

## Features

- Ask questions and get clear, direct answers
- Summarize articles, notes, or long text into concise ideas
- Generate creative content such as stories, poems, or sci-fi prompts
- Get study support with structured guidance and planning
- Choose from multiple response styles for each task
- Copy responses with one click
- Leave lightweight feedback after each answer
- Built with a simple local-first setup for easy development

## Tech Stack

### Frontend
- React
- Vite
- Axios
- Tailwind CSS 

### Backend
- Python
- Flask
- Flask-CORS
- Google GenAI SDK
- SQLite
- python-dotenv

## Project Structure


AI-ASSISTANT/
├── backend/
│   ├── app.py
│   ├── routes.py
│   ├── gemini_service.py
│   ├── prompt_manager.py
│   ├── feedback.py
│   ├── database.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env.example
│   └── start_backend.bat
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
├── README.md
├── .gitignore




