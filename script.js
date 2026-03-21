// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const watchAdsBtns = document.querySelectorAll('.watch-ads-btn');
const modal = document.getElementById('keyModal');
const closeBtn = document.querySelector('.close');
const copyKeyBtn = document.getElementById('copyKey');
const generatedKeyDisplay = document.getElementById('generatedKey');

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIav8mZLGHmPxDMud6CxjU52iEdqQ04ZE",
  authDomain: "key-generate-b5685.firebaseapp.com",
  databaseURL: "https://key-generate-b5685.firebaseio.com",
  projectId: "key-generate-b5685",
  storageBucket: "key-generate-b5685.firebasestorage.app",
  messagingSenderId: "1065528905172",
  appId: "1:1065528905172:web:e23b77a92fad5ecbd65a41",
  measurementId: "G-88XF087P7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Hamburger Menu Toggle
hamburger?.addEventListener('click', () => {
  navLinks?.classList.toggle('active');
});

// Show Modal with Key
function showKeyModal(key) {
  generatedKeyDisplay.textContent = key;
  modal.style.display = 'block';
}

// Copy Key to Clipboard
copyKeyBtn?.addEventListener('click', () => {
  const key = generatedKeyDisplay.textContent;
  navigator.clipboard.writeText(key).then(() => {
    alert('Key copied to clipboard!');
  });
});

// Close Modal
closeBtn?.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close Modal if clicked outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Generate Random Key
function generateKey(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Watch Ads Button Logic
if (watchAdsBtns) {
  watchAdsBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const card = e.target.closest('.card');
      const adsRequired = parseInt(card.dataset.adsRequired);
      const validity = parseInt(card.dataset.validity);
      const progressText = card.querySelector('.progress-text');
      const progressBar = card.querySelector('.progress-bar');
      const blurredKey = card.querySelector('.blurred-key');

      let adsWatched = parseInt(progressText.textContent.split('/')[0]);

      if (adsWatched < adsRequired) {
        adsWatched++;
        progressText.textContent = `${adsWatched}/${adsRequired}`;
        progressBar.style.width = `${(adsWatched / adsRequired) * 100}%`;

        if (adsWatched >= adsRequired) {
          btn.disabled = true; // Disable the button
          try {
            const key = generateKey();
            const expiryTime = Date.now() + validity * 60 * 1000;
            const userId = `user_${Math.random().toString(36).substr(2, 9)}`;

            // Save to Firebase
            await set(ref(db, `keys/${userId}`), {
              key,
              expiry: expiryTime,
              used: false
            });

            blurredKey.textContent = key;
            blurredKey.style.filter = 'none';
            showKeyModal(key);

            // Reset the counter after key generation
            setTimeout(() => {
              progressText.textContent = `0/${adsRequired}`;
              progressBar.style.width = '0%';
              btn.disabled = false; // Re-enable the button
            }, 3000);
          } catch (error) {
            alert('Failed to generate key. Please try again.');
            console.error('Error:', error);
            btn.disabled = false; // Re-enable the button on error
          }
        }
      }
    });
  });
}

// Initialize Progress for Each Card
document.querySelectorAll('.card')?.forEach(card => {
  const progressText = card.querySelector('.progress-text');
  const adsRequired = card.dataset.adsRequired;
  progressText.textContent = `0/${adsRequired}`;
});
