from utils.groq_client import ask_groq

def analyze_delivery(transcript: str):
    prompt = f"Analyze the delivery style of this debate speech transcript: {transcript}. Focus on pitch, tempo, and confidence."
    return ask_groq(prompt)