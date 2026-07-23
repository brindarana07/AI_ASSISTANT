import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone

from config import Config


@contextmanager
def get_connection():
    connection = sqlite3.connect(Config.DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()


def init_db() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                function TEXT NOT NULL,
                prompt_style TEXT NOT NULL,
                user_input TEXT NOT NULL,
                ai_response TEXT NOT NULL,
                helpful INTEGER NOT NULL CHECK (helpful IN (0, 1)),
                timestamp TEXT NOT NULL
            )
            """
        )


def save_feedback(function_name: str, prompt_style: str, user_input: str, ai_response: str, helpful: bool) -> int:
    with get_connection() as connection:
        cursor = connection.execute(
            """INSERT INTO feedback (function, prompt_style, user_input, ai_response, helpful, timestamp)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (function_name, prompt_style, user_input, ai_response, int(helpful), datetime.now(timezone.utc).isoformat()),
        )
        return cursor.lastrowid
