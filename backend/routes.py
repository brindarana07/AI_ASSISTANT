from flask import Blueprint, jsonify, request

from config import Config
from gemini_service import GeminiServiceError, generate_content
from prompt_manager import available_prompts, get_prompt

api_bp = Blueprint("api", __name__)


@api_bp.get("/")
def index():
    return jsonify(message="AI Assistant API is running.", endpoints=["POST /generate", "POST /feedback"])


@api_bp.get("/prompts")
def prompts():
    return jsonify(available_prompts())


@api_bp.post("/generate")
def generate():
    payload = request.get_json(silent=True) or {}
    user_input = str(payload.get("user_input", "")).strip()
    function_name = str(payload.get("function", ""))
    prompt_style = str(payload.get("prompt_style", ""))

    if not user_input:
        return jsonify(error="Please enter some text before generating."), 400
    if len(user_input) > Config.MAX_INPUT_LENGTH:
        return jsonify(error=f"Input must be {Config.MAX_INPUT_LENGTH:,} characters or fewer."), 400
    try:
        prompt = get_prompt(function_name, prompt_style, user_input)
        response = generate_content(prompt)
        return jsonify(response=response, function=function_name, prompt_style=prompt_style)
    except ValueError as error:
        return jsonify(error=str(error)), 400
    except GeminiServiceError as error:
        return jsonify(error=str(error)), 502
