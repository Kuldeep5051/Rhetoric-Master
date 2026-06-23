import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, render_template, request, jsonify
from services.topic_service import classify_motion
from services.argument_service import analyze_argument
from services.scoring_service import score_performance
from services.delivery_service import analyze_delivery

app = Flask(__name__, template_folder="frontend/templates", static_folder="frontend/static")

@app.route("/")
def home():
    return render_template("chat.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    mode = data.get("mode")
    text = data.get("text", "")

    cleaned_text = text.strip().lower()
    if cleaned_text in ["hi", "hello", "hey"]:
        return jsonify({"reply": "Hello! I am your Rhetoric Master. How can I help you prepare today?"})

    try:
        if mode == "classify":
            reply = classify_motion(text)
        elif mode == "argument":
            result = analyze_argument(text)
            reply = f"Summary: {result['summary']} | Stance: {result['stance']}"
        elif mode == "score":
            reply = score_performance(text)
        elif mode == "delivery":
            reply = analyze_delivery(text)
        else:
            reply = "Unknown mode selected."
    except Exception as e:
        return jsonify({"reply": f"Sorry, an error occurred: {str(e)}"}), 500

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "false").lower() == "true")