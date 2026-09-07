const API_URL = 'http://localhost:3000/api/chat';
const STORAGE_KEY = 'gemini_chat_session';

const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');
const clearBtn = document.getElementById('clear-btn');

// In-memory conversation state: array of { role: 'user' | 'model', text: string }
let conversation = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadHistory();
  renderChat();
});

// Load history from localStorage
function loadHistory() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      conversation = JSON.parse(saved);
      if (!Array.isArray(conversation)) {
        conversation = [];
      }
    } catch (e) {
      console.error('Gagal membaca riwayat chat dari localStorage:', e);
      conversation = [];
    }
  }
}

// Save current conversation state to localStorage
function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
  } catch (e) {
    console.error('Gagal menyimpan riwayat chat ke localStorage:', e);
  }
}

// Render the entire chat list from memory
function renderChat() {
  chatBox.innerHTML = '';

  if (conversation.length === 0) {
    showEmptyState();
    return;
  }

  conversation.forEach(msg => {
    appendMessageUI(msg.role, msg.text);
  });

  scrollToBottom();
}

// Display welcome message if no history exists
function showEmptyState() {
  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'empty-state';
  emptyDiv.innerHTML = `
    <div class="empty-icon"><i class="fa-solid fa-robot"></i></div>
    <h3>Halo! Ada yang bisa saya bantu?</h3>
    <p>Tanyakan apa saja kepada Gemini AI Assistant. Riwayat percakapan Anda akan tersimpan secara otomatis di browser ini.</p>
  `;
  chatBox.appendChild(emptyDiv);
}

// Append a single message bubble to the chat box DOM
function appendMessageUI(role, text) {
  // Remove empty state if currently displayed
  const emptyState = chatBox.querySelector('.empty-state');
  if (emptyState) {
    emptyState.remove();
  }

  const isUser = role === 'user';
  const msgRow = document.createElement('div');
  msgRow.classList.add('message-row', isUser ? 'user-row' : 'bot-row');

  const avatar = document.createElement('div');
  avatar.classList.add('avatar-bubble');
  avatar.innerHTML = isUser
    ? '<i class="fa-solid fa-user"></i>'
    : '<i class="fa-solid fa-robot"></i>';

  const msgBubble = document.createElement('div');
  msgBubble.classList.add('message-bubble', isUser ? 'user' : 'bot');

  if (!isUser) {
    // Parse Markdown for AI responses if marked is available
    if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
      msgBubble.innerHTML = marked.parse(text);
    } else {
      msgBubble.textContent = text;
    }
  } else {
    msgBubble.textContent = text;
  }

  if (isUser) {
    msgRow.appendChild(msgBubble);
    msgRow.appendChild(avatar);
  } else {
    msgRow.appendChild(avatar);
    msgRow.appendChild(msgBubble);
  }

  chatBox.appendChild(msgRow);
  scrollToBottom();
  return msgRow;
}

// Display animated typing indicator while waiting for API response
function showTypingIndicator() {
  const indicatorRow = document.createElement('div');
  indicatorRow.id = 'typing-indicator';
  indicatorRow.classList.add('message-row', 'bot-row');
  indicatorRow.innerHTML = `
    <div class="avatar-bubble"><i class="fa-solid fa-robot"></i></div>
    <div class="message-bubble bot typing">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  `;
  chatBox.appendChild(indicatorRow);
  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) {
    indicator.remove();
  }
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle Form Submission
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // 1. Add user message to state & localStorage
  const userMsgObj = { role: 'user', text: userMessage };
  conversation.push(userMsgObj);
  saveHistory();

  // 2. Render user message in UI & clear input
  appendMessageUI('user', userMessage);
  input.value = '';

  // 3. Disable controls & show typing indicator
  input.disabled = true;
  sendBtn.disabled = true;
  showTypingIndicator();

  try {
    // 4. Send conversation array to backend API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ conversation })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal tersambung ke server');
    }

    const botMessage = data.result;

    // 5. Add model message to state & localStorage
    const botMsgObj = { role: 'model', text: botMessage };
    conversation.push(botMsgObj);
    saveHistory();

    // 6. Update UI
    removeTypingIndicator();
    appendMessageUI('model', botMessage);

  } catch (error) {
    console.error('Chat API Error:', error);
    removeTypingIndicator();
    appendMessageUI('bot', `⚠️ **Error**: ${error.message || 'Terjadi kesalahan saat berkomunikasi dengan server.'}`);
  } finally {
    // 7. Re-enable input controls
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
});

// Clear Chat Session
clearBtn.addEventListener('click', () => {
  if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat chat session ini?')) {
    conversation = [];
    localStorage.removeItem(STORAGE_KEY);
    renderChat();
  }
});
