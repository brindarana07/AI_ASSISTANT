"""Prompt catalog for the four assistant capabilities."""

PROMPTS = {
    "question": {
        "brief": """You are a precise factual assistant. Answer the user's question directly and accurately in no more than 120 words. If key context is missing or the answer is uncertain, say so plainly.\n\nQuestion: {user_input}""",
        "detailed": """You are an expert educator. Give a correct, detailed explanation of the user's question. Structure it with a short answer first, then clear supporting points and a practical example when helpful. Do not invent facts.\n\nQuestion: {user_input}""",
        "teacher": """Act as a patient teacher. Explain the answer to the user's question in approachable language, progressing from the core idea to details. Define unfamiliar terms and finish with one quick takeaway.\n\nQuestion: {user_input}""",
    },
    "summarize": {
        "paragraph": """Summarize the following text in one concise, coherent paragraph. Preserve the main claim, essential evidence, and conclusion. Do not add information.\n\nText: {user_input}""",
        "bullets": """Summarize the following text as 4–7 concise bullet points. Focus on the most important facts, decisions, and implications. Do not add information.\n\nText: {user_input}""",
        "eli5": """Explain the following text as if to a curious five-year-old. Use simple words, short sentences, and a familiar analogy if useful. Keep the original meaning accurate.\n\nText: {user_input}""",
    },
    "creative": {
        "story": """Write an original, engaging short story from the user's idea. Include a vivid setting, a character who wants something, a small conflict, and a satisfying ending. Aim for 350–500 words.\n\nIdea: {user_input}""",
        "poem": """Write an original poem inspired by the user's idea. Use evocative imagery and a deliberate rhythm. Do not quote or imitate living authors.\n\nIdea: {user_input}""",
        "sci_fi": """Create an original science-fiction scene from the user's idea. Ground one imaginative technology or discovery in human stakes, sensory detail, and a compelling moment of change. Aim for 350–500 words.\n\nIdea: {user_input}""",
    },
    "study": {
        "motivational": """Give warm, realistic study encouragement for the user's situation. Acknowledge the challenge, suggest 3 immediately actionable habits, and end with a small next step they can take today.\n\nSituation: {user_input}""",
        "mentor": """Act as a professional learning mentor. Analyze the user's study situation, identify likely obstacles, and recommend a practical, sustainable strategy with priorities and trade-offs.\n\nSituation: {user_input}""",
        "step_by_step": """Create a specific step-by-step study plan for the user's situation. Include a first action, a timed session structure, review method, break strategy, and a way to measure progress. Keep it realistic.\n\nSituation: {user_input}""",
    },
}


def get_prompt(function_name: str, prompt_style: str, user_input: str) -> str:
    """Return a formatted prompt or raise ValueError for an unsupported selection."""
    try:
        template = PROMPTS[function_name][prompt_style]
    except KeyError as error:
        raise ValueError("Unsupported function or prompt style.") from error
    return template.format(user_input=user_input.strip())


def available_prompts() -> dict:
    """Expose the supported function/style choices to the client."""
    return {function_name: list(styles) for function_name, styles in PROMPTS.items()}
