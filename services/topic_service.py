from utils.groq_client import ask_groq

def classify_motion(motion_text: str):
    prompt = f"Classify this debate motion into a category (Politics, Economics, Ethics, Technology, Environment): {motion_text}"
    return ask_groq(prompt)