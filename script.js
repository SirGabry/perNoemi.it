gsap.registerPlugin(ScrollTrigger, Draggable);

// 1. Orb Expansion (Il tuo sfondo preferito)
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
        start: "top 80%"
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
  const text = el.innerText.trim(); // Trim per pulire spazi
  el.innerHTML = '';
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char;
    el.appendChild(span);
  });
  
  gsap.to(el.querySelectorAll('span'), {
    opacity: 1,
    stagger: 0.02,
    duration: 0.05,
    scrollTrigger: {
      trigger: el,
      start: "top 85%"
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

// 6. IL GRAN FINALE: Coriandoli + "Giuggiolina"
document.getElementById('surprise-btn').addEventListener('click', () => {
  
  // A. Coriandoli (Confetti)
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#800020', '#B2EBF2', '#ffffff']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#800020', '#B2EBF2', '#ffffff']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());

  // B. Animazione Scritta "Giuggiolina"
  const msgContainer = document.getElementById('final-message-container');
  const msgText = document.getElementById('giuggiolina-text');

  // Rendiamo visibile il container
  gsap.to(msgContainer, {
    visibility: 'visible',
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  });

  // Animazione del testo (Zoom in)
  gsap.to(msgText, {
    scale: 1.5,
    duration: 1.5,
    ease: "elastic.out(1, 0.3)"
  });

});