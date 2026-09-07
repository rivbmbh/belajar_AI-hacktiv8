const API_URL = 'http://localhost:3000/api/chat';
const STORAGE_KEY_CHAT = 'gemini_chat_session';
const STORAGE_KEY_PROFILE = 'tia_user_profile';

// Global Application State
let conversation = [];
let userProfile = null; // { name, gender, age, status }

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  initProfileState();
  initChatHistory();
  initCarousel();
  initFloatingChat();
  initLandingForm();
  renderChat();
});

/* ==========================================================================
   1. USER PROFILE MANAGEMENT & LOCALSTORAGE
   ========================================================================== */

function initProfileState() {
  const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
  if (savedProfile) {
    try {
      userProfile = JSON.parse(savedProfile);
      syncProfileUI();
    } catch (e) {
      console.error('Gagal membaca profil dari localStorage:', e);
      userProfile = null;
    }
  }
}

function saveProfileData(profile) {
  userProfile = profile;
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Gagal menyimpan profil ke localStorage:', e);
  }
  syncProfileUI();
}

function syncProfileUI() {
  const guard = document.getElementById('chat-profile-guard');
  const greetingEl = document.getElementById('header-user-greeting');
  const banner = document.getElementById('profile-saved-banner');
  const bannerText = document.getElementById('saved-banner-text');

  if (userProfile && userProfile.name) {
    // Hide guard overlay if active
    if (guard) guard.classList.add('hidden');

    // Header subtext
    if (greetingEl) {
      greetingEl.textContent = `Teman cerita: ${userProfile.name}`;
    }

    // Landing form values & saved banner
    if (banner && bannerText) {
      banner.classList.remove('hidden');
      bannerText.textContent = `Halo ${userProfile.name}! Data kamu (${userProfile.gender}, ${userProfile.status}) tersimpan. Klik chat untuk mengobrol dengan Tia!`;
    }

    // Pre-fill landing form
    fillFormFields('input-', userProfile);
    // Pre-fill quick form
    fillFormFields('quick-', userProfile);
  } else {
    if (greetingEl) greetingEl.textContent = 'Teman Cerita Setiamu';
    if (banner) banner.classList.add('hidden');
  }
}

function fillFormFields(prefix, profile) {
  const namaInput = document.getElementById(`${prefix}nama`);
  const genderInput = document.getElementById(`${prefix}gender`);
  const umurInput = document.getElementById(`${prefix}umur`);
  const statusInput = document.getElementById(`${prefix}status`);

  if (namaInput && profile.name) namaInput.value = profile.name;
  if (genderInput && profile.gender) genderInput.value = profile.gender;
  if (umurInput && profile.age) umurInput.value = profile.age;
  if (statusInput && profile.status) statusInput.value = profile.status;
}

/* ==========================================================================
   2. LANDING PAGE FORM & QUICK CHAT PROFILE GUARD
   ========================================================================== */

function initLandingForm() {
  const landingForm = document.getElementById('landing-profile-form');
  if (landingForm) {
    landingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('input-nama').value.trim();
      const gender = document.getElementById('input-gender').value;
      const age = document.getElementById('input-umur').value.trim();
      const status = document.getElementById('input-status').value;

      if (!name || !gender || !status) {
        alert('Mohon lengkapi Nama, Jenis Kelamin, dan Status kamu ya!');
        return;
      }

      saveProfileData({ name, gender, age, status });
      
      // Auto open floating chat box with personalized greeting
      openFloatingChat();
    });
  }

  const quickForm = document.getElementById('quick-profile-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quick-nama').value.trim();
      const gender = document.getElementById('quick-gender').value;
      const age = document.getElementById('quick-umur').value.trim();
      const status = document.getElementById('quick-status').value;

      if (!name || !gender || !status) {
        alert('Mohon lengkapi data dirimu dulu ya!');
        return;
      }

      saveProfileData({ name, gender, age, status });

      // Hide guard overlay
      const guard = document.getElementById('chat-profile-guard');
      if (guard) guard.classList.add('hidden');

      // Focus input
      const userInput = document.getElementById('user-input');
      if (userInput) userInput.focus();
    });
  }
}

/* ==========================================================================
   3. FLOATING CHATBOT WIDGET LOGIC
   ========================================================================== */

function initFloatingChat() {
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const openNavBtn = document.getElementById('open-chat-nav-btn');
  const heroStartBtn = document.getElementById('hero-start-chat-btn');
  const closeBtn = document.getElementById('close-chat-btn');
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const clearBtn = document.getElementById('clear-btn');
  const chatForm = document.getElementById('chat-form');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleFloatingChat);
  }
  if (openNavBtn) {
    openNavBtn.addEventListener('click', openFloatingChat);
  }
  if (heroStartBtn) {
    heroStartBtn.addEventListener('click', openFloatingChat);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeFloatingChat);
  }
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      const guard = document.getElementById('chat-profile-guard');
      if (guard) guard.classList.remove('hidden');
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', clearChatSession);
  }
  if (chatForm) {
    chatForm.addEventListener('submit', handleSendMessage);
  }
}

function toggleFloatingChat() {
  const chatContainer = document.getElementById('chat-container');
  if (chatContainer.classList.contains('hidden')) {
    openFloatingChat();
  } else {
    closeFloatingChat();
  }
}

function openFloatingChat() {
  const chatContainer = document.getElementById('chat-container');
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const openIcon = toggleBtn ? toggleBtn.querySelector('.open-icon') : null;
  const closeIcon = toggleBtn ? toggleBtn.querySelector('.close-icon') : null;
  const guard = document.getElementById('chat-profile-guard');

  if (chatContainer) chatContainer.classList.remove('hidden');
  if (openIcon) openIcon.classList.add('hidden');
  if (closeIcon) closeIcon.classList.remove('hidden');

  // Check if profile exists. If not, show guard form!
  if (!userProfile || !userProfile.name) {
    if (guard) guard.classList.remove('hidden');
  } else {
    if (guard) guard.classList.add('hidden');
    const userInput = document.getElementById('user-input');
    if (userInput) userInput.focus();
  }

  scrollToBottom();
}

function closeFloatingChat() {
  const chatContainer = document.getElementById('chat-container');
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const openIcon = toggleBtn ? toggleBtn.querySelector('.open-icon') : null;
  const closeIcon = toggleBtn ? toggleBtn.querySelector('.close-icon') : null;

  if (chatContainer) chatContainer.classList.add('hidden');
  if (openIcon) openIcon.classList.remove('hidden');
  if (closeIcon) closeIcon.classList.add('hidden');
}

/* ==========================================================================
   4. CHAT HISTORY & MESSAGE HANDLING
   ========================================================================== */

function initChatHistory() {
  const saved = localStorage.getItem(STORAGE_KEY_CHAT);
  if (saved) {
    try {
      conversation = JSON.parse(saved);
      if (!Array.isArray(conversation)) conversation = [];
    } catch (e) {
      console.error('Gagal membaca riwayat chat:', e);
      conversation = [];
    }
  }
}

function saveChatHistory() {
  try {
    localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(conversation));
  } catch (e) {
    console.error('Gagal menyimpan chat:', e);
  }
}

function renderChat() {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

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

function showEmptyState() {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  const nameGreeting = userProfile && userProfile.name ? `Halo ${userProfile.name}!` : 'Halo!';
  
  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'empty-state';
  emptyDiv.innerHTML = `
    <div class="empty-icon"><i class="fa-solid fa-heart-circle-check"></i></div>
    <h3>${nameGreeting} Aku Tia AI 💖</h3>
    <p>Senang sekali bisa jadi teman cerita kamu! Ada yang lagi mengganjal di hati atau pengen kamu tumpahin hari ini?</p>
  `;
  chatBox.appendChild(emptyDiv);
}

function appendMessageUI(role, text) {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

  const emptyState = chatBox.querySelector('.empty-state');
  if (emptyState) emptyState.remove();

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

function showTypingIndicator() {
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;

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
  if (indicator) indicator.remove();
}

function scrollToBottom() {
  const chatBox = document.getElementById('chat-box');
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}

async function handleSendMessage(e) {
  e.preventDefault();

  // Ensure profile is completed
  if (!userProfile || !userProfile.name) {
    const guard = document.getElementById('chat-profile-guard');
    if (guard) guard.classList.remove('hidden');
    return;
  }

  const input = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');
  const userMessage = input.value.trim();

  if (!userMessage) return;

  // 1. Save state & render user message
  const userMsgObj = { role: 'user', text: userMessage };
  conversation.push(userMsgObj);
  saveChatHistory();

  appendMessageUI('user', userMessage);
  input.value = '';

  // 2. Disable controls & show typing
  input.disabled = true;
  sendBtn.disabled = true;
  showTypingIndicator();

  try {
    // 3. Send payload with userProfile to backend API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversation,
        userProfile
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Gagal terhubung ke server Tia AI');
    }

    const botMessage = data.result;

    // 4. Save model response
    const botMsgObj = { role: 'model', text: botMessage };
    conversation.push(botMsgObj);
    saveChatHistory();

    removeTypingIndicator();
    appendMessageUI('model', botMessage);

  } catch (error) {
    console.error('Chat API Error:', error);
    removeTypingIndicator();
    appendMessageUI('bot', `⚠️ **Waduh**: ${error.message || 'Terjadi gangguan saat menghubungi Tia. Coba lagi ya!'}`);
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

function clearChatSession() {
  if (confirm('Apakah kamu yakin ingin menghapus riwayat obrolan dengan Tia?')) {
    conversation = [];
    localStorage.removeItem(STORAGE_KEY_CHAT);
    renderChat();
  }
}

/* ==========================================================================
   5. IMAGINARY CAROUSEL LOGIC
   ========================================================================== */

function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (!slides || slides.length === 0) return;

  let currentIndex = 0;
  let carouselInterval = null;

  function showSlide(index) {
    if (index >= slides.length) currentIndex = 0;
    else if (index < 0) currentIndex = slides.length - 1;
    else currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    carouselInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (carouselInterval) clearInterval(carouselInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideIdx = parseInt(e.target.getAttribute('data-slide'), 10);
      stopAutoPlay();
      showSlide(slideIdx);
      startAutoPlay();
    });
  });

  startAutoPlay();
}
