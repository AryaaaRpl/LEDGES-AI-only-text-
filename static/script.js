const chatHistoryContainer = document.getElementById("chatHistory");
const userMessageInput = document.getElementById("userMessage");
const botSound = document.getElementById("botSound");
let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

window.onload = () => {
  updateChatHistory(history);
};

function appendMessage(role, content) {
  const div = document.createElement("div");
  div.classList.add(role === "user" ? "user" : "assistant");

  // Deteksi jika ada kode dalam ```...```
  if (/```[\s\S]*?```/.test(content)) {
    const parts = content.split(/```(?:\w+)?/g);
    const mainText = parts[0].trim();
    const codeBlock = parts[1]?.replace("```", "").trim();

    div.innerHTML = `
      <div class="message-text">${mainText}</div>
      <pre><code>${codeBlock}</code></pre>
      <button class="copy-btn" onclick="copyToClipboard(this)">Salin</button>
    `;
  } else {
    div.innerHTML = `<div class="message-text">${content}</div>`;
  }

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
    .then((res) => res.json())
    .then((data) => {
      const botReply = data.reply;
      appendMessage("assistant", botReply);
      history.push({ role: "assistant", content: botReply });
      localStorage.setItem("chatHistory", JSON.stringify(history));
      if (botSound) botSound.play();
    })
    .catch((err) => {
      appendMessage("assistant", "⚠️ Terjadi kesalahan.");
      console.error(err);
    });
}

function copyToClipboard(button) {
  const code = button.previousElementSibling.textContent;
  navigator.clipboard.writeText(code).then(() => {
    button.textContent = "Tersalin!";
    setTimeout(() => (button.textContent = "Salin"), 2000);
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

// Enter key support
userMessageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
const chatHistoryContainer = document.getElementById("chatHistory");
const userMessageInput = document.getElementById("userMessage");
const botSound = document.getElementById("botSound");
let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

window.onload = () => {
  updateChatHistory(history);
};

function appendMessage(role, content) {
  const div = document.createElement("div");
  div.classList.add(role === "user" ? "user" : "assistant");

  // Deteksi jika ada kode dalam ```...```
  if (/```[\s\S]*?```/.test(content)) {
    const parts = content.split(/```(?:\w+)?/g);
    const mainText = parts[0].trim();
    const codeBlock = parts[1]?.replace("```", "").trim();

    div.innerHTML = `
      <div class="message-text">${mainText}</div>
      <pre><code>${codeBlock}</code></pre>
      <button class="copy-btn" onclick="copyToClipboard(this)">Salin</button>
    `;
  } else {
    div.innerHTML = `<div class="message-text">${content}</div>`;
  }

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
    .then((res) => res.json())
    .then((data) => {
      const botReply = data.reply;
      appendMessage("assistant", botReply);
      history.push({ role: "assistant", content: botReply });
      localStorage.setItem("chatHistory", JSON.stringify(history));
      if (botSound) botSound.play();
    })
    .catch((err) => {
      appendMessage("assistant", "⚠️ Terjadi kesalahan.");
      console.error(err);
    });
}

function copyToClipboard(button) {
  const code = button.previousElementSibling.textContent;
  navigator.clipboard.writeText(code).then(() => {
    button.textContent = "Tersalin!";
    setTimeout(() => (button.textContent = "Salin"), 2000);
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

// Enter key support
userMessageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
