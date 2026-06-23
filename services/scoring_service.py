from utils.groq_client import ask_groq

def score_performance(text: str):
    prompt = (
        "Evaluate the following debate performance. Assess clarity, logic, and persuasion. "
        "Give a score out of 10 for each category and explain briefly.\n\n"
        f"Speech/Argument: {text}"
    )
    return ask_groq(prompt)