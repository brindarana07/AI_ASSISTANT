from flask import Blueprint, jsonify, request

from database import save_feedback
from prompt_manager import PROMPTS

feedback_bp = Blueprint("feedback", __name__)


@feedback_bp.post("/feedback")
def submit_feedback():
    payload = request.get_json(silent=True) or {}
    required = ("function", "prompt_style", "user_input", "ai_response", "helpful")
    if any(field not in payload for field in required):
        return jsonify(error="Feedback is missing required fields."), 400

    function_name = str(payload["function"])
    prompt_style = str(payload["prompt_style"])
    if function_name not in PROMPTS or prompt_style not in PROMPTS[function_name]:
        return jsonify(error="Invalid feedback function or prompt style."), 400
    if not isinstance(payload["helpful"], bool):
        return jsonify(error="Helpful must be true or false."), 400

    feedback_id = save_feedback(
        function_name,
        prompt_style,
        str(payload["user_input"])[:12000],
        str(payload["ai_response"])[:30000],
        payload["helpful"],
    )
    return jsonify(message="Thank you for your feedback.", id=feedback_id), 201
