const chatHistoryContainer = document.getElementById("chatHistory");
const userMessageInput = document.getElementById("userMessage");
const botSound = document.getElementById("botSound");
let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

window.onload = () => {
  updateChatHistory(history);
};

function appendMessage(role, content, isCoding = false) {
  const div = document.createElement("div");

  if (role === "user") {
    div.classList.add("user");
  } else if (isCoding) {
    div.classList.add("assistant-coding");
  } else {
    div.classList.add("assistant");
  }

  div.innerHTML = `<div class="message-text">${content}`;
  div.classList.add("fade-in");
  chatHistoryContainer.appendChild(div);
  chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
}

function sendMessage() {
  const userMessage = userMessageInput.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  history.push({ role: "user", content: userMessage });
  userMessageInput.value = "";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage, history }),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.json();
  })
  .then((data) => {
    if (!data.reply) {
      throw new Error("Server did not return 'reply'");
    }

    const botReply = data.reply;

    // Cek apakah balasan AI berisi code (baru kasih style coding)
    const isCodingReply = /```|function|def|{|\}/i.test(botReply);

    appendMessage("assistant", botReply, isCodingReply);

    history.push({ role: "assistant", content: botReply });
    localStorage.setItem("chatHistory", JSON.stringify(history));
    if (botSound) botSound.play();
  })
  .catch((err) => {
    console.error("Error handling chat:", err);
    appendMessage("assistant", "⚠️ Terjadi kesalahan saat menghubungi AI.");
  });
}

function updateChatHistory(chat) {
  chatHistoryContainer.innerHTML = "";
  chat.forEach((msg) => {
    appendMessage(msg.role, msg.content);
  });
}

function clearHistory() {
  localStorage.removeItem("chatHistory");
  history = [];
  chatHistoryContainer.innerHTML = "";
}

userMessageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
