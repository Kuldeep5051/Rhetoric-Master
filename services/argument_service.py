from utils.groq_client import ask_groq

def analyze_argument(text: str):
    summary = ask_groq(f"Summarize this argument in 3 sentences: {text}")
    stance = ask_groq(f"Is this argument supporting or opposing the motion? Text: {text}")
    return {"summary": summary, "stance": stance}