import os
import logging

import httpx
from google import genai
from google.genai import errors

from config import Config

logger = logging.getLogger(__name__)

class GeminiServiceError(Exception):
    """Safe API-facing error that can be shown to a user."""


def _remove_unavailable_local_proxy() -> None:
    """Avoid a known unusable localhost proxy injected by some dev environments.

    A real corporate proxy is left untouched. Only the unavailable loopback port
    used by the local sandbox is removed so the Gemini SDK can reach Google.
    """
    for variable in ("HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY", "http_proxy", "https_proxy", "all_proxy"):
        value = os.environ.get(variable, "")
        if "127.0.0.1:9" in value or "localhost:9" in value:
            os.environ.pop(variable, None)


def generate_content(prompt: str) -> str:
    # In development mode return a mock response so the app can be exercised
    # without a real Gemini API key or a reachable external service.
    if Config.DEBUG:
        return f"(mock) Generated content for prompt: {prompt[:400]}"
    if not Config.GEMINI_API_KEY:
        raise GeminiServiceError("Gemini is not configured. Add GEMINI_API_KEY to backend/.env and restart the server.")

    try:
        _remove_unavailable_local_proxy()
        client = genai.Client(api_key=Config.GEMINI_API_KEY)
        response = client.models.generate_content(model=Config.GEMINI_MODEL, contents=prompt)
        text = (response.text or "").strip()
        if not text:
            raise GeminiServiceError("Gemini returned an empty response. Please try again.")
        return text
    except errors.ClientError as error:
        status = getattr(error, "code", None)
        if status in (401, 403):
            raise GeminiServiceError("Gemini rejected the API key. Check GEMINI_API_KEY in backend/.env.") from error
        if status == 429:
            raise GeminiServiceError("Gemini's free-tier rate limit was reached. Please wait a moment and try again.") from error
        raise GeminiServiceError("Gemini could not process that request. Please try again shortly.") from error
    except (TimeoutError, ConnectionError, httpx.RequestError) as error:
        raise GeminiServiceError("Could not reach Gemini. Check your internet connection and try again.") from error
    except GeminiServiceError:
        raise
    except Exception as error:
        # Keep detailed diagnostics in the server log; never return provider internals to the browser.
        logger.exception("Unexpected Gemini SDK failure: %s", type(error).__name__)
        raise GeminiServiceError("An unexpected Gemini error occurred. Please try again.") from error
