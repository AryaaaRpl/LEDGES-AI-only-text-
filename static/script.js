const chatHistoryContainer = document.getElementById("chatHistory");
const userMessageInput = document.getElementById("userMessage");
const botSound = document.getElementById("botSound");
let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

// Load history saat halaman dibuka
window.onload = () => {
  updateChatHistory(history);
};

function appendMessage(role, content) {
  const div = document.createElement("div");
  div.classList.add(role === "user" ? "user" : "assistant");

  // Jika mengandung kode markdown
  if (/```[\s\S]*?```/.test(content)) {
    const parts = content.split(/```(?:\w+)?/g);
    div.innerHTML = `<div>${parts[0].trim()}</div><pre><code>${parts[1]?.replace("```", "").trim()}</code></pre>`;
  } else {
    div.textContent = content;
  }

  chatHistoryContainer.appendChild(div);
  chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
}

function typeText(element, text, delay = 20) {
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, delay);
    }
  }
  typing();
}

// ✅ Fungsi kirim pesan (dipanggil dari onclick)
function sendMessage() {
  const userMessage = userMessageInput.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  history.push({ role: "user", content: userMessage });
  userMessageInput.value = "";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage, history })
  })
    .then(res => res.json())
    .then(data => {
      const botDiv = document.createElement("div");
      botDiv.classList.add("assistant");
      chatHistoryContainer.appendChild(botDiv);
      typeText(botDiv, data.reply);
      history.push({ role: "assistant", content: data.reply });
      localStorage.setItem("chatHistory", JSON.stringify(history));
      if (botSound) botSound.play();
    })
    .catch(err => {
      appendMessage("assistant", "⚠️ Terjadi kesalahan.");
      console.error(err);
    });
}

function updateChatHistory(chat) {
  chatHistoryContainer.innerHTML = "";
  chat.forEach(msg => {
    appendMessage(msg.role, msg.content);
  });
}

function clearHistory() {
  localStorage.removeItem("chatHistory");
  history = [];
  chatHistoryContainer.innerHTML = "";
}
