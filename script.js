// script.js

// Registra i plugin
gsap.registerPlugin(ScrollTrigger);

// 1. Orb Expansion (Sfondo)
gsap.to("#orb", {
  scale: 7, 
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5
  }
});

// 2. Animazione Entrata Sezioni
gsap.utils.toArray('.section').forEach(section => {
  gsap.to(section, {
    opacity: 1,
    y: 0,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 75%", 
      end: "top 40%",
      toggleActions: "play none none reverse" // Fa sparire se torni su (opzionale)
    }
  });
});

// 3. Typewriter Effect (Migliorato)
const typewriterSections = document.querySelectorAll('.typewriter');

typewriterSections.forEach((el) => {
  const originalText = el.textContent.trim().replace(/\s+/g, ' '); // Pulisce spazi extra
  el.innerHTML = ''; 

  const words = originalText.split(' ');
  const allChars = [];

  words.forEach((wordText, index) => {
    const wordSpan = document.createElement('span');
    wordSpan.classList.add('word-wrapper');

    wordText.split('').forEach(char => {
      const charSpan = document.createElement('span');
      charSpan.textContent = char;
      charSpan.classList.add('char-span');
      wordSpan.appendChild(charSpan);
      allChars.push(charSpan);
    });

    el.appendChild(wordSpan);

    if (index < words.length - 1) {
      el.appendChild(document.createTextNode(' '));
    }
  });

  gsap.to(allChars, {
    opacity: 1,
    duration: 0.05, 
    stagger: 0.02,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
    }
  });
});

// 4. Confetti
document.getElementById('explode').addEventListener('click', () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
});

// 5. Fireflies (Luccichio sfondo)
function createFirefly() {
  const firefly = document.createElement('div');
  firefly.classList.add('firefly');
  
  // Posizione random
  firefly.style.left = Math.random() * 100 + 'vw';
  // Durata e ritardo random per sembrare naturale
  firefly.style.animationDuration = Math.random() * 5 + 5 + 's'; 
  firefly.style.animationDelay = Math.random() * 5 + 's';
  
  document.body.appendChild(firefly);
  
  // Rimuovi dopo animazione per non intasare il DOM
  setTimeout(() => {
    firefly.remove();
  }, 10000);
}

setInterval(createFirefly, 500);

// 6. Music Control
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    musicBtn.innerHTML = '<i class="fas fa-music"></i>'; // Icona ferma
    musicBtn.style.animation = 'none';
  } else {
    bgMusic.play();
    musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>'; // Icona volume
    musicBtn.style.animation = 'pulse 1s infinite'; // L'icona pulsa a tempo
  }
  isPlaying = !isPlaying;
});