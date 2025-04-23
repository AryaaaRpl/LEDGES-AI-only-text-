from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os
import requests
import re

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("GROQ_API_KEY")
API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "gemma2-9b-it"  # ubah jika model sebelumnya error

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    history = request.json.get("history", [])

    messages = [{"role": "system", "content": "Kamu adalah AI yang membantu dan ramah."}]
    messages += history
    messages.append({"role": "user", "content": user_message})

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": messages
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    # Log the full response for better understanding of error
    app.logger.debug(f"API Response Status: {response.status_code}")
    app.logger.debug(f"API Response Text: {response.text}")

    if response.status_code != 200:
        return jsonify({
            "reply": f"Terjadi kesalahan ({response.status_code}) saat menghubungi Groq API.",
            "details": response.text
        }), 500

    try:
        result = response.json()
        bot_reply = result["choices"][0]["message"]["content"]
        bot_reply = re.sub(r"\n{2,}", "\n", bot_reply.strip())
    except Exception as e:
        return jsonify({
            "reply": "Gagal memproses respon dari API.",
            "details": str(e),
            "raw": response.text
        }), 500

    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(debug=True)