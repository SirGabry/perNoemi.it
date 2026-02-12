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
setTimeout(() => {
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      const isMobile = window.innerWidth < 768;
      gsap.fromTo(item, 
        { opacity: 0, x: isMobile ? 0 : (i % 2 === 0 ? -50 : 50), y: isMobile ? 50 : 0 }, 
        { 
          opacity: 1, x: 0, y: 0, duration: 1, ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 85%" }
        }
      );
    });
}, 100);

// --- DRAGGABLE FOTO ---
Draggable.create(".polaroid", {
  type: "x,y", edgeResistance: 0.65, bounds: ".gallery-wrapper", inertia: true,
  onPress: function() { gsap.to(this.target, { zIndex: 100, scale: 1.1, rotation: 0, duration: 0.2 }); },
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
    opacity: 1, stagger: 0.015, duration: 0.05,
    scrollTrigger: { trigger: el, start: "top 95%" }
  });
});

// --- MAPPA INTERATTIVA CON LEAFLET ---
if (document.getElementById('map')) {
    const coordFoscolo = [45.3366, 11.5419];
    const coordVolta = [45.3317, 11.5461];

    var map = L.map('map').setView([45.3340, 11.5440], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd', maxZoom: 19
    }).addTo(map);

    var heartIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/210/210545.png', 
        iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -30]
    });

    L.marker(coordFoscolo, {icon: heartIcon}).addTo(map)
        .bindPopup("<b>Capodanno ✨</b><br>Via Ugo Foscolo 18<br>Qui l'ho re-incontrata e ho iniziato a scriverle.");

    L.marker(coordVolta, {icon: heartIcon}).addTo(map)
        .bindPopup("<b>Il Falò 🔥</b><br>Via A. Volta 22<br>Qui ci siamo conosciuti davvero e abbiamo parlato.");
        
    map.scrollWheelZoom.disable();
}


// --- GESTIONE MUSICA ---
const musicBtn = document.getElementById('music-btn');
const playlistModal = document.getElementById('playlist-modal');
const closePlaylistBtn = document.getElementById('close-playlist');
const stopMusicBtn = document.getElementById('stop-music');
const songListContainer = document.getElementById('song-list');
const audio = document.getElementById('bg-music');
let isPlaying = false;
let currentSrc = '';

songs.forEach((song) => {
  const div = document.createElement('div');
  div.classList.add('song-item');
  div.innerHTML = `<span>${song.title}</span> <i class="fas fa-play"></i>`;
  div.addEventListener('click', () => { handleSongClick(song.file, div); });
  songListContainer.appendChild(div);
});

function handleSongClick(file, element) {
    const icon = element.querySelector('i');
    if (currentSrc === file) {
        if (isPlaying) {
            audio.pause(); isPlaying = false;
            element.classList.remove('playing'); icon.classList.replace('fa-pause', 'fa-play');
            updateMainIcon(false);
        } else {
            audio.play(); isPlaying = true;
            element.classList.add('playing'); icon.classList.replace('fa-play', 'fa-pause');
            updateMainIcon(true);
        }
        return;
    }
    currentSrc = file; audio.src = file;
    audio.play().then(() => {
        isPlaying = true; updateUIForNewSong(element); updateMainIcon(true);
    }).catch(e => console.log("Audio play error:", e));
}

function updateUIForNewSong(activeElement) {
    document.querySelectorAll('.song-item').forEach(el => {
        el.classList.remove('playing'); el.querySelector('i').className = 'fas fa-play';
    });
    activeElement.classList.add('playing'); activeElement.querySelector('i').className = 'fas fa-pause';
    stopMusicBtn.style.display = 'inline-block';
}

function updateMainIcon(playing) {
    if (playing) {
        musicBtn.innerHTML = '<i class="fas fa-compact-disc fa-spin"></i>';
        gsap.to(musicBtn, { rotation: 360, repeat: -1, duration: 3, ease: "linear" });
    } else {
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        gsap.killTweensOf(musicBtn); gsap.set(musicBtn, { rotation: 0 });
    }
}

stopMusicBtn.addEventListener('click', () => {
    audio.pause(); audio.currentTime = 0; isPlaying = false; currentSrc = '';
    document.querySelectorAll('.song-item').forEach(el => { el.classList.remove('playing'); el.querySelector('i').className = 'fas fa-play'; });
    updateMainIcon(false); stopMusicBtn.style.display = 'none';
});

musicBtn.addEventListener('click', (e) => { e.stopPropagation(); playlistModal.classList.toggle('active'); });
closePlaylistBtn.addEventListener('click', () => { playlistModal.classList.remove('active'); });
document.addEventListener('click', (e) => {
    if (!playlistModal.contains(e.target) && !musicBtn.contains(e.target)) { playlistModal.classList.remove('active'); }
});

// --- LOGICA GRATTA E VINCI AVANZATA (PERSISTENTE E MOBILE) ---
const canvas = document.getElementById('js-scratch-canvas');
const container = document.getElementById('js-scratch-container');

if (canvas && container) {
  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  
  // Funzione per disegnare la copertura (se non c'è salvataggio)
  const drawCover = () => {
    ctx.fillStyle = "#C0C0C0"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Testo
    ctx.fillStyle = "#555";
    ctx.font = "bold 20px Nunito";
    ctx.textAlign = "center";
    ctx.fillText("✨ Gratta qui ✨", canvas.width/2, canvas.height/2);
  };

  // Funzione per impostare le dimensioni corrette (High DPI)
  const setSize = () => {
    // Recupera la grandezza visuale
    const rect = container.getBoundingClientRect();
    // Recupera il pixel ratio (1 per schermi normali, 2/3 per Retina)
    const dpr = window.devicePixelRatio || 1;

    // Imposta dimensioni fisiche del canvas (moltiplicate per dpr)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scala il contesto così usiamo coordinate logiche
    ctx.scale(dpr, dpr);
    
    // Importante: lo stile CSS deve rimanere alle dimensioni logiche
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // CONTROLLO MEMORIA: C'è qualcosa di salvato?
    const savedState = localStorage.getItem('scratchCardState');
    if (savedState) {
        // Se c'è, carichiamo l'immagine salvata
        const img = new Image();
        img.onload = () => {
             // Dobbiamo disegnare l'immagine salvata adattandola
             // Reset della trasformazione per disegnare l'immagine grezza
             ctx.setTransform(1, 0, 0, 1, 0, 0);
             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
             // Ripristina scale per futuri disegni (opzionale se non disegni più)
             ctx.scale(dpr, dpr); 
        };
        img.src = savedState;
    } else {
        // Altrimenti disegna il grigio
        drawCover();
    }
  };
  
  // Inizializza
  setSize();
  // Se si ridimensiona la finestra, ricarichiamo (resetta un po' la vista ma è necessario)
  // Per semplicità, su mobile l'orientamento cambia raramente mentre gratti.

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    // Gestione Touch o Mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDraw = (e) => { isDrawing = true; draw(e); };
  
  const endDraw = () => { 
      isDrawing = false;
      // SALVATAGGIO STATO: Quando alzi il dito, salviamo il canvas
      saveState(); 
  };
  
  const saveState = () => {
      // Salva l'intero canvas come stringa Base64
      const dataURL = canvas.toDataURL();
      localStorage.setItem('scratchCardState', dataURL);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    // Previene lo scroll della pagina su mobile mentre si tocca il canvas
    if(e.cancelable) e.preventDefault(); 
    
    const pos = getPos(e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    // Dimensione pennello
    ctx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
    ctx.fill();
  };

  // Event Listeners
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw); // Se esci col mouse, salva
  
  // Touch Events (Passive false è importante per preventDefault)
  canvas.addEventListener('touchstart', startDraw, {passive: false});
  canvas.addEventListener('touchmove', draw, {passive: false});
  canvas.addEventListener('touchend', endDraw);
}

// --- IL GRAN FINALE ---
const msgContainer = document.getElementById('final-message-container');
const msgText = document.getElementById('giuggiolina-text');
const surpriseBtn = document.getElementById('surprise-btn');

const confettiCanvas = document.createElement('canvas');
confettiCanvas.style.position = 'fixed'; confettiCanvas.style.top = '0'; confettiCanvas.style.left = '0';
confettiCanvas.style.width = '100%'; confettiCanvas.style.height = '100%'; 
confettiCanvas.style.pointerEvents = 'none'; confettiCanvas.style.zIndex = '2001';
document.body.appendChild(confettiCanvas);

const myConfetti = confetti.create(confettiCanvas, { resize: true, useWorker: true });

surpriseBtn.addEventListener('click', () => {
  const duration = 3000; const end = Date.now() + duration;
  (function frame() {
    myConfetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#800020', '#B2EBF2', '#ffffff'] });
    myConfetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#800020', '#B2EBF2', '#ffffff'] });
    if (Date.now() < end) requestAnimationFrame(frame);
  }());
  gsap.to(msgContainer, { autoAlpha: 1, duration: 0.8 });
  gsap.fromTo(msgText, { scale: 0.5 }, { scale: 1, duration: 1.5, ease: "elastic.out(1, 0.4)" });
});

msgContainer.addEventListener('click', () => {
  gsap.to(msgContainer, { autoAlpha: 0, duration: 0.5, onComplete: () => gsap.set(msgText, { scale: 0.5 }) });
  myConfetti.reset();
});