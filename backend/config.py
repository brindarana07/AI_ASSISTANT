import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


class Config:
    """Runtime settings loaded from backend/.env."""

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
    GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-latest").strip()
    DATABASE_PATH = os.getenv("DATABASE_PATH", str(BASE_DIR / "assistant_feedback.db"))
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    MAX_INPUT_LENGTH = 12000
