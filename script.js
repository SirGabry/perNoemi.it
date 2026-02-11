gsap.registerPlugin(ScrollTrigger, Draggable);

// --- CONFIGURAZIONE CANZONI ---
// AGGIUNGI QUI I TUOI FILE MP3
const songs = [
  { title: "Golden Hour - JVKE", file: "golden.mp3" },
  { title: "Comunque Bella - Battisti", file: "battisti.mp3" },
  { title: "Sparks - Coldplay", file: "sparks.mp3" }
];

// --- ORB SFONDO ---
gsap.to("#orb", {
  scale: 7, 
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5
  }
});

// --- TIMELINE ---
gsap.utils.toArray('.timeline-item').forEach((item, i) => {
  gsap.fromTo(item, 
    { opacity: 0, x: i % 2 === 0 ? -30 : 30 }, 
    { 
      opacity: 1, x: 0, duration: 1, 
      scrollTrigger: { trigger: item, start: "top 80%" }
    }
  );
});

// --- DRAGGABLE FOTO ---
Draggable.create(".polaroid", {
  type: "x,y", edgeResistance: 0.65, bounds: ".gallery-wrapper", inertia: true,
  onPress: function() { gsap.to(this.target, { zIndex: 100, scale: 1.1, duration: 0.2 }); },
  onRelease: function() { gsap.to(this.target, { zIndex: 1, scale: 1, duration: 0.2 }); }
});

// --- TYPEWRITER ---
document.querySelectorAll('.typewriter').forEach(el => {
  const text = el.innerText.trim(); el.innerHTML = '';
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char; span.style.opacity = '0';
    el.appendChild(span);
  });
  gsap.to(el.querySelectorAll('span'), {
    opacity: 1, stagger: 0.02, duration: 0.05,
    scrollTrigger: { trigger: el, start: "top 90%" }
  });
});

// --- GESTIONE MUSICA E PLAYLIST ---
const musicBtn = document.getElementById('music-btn');
const playlistModal = document.getElementById('playlist-modal');
const closePlaylistBtn = document.getElementById('close-playlist');
const songListContainer = document.getElementById('song-list');
const audio = document.getElementById('bg-music');
let isPlaying = false;

// 1. Genera la lista delle canzoni
songs.forEach((song, index) => {
  const div = document.createElement('div');
  div.classList.add('song-item');
  div.innerHTML = `<span>${song.title}</span> <i class="fas fa-play"></i>`;
  
  div.addEventListener('click', () => {
    playSong(song.file, div);
  });
  songListContainer.appendChild(div);
});

// 2. Funzione per riprodurre
function playSong(file, element) {
  audio.src = file;
  audio.play();
  isPlaying = true;
  musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  musicBtn.style.animation = 'pulse 1s infinite';
  
  // Aggiorna stile lista
  document.querySelectorAll('.song-item').forEach(el => el.classList.remove('playing'));
  if(element) element.classList.add('playing');
  
  // Chiudi menu dopo selezione
  setTimeout(() => {
    playlistModal.classList.remove('active');
  }, 300);
}

// 3. Apri/Chiudi Menu
musicBtn.addEventListener('click', () => {
  playlistModal.classList.toggle('active');
});

closePlaylistBtn.addEventListener('click', () => {
  playlistModal.classList.remove('active');
});

// --- IL GRAN FINALE ---
const msgContainer = document.getElementById('final-message-container');
const msgText = document.getElementById('giuggiolina-text');
const surpriseBtn = document.getElementById('surprise-btn');

// APRE LA SCRITTA
surpriseBtn.addEventListener('click', () => {
  // Coriandoli
  const duration = 3000; const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#800020', '#B2EBF2', '#ffffff'], disableForReducedMotion: true });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#800020', '#B2EBF2', '#ffffff'], disableForReducedMotion: true });
    if (Date.now() < end) requestAnimationFrame(frame);
  }());

  // Mostra scritta
  gsap.to(msgContainer, { autoAlpha: 1, duration: 0.8 }); // autoAlpha gestisce opacity + visibility
  gsap.fromTo(msgText, { scale: 0.5 }, { scale: 1, duration: 1.5, ease: "elastic.out(1, 0.4)" });
});

// CHIUDE LA SCRITTA (Toccando ovunque)
msgContainer.addEventListener('click', () => {
  gsap.to(msgContainer, { 
    autoAlpha: 0, 
    duration: 0.5,
    onComplete: () => {
      // Opzionale: Reset scala per il prossimo click
      gsap.set(msgText, { scale: 0.5 });
    }
  });
});