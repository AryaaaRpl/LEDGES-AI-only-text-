// script.js

const chatHistoryContainer = document.getElementById("chatHistory");
const sendMessageBtn = document.getElementById("sendMessageBtn");
const userMessageInput = document.getElementById("userMessage");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let history = []; // Array to hold the message history

// Function to append messages to the chat
function appendMessage(role, content) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add(role);
  messageDiv.textContent = content;
  chatHistoryContainer.appendChild(messageDiv);
}

// Send message to server
sendMessageBtn.addEventListener("click", async () => {
  const userMessage = userMessageInput.value;
  
  if (!userMessage.trim()) return; // Prevent sending empty messages

  history.push({ role: "user", content: userMessage });  // Add to history
  appendMessage("user", userMessage);
  
  userMessageInput.value = "";  // Clear input field

  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage, history })
  });
  
  const data = await response.json();
  
  if (data.reply) {
    history.push({ role: "assistant", content: data.reply });  // Add bot reply to history
    appendMessage("assistant", data.reply);
  }
});

// Clear history
clearHistoryBtn.addEventListener("click", () => {
  history = [];  // Reset history
  chatHistoryContainer.innerHTML = "";  // Clear chat history from UI
});

// script.js

// Memuat history dari localStorage jika ada
window.onload = function () {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    updateChatHistory(history);
  };
  
  // Mengirim pesan
  function sendMessage() {
    const userMessage = document.getElementById('userMessage').value;
    if (userMessage.trim() === "") return;  // Jangan kirim pesan kosong
  
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
  
    // Menambah pesan user ke dalam history
    history.push({ role: 'user', content: userMessage });
    updateChatHistory(history);
  
    // Mengirim pesan ke server
    fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        history: history,
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Menambahkan balasan bot ke dalam history
      history.push({ role: 'assistant', content: data.reply });
      updateChatHistory(history);
  
      // Menyimpan history di localStorage
      localStorage.setItem('chatHistory', JSON.stringify(history));
    })
    .catch(error => console.error('Error:', error));
    
    // Mengosongkan input message
    document.getElementById('userMessage').value = '';
  }
  
  // Menampilkan history chat di halaman
  function updateChatHistory(history) {
    const chatHistoryDiv = document.getElementById('chatHistory');
    chatHistoryDiv.innerHTML = '';  // Bersihkan history lama
  
    // Menambahkan pesan dari history
    history.forEach(msg => {
      const div = document.createElement('div');
      div.classList.add(msg.role);
      div.textContent = msg.content;
      chatHistoryDiv.appendChild(div);
    });
  }
  
  // Menghapus history chat
  function clearHistory() {
    localStorage.removeItem('chatHistory');
    updateChatHistory([]);
  }
  
