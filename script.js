gsap.registerPlugin(ScrollTrigger, Draggable);

// --- CONFIGURAZIONE CANZONI ---
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

// --- TIMELINE ANIMATION ---
// Uso un delay piccolo per assicurarmi che il CSS sia caricato
setTimeout(() => {
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      // Rilevo se siamo su mobile per l'animazione
      const isMobile = window.innerWidth < 768;
      
      gsap.fromTo(item, 
        { 
            opacity: 0, 
            // Su mobile arriva dal basso, su PC dai lati
            x: isMobile ? 0 : (i % 2 === 0 ? -50 : 50),
            y: isMobile ? 50 : 0
        }, 
        { 
          opacity: 1, x: 0, y: 0, duration: 1, ease: "power2.out",
          scrollTrigger: { 
              trigger: item, 
              start: "top 85%" // Attiva un po' prima
          }
        }
      );
    });
}, 100);

// --- DRAGGABLE FOTO ---
Draggable.create(".polaroid", {
  type: "x,y", 
  edgeResistance: 0.65, 
  bounds: ".gallery-wrapper", 
  inertia: true,
  onPress: function() { 
      gsap.to(this.target, { zIndex: 100, scale: 1.1, rotation: 0, duration: 0.2 }); 
  },
  onRelease: function() { 
      gsap.to(this.target, { zIndex: 1, scale: 1, duration: 0.2 }); 
  }
});

// --- TYPEWRITER ---
document.querySelectorAll('.typewriter').forEach(el => {
  const text = el.innerText.trim(); el.innerHTML = '';
  // Seziono il testo in parole invece che caratteri per evitare problemi di layout
  // (oppure caratteri ma gestiti inline-block se necessario)
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.innerText = char; span.style.opacity = '0';
    el.appendChild(span);
  });
  
  gsap.to(el.querySelectorAll('span'), {
    opacity: 1, stagger: 0.015, duration: 0.05,
    scrollTrigger: { trigger: el, start: "top 95%" }
  });
});

// --- GESTIONE MUSICA (CORRETTA) ---
const musicBtn = document.getElementById('music-btn');
const playlistModal = document.getElementById('playlist-modal');
const closePlaylistBtn = document.getElementById('close-playlist');
const stopMusicBtn = document.getElementById('stop-music');
const songListContainer = document.getElementById('song-list');
const audio = document.getElementById('bg-music');

let isPlaying = false;
let currentSrc = '';

// 1. Genera la lista
songs.forEach((song) => {
  const div = document.createElement('div');
  div.classList.add('song-item');
  div.innerHTML = `<span>${song.title}</span> <i class="fas fa-play"></i>`;
  
  div.addEventListener('click', () => {
    handleSongClick(song.file, div);
  });
  songListContainer.appendChild(div);
});

// 2. Logica Play/Pausa
function handleSongClick(file, element) {
    const icon = element.querySelector('i');

    // Se clicco la canzone che sta già suonando -> PAUSA/PLAY toggle
    if (currentSrc === file) {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            element.classList.remove('playing');
            icon.classList.replace('fa-pause', 'fa-play');
            updateMainIcon(false);
        } else {
            audio.play();
            isPlaying = true;
            element.classList.add('playing');
            icon.classList.replace('fa-play', 'fa-pause');
            updateMainIcon(true);
        }
        return;
    }

    // Nuova canzone
    currentSrc = file;
    audio.src = file;
    audio.play().then(() => {
        isPlaying = true;
        updateUIForNewSong(element);
        updateMainIcon(true);
    }).catch(e => console.log("Audio play error:", e));
}

function updateUIForNewSong(activeElement) {
    // Resetta tutte le icone
    document.querySelectorAll('.song-item').forEach(el => {
        el.classList.remove('playing');
        el.querySelector('i').className = 'fas fa-play';
    });
    // Attiva quella corrente
    activeElement.classList.add('playing');
    activeElement.querySelector('i').className = 'fas fa-pause';
    
    // Mostra bottone stop
    stopMusicBtn.style.display = 'inline-block';
}

function updateMainIcon(playing) {
    if (playing) {
        musicBtn.innerHTML = '<i class="fas fa-compact-disc fa-spin"></i>';
        // Animazione rotazione css se vuoi, o semplice icona
        gsap.to(musicBtn, { rotation: 360, repeat: -1, duration: 3, ease: "linear" });
    } else {
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        gsap.killTweensOf(musicBtn);
        gsap.set(musicBtn, { rotation: 0 });
    }
}

// 3. Stop Button
stopMusicBtn.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0; // Riavvolge
    isPlaying = false;
    currentSrc = '';
    
    document.querySelectorAll('.song-item').forEach(el => {
        el.classList.remove('playing');
        el.querySelector('i').className = 'fas fa-play';
    });
    
    updateMainIcon(false);
    stopMusicBtn.style.display = 'none';
});

// 4. Apertura/Chiusura Menu
musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    playlistModal.classList.toggle('active');
});

closePlaylistBtn.addEventListener('click', () => {
    playlistModal.classList.remove('active');
});

// Chiudi se clicchi fuori
document.addEventListener('click', (e) => {
    if (!playlistModal.contains(e.target) && !musicBtn.contains(e.target)) {
        playlistModal.classList.remove('active');
    }
});


// --- IL GRAN FINALE ---
const msgContainer = document.getElementById('final-message-container');
const msgText = document.getElementById('giuggiolina-text');
const surpriseBtn = document.getElementById('surprise-btn');

surpriseBtn.addEventListener('click', () => {
  // Coriandoli
  const duration = 3000; const end = Date.now() + duration;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#800020', '#B2EBF2', '#ffffff'] });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#800020', '#B2EBF2', '#ffffff'] });
    if (Date.now() < end) requestAnimationFrame(frame);
  }());

  // Mostra scritta
  gsap.to(msgContainer, { autoAlpha: 1, duration: 0.8 });
  gsap.fromTo(msgText, { scale: 0.5 }, { scale: 1, duration: 1.5, ease: "elastic.out(1, 0.4)" });
});

msgContainer.addEventListener('click', () => {
  gsap.to(msgContainer, { 
    autoAlpha: 0, 
    duration: 0.5,
    onComplete: () => gsap.set(msgText, { scale: 0.5 })
  });
});