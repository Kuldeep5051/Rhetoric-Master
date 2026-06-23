import os
from groq import Groq

# Configure Groq — API key must be set via GROQ_API_KEY environment variable
api_key = os.environ.get("GROQ_API_KEY")
if not api_key:
    raise RuntimeError("GROQ_API_KEY environment variable is not set. Please set it before running the app.")

client = Groq(api_key=api_key)

def ask_groq(prompt: str, model: str = "llama-3.1-8b-instant") -> str:
    """
    Send a prompt to Groq and return the response text.
    Uses llama-3.1-8b-instant for fastest response times.
    """
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are Rhetoric Master, an expert AI debate coach. Provide clear, structured, and insightful responses to help users improve their debating skills."
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model=model,
        temperature=0.7,
    )
    return chat_completion.choices[0].message.content
