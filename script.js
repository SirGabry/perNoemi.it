gsap.registerPlugin(ScrollTrigger, Draggable);

// 1. Orb Expansion 
gsap.to("#orb", {
  scale: 7, 
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5
  }
});

// 2. Timeline Animation
gsap.utils.toArray('.timeline-item').forEach((item, i) => {
  gsap.fromTo(item, 
    { opacity: 0, x: i % 2 === 0 ? -30 : 30 }, 
    { 
      opacity: 1, x: 0, 
      duration: 1, 
      scrollTrigger: {
        trigger: item,
        start: "top 80%" // Scatta un po' prima su mobile
      }
    }
  );
});

// 3. Draggable Polaroids
Draggable.create(".polaroid", {
  type: "x,y",
  edgeResistance: 0.65,
  bounds: ".gallery-wrapper",
  inertia: true,
  onPress: function() {
    gsap.to(this.target, { zIndex: 100, scale: 1.1, duration: 0.2 });
  },
  onRelease: function() {
    gsap.to(this.target, { zIndex: 1, scale: 1, duration: 0.2 });
  }
});

// 4. Typewriter Effect
document.querySelectorAll('.typewriter').forEach(el => {
  const text = el.innerText.trim();
  el.innerHTML = '';
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char;
    // Aggiungi stile inline per sicurezza
    span.style.opacity = '0';
    el.appendChild(span);
  });
  
  gsap.to(el.querySelectorAll('span'), {
    opacity: 1,
    stagger: 0.02,
    duration: 0.05,
    scrollTrigger: {
      trigger: el,
      start: "top 90%" // Parte prima che l'utente debba scrollare troppo
    }
  });
});

// 5. Musica
const musicBtn = document.getElementById('music-btn');
const audio = document.getElementById('bg-music');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    musicBtn.style.animation = 'none';
  } else {
    audio.play();
    musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    musicBtn.style.animation = 'pulse 1s infinite';
  }
  isPlaying = !isPlaying;
});

// 6. IL GRAN FINALE
document.getElementById('surprise-btn').addEventListener('click', () => {
  
  // A. Coriandoli (Ottimizzati per mobile)
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4, // Ridotto per performance su iPhone
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#800020', '#B2EBF2', '#ffffff'],
      disableForReducedMotion: true // Accessibilità iOS
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#800020', '#B2EBF2', '#ffffff'],
      disableForReducedMotion: true
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());

  // B. Animazione Scritta "Giuggiolina"
  const msgContainer = document.getElementById('final-message-container');
  const msgText = document.getElementById('giuggiolina-text');

  gsap.to(msgContainer, {
    visibility: 'visible',
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  });

  gsap.to(msgText, {
    scale: 1, // Torna a grandezza naturale (definito nel CSS responsive)
    duration: 1.5,
    ease: "elastic.out(1, 0.4)"
  });

});