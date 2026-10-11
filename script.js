// State & Configurations
const state = {
  girlName: "My Love",
  boyName: "Saurabh",
  quote: "Haath thaam kar chalna chahta hoon umr bhar, kya tum mera humsafar banogi?",
  startDate: "2025-01-01",
  currentReasonIndex: 0,
  musicPlaying: false,
  heartbeatInterval: null,
  bpm: 72,
  noClickCount: 0
};

// Playful phrases for the runaway 'No' button
const playfulNoPhrases = [
  "No 😜",
  "Are you sure? 🥺",
  "Ek baar aur socho! 😉",
  "Naa nahi bol sakti! ❤️",
  "Pakka? Dil se pucho! 🙈",
  "Mujhe pata hai you love me! 🥰",
  "Try karke dekh lo! 🏃‍♂️",
  "Bas ek chance aur soch lo! 🌹",
  "Aise mat karo jaan! 🥺"
];

// Load saved customizations from localStorage
function loadCustomSettings() {
  const savedGirl = localStorage.getItem("love_girl_name");
  const savedBoy = localStorage.getItem("love_boy_name");
  const savedQuote = localStorage.getItem("love_quote");
  const savedDate = localStorage.getItem("love_start_date");

  if (savedGirl) state.girlName = savedGirl;
  if (savedBoy) state.boyName = savedBoy;
  if (savedQuote) state.quote = savedQuote;
  if (savedDate) state.startDate = savedDate;

  // Load saved polaroid photos
  for (let i = 1; i <= 3; i++) {
    const savedPhoto = localStorage.getItem(`polaroid_photo_${i}`);
    if (savedPhoto) {
      const img = document.getElementById(`polaroid-img-${i}`);
      if (img) img.src = savedPhoto;
    }
  }

  updateDOMWithNames();
}

function formatName(str) {
  if (!str) return "";
  return str.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

function updateDOMWithNames() {
  const formattedGirl = formatName(state.girlName);
  const formattedBoy = formatName(state.boyName);

  document.querySelectorAll(".girl-name-display").forEach(el => {
    el.textContent = formattedGirl;
  });

  const certGirl = document.getElementById("cert-girl-name");
  if (certGirl) certGirl.textContent = formattedGirl;

  const certBoy = document.getElementById("cert-boy-name");
  if (certBoy) certBoy.textContent = formattedBoy;

  const propQuote = document.querySelector(".proposal-quote");
  if (propQuote) propQuote.innerHTML = `"${state.quote.replace(/\n/g, "<br>")}"`;

  // Update input fields in modal
  const inputGirl = document.getElementById("input-girl-name");
  const inputBoy = document.getElementById("input-boy-name");
  const inputQuote = document.getElementById("input-custom-quote");
  const inputDate = document.getElementById("input-start-date");
  if (inputGirl) inputGirl.value = state.girlName;
  if (inputBoy) inputBoy.value = state.boyName;
  if (inputQuote) inputQuote.value = state.quote;
  if (inputDate) inputDate.value = state.startDate;

  // Set today's date formatted nicely on the certificate
  const certDate = document.getElementById("cert-date-display");
  if (certDate) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    certDate.textContent = `Signed with eternal love on ${today.toLocaleDateString('en-US', options)}`;
  }

  updateLoveTimer();
}

// Romantic Background Music Synthesizer (Web Audio API)
let audioCtx = null;
let musicInterval = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Gentle romantic piano arpeggio notes (Frequencies in Hz)
const romanticChords = [
  // C major 7th / Am9 gentle progression
  [261.63, 329.63, 392.00, 493.88],
  [220.00, 261.63, 329.63, 440.00],
  [174.61, 220.00, 261.63, 349.23],
  [196.00, 246.94, 293.66, 392.00]
];

function playRomanticNote(freq, startTime, duration = 1.6) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

function startMelodyLoop() {
  initAudio();
  state.musicPlaying = true;
  document.getElementById("music-icon").textContent = "💖";
  document.getElementById("music-text").textContent = "Pause Melody";

  let chordIndex = 0;
  let noteIndex = 0;

  function scheduleNextNote() {
    if (!state.musicPlaying || !audioCtx) return;
    const now = audioCtx.currentTime;
    const currentChord = romanticChords[chordIndex];
    const freq = currentChord[noteIndex];

    playRomanticNote(freq, now, 1.4);

    noteIndex++;
    if (noteIndex >= currentChord.length) {
      noteIndex = 0;
      chordIndex = (chordIndex + 1) % romanticChords.length;
    }

    musicInterval = setTimeout(scheduleNextNote, 420);
  }

  scheduleNextNote();
}

function stopMelodyLoop() {
  state.musicPlaying = false;
  if (musicInterval) clearTimeout(musicInterval);
  document.getElementById("music-icon").textContent = "🎵";
  document.getElementById("music-text").textContent = "Play Melody";
}

function toggleMelody() {
  if (state.musicPlaying) {
    stopMelodyLoop();
  } else {
    startMelodyLoop();
  }
}

// Sound effects: Heartbeat pulse & chime
function playPulseSound() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const now = audioCtx.currentTime;

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(95, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.2);
}

function playCelebrationFanfare() {
  initAudio();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];

  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const time = now + idx * 0.14;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.12, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 1.3);
  });
}

// Background Floating Hearts & Petals Canvas
const bgCanvas = document.getElementById("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");
let particles = [];
let stars = [];

function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const count = Math.floor(window.innerWidth / 12);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.005
    });
  }
}

class Particle {
  constructor(x, y, isTrail = false) {
    this.x = x !== undefined ? x : Math.random() * bgCanvas.width;
    this.y = y !== undefined ? y : bgCanvas.height + Math.random() * 50;
    this.size = Math.random() * 14 + 10;
    this.speedY = isTrail ? -(Math.random() * 1.5 + 0.5) : -(Math.random() * 1.2 + 0.4);
    this.speedX = (Math.random() - 0.5) * 1.2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.03;
    this.opacity = isTrail ? 0.9 : Math.random() * 0.5 + 0.3;
    this.fade = isTrail ? 0.015 : 0;
    this.type = Math.random() > 0.4 ? 'heart' : 'petal';
    this.color = Math.random() > 0.5 ? '#ff2d55' : '#ff758c';
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.4;
    this.rotation += this.rotationSpeed;
    if (this.fade > 0) {
      this.opacity -= this.fade;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;

    if (this.type === 'heart') {
      const s = this.size / 20;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 20 * s);
      ctx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
      ctx.fill();
    } else {
      // Rose Petal
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.4, this.size * 0.8, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.restore();
  }
}

function handleParticles() {
  if (particles.length < 35 && Math.random() < 0.3) {
    particles.push(new Particle());
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw(bgCtx);

    if (p.y < -50 || p.opacity <= 0) {
      particles.splice(i, 1);
    }
  }
}

function animateBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

  // Draw twinkling stars
  stars.forEach(s => {
    s.alpha += Math.sin(Date.now() * s.speed) * 0.01;
    bgCtx.beginPath();
    bgCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(0.9, s.alpha))})`;
    bgCtx.fill();
  });

  handleParticles();
  requestAnimationFrame(animateBackground);
}

// Interactive cursor / touch sparkler trail
window.addEventListener("pointermove", (e) => {
  if (Math.random() < 0.4) {
    particles.push(new Particle(e.clientX, e.clientY, true));
  }
});

// Fireworks & Confetti Canvas Engine
const fwCanvas = document.getElementById("fireworks-canvas");
const fwCtx = fwCanvas.getContext("2d");
let confettiList = [];

class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 3;
    this.gravity = 0.15;
    this.friction = 0.98;
    this.size = Math.random() * 9 + 5;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 12;
    this.colors = ['#ff2d55', '#fcd34d', '#38bdf8', '#4ade80', '#c084fc', '#ffffff'];
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.alpha = 1;
    this.decay = Math.random() * 0.01 + 0.008;
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.7);
    ctx.restore();
  }
}

let isConfettiAnimating = false;

function triggerConfettiBurst(originX, originY) {
  const count = 90;
  for (let i = 0; i < count; i++) {
    confettiList.push(new ConfettiParticle(originX, originY));
  }
  if (!isConfettiAnimating) {
    isConfettiAnimating = true;
    requestAnimationFrame(animateConfetti);
  }
}

function animateConfetti() {
  fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);

  for (let i = confettiList.length - 1; i >= 0; i--) {
    const c = confettiList[i];
    c.update();
    c.draw(fwCtx);
    if (c.alpha <= 0) {
      confettiList.splice(i, 1);
    }
  }

  if (confettiList.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    isConfettiAnimating = false;
  }
}

// Step Transitions
function showStep(stepId) {
  document.querySelectorAll(".step").forEach(step => {
    step.classList.remove("active");
  });
  const target = document.getElementById(stepId);
  if (target) {
    target.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Envelope Interaction
function setupEnvelope() {
  const seal = document.getElementById("seal-trigger");
  const envelope = document.getElementById("envelope-element");

  seal.addEventListener("click", () => {
    envelope.classList.add("open");
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);
    if (!state.musicPlaying) {
      startMelodyLoop();
    }
    setTimeout(() => {
      showStep("step-story");
    }, 1100);
  });
}

// Reasons Carousel
function setupCarousel() {
  const cards = document.querySelectorAll(".reason-card");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prev-reason");
  const nextBtn = document.getElementById("next-reason");

  function goToIndex(idx) {
    state.currentReasonIndex = (idx + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === state.currentReasonIndex);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === state.currentReasonIndex);
    });
  }

  prevBtn.addEventListener("click", () => goToIndex(state.currentReasonIndex - 1));
  nextBtn.addEventListener("click", () => goToIndex(state.currentReasonIndex + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => goToIndex(i)));

  document.getElementById("proceed-to-proposal").addEventListener("click", () => {
    showStep("step-proposal");
  });
}

// Heartbeat Sensor Simulation
function setupHeartbeat() {
  const trigger = document.getElementById("heartbeat-trigger");
  const bpmDisplay = document.getElementById("bpm-display");

  function startAcceleratedHeartbeat() {
    trigger.classList.add("accelerated");
    if (navigator.vibrate) navigator.vibrate(50);
    playPulseSound();

    let currentBPM = 72;
    state.heartbeatInterval = setInterval(() => {
      if (currentBPM < 145) {
        currentBPM += 4;
        bpmDisplay.textContent = `${currentBPM} BPM`;
        playPulseSound();
        if (navigator.vibrate) navigator.vibrate(30);
      }
    }, 120);
  }

  function stopAcceleratedHeartbeat() {
    trigger.classList.remove("accelerated");
    clearInterval(state.heartbeatInterval);
    bpmDisplay.textContent = "72 BPM";
  }

  trigger.addEventListener("mousedown", startAcceleratedHeartbeat);
  trigger.addEventListener("mouseup", stopAcceleratedHeartbeat);
  trigger.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startAcceleratedHeartbeat();
  });
  trigger.addEventListener("touchend", stopAcceleratedHeartbeat);
}

// Proposal Ring Box & Runaway "NO" Button
function setupProposalActions() {
  const ringBox = document.getElementById("ring-box");
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");

  ringBox.addEventListener("click", () => {
    ringBox.classList.toggle("open");
    const rect = ringBox.getBoundingClientRect();
    triggerConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    requestAnimationFrame(animateConfetti);
  });

  // Playful Runaway "NO" Button Logic
  function moveNoButton() {
    state.noClickCount++;
    const phrase = playfulNoPhrases[state.noClickCount % playfulNoPhrases.length];
    noBtn.querySelector(".btn-text").textContent = phrase;

    // Calculate safe boundaries inside viewport or container
    const card = document.querySelector(".proposal-card");
    const cardRect = card.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const maxDeltaX = Math.min(130, cardRect.width / 2 - btnRect.width / 2);
    const maxDeltaY = 90;

    const randomX = (Math.random() - 0.5) * 2 * maxDeltaX;
    const randomY = (Math.random() - 0.5) * 2 * maxDeltaY;

    noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.95)`;

    // Make YES button grow slightly larger & more tempting!
    const yesScale = 1 + Math.min(state.noClickCount * 0.08, 0.4);
    yesBtn.style.transform = `scale(${yesScale})`;
  }

  // Escape on hover or touch
  noBtn.addEventListener("mouseenter", moveNoButton);
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButton();
  });
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    moveNoButton();
  });

  // YES Button Click -> GRAND CELEBRATION!
  let isCelebrating = false;
  yesBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isCelebrating) return;
    isCelebrating = true;

    playCelebrationFanfare();

    // Multiple confetti bursts
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * (window.innerHeight * 0.6);
        triggerConfettiBurst(x, y);
        requestAnimationFrame(animateConfetti);
      }, i * 350);
    }

    setTimeout(() => {
      showStep("step-celebration");
      isCelebrating = false;
    }, 700);
  });
}

// Celebration Actions
function setupCelebration() {
  const replayBtn = document.getElementById("replay-btn");
  const downloadCertBtn = document.getElementById("download-cert-btn");

  replayBtn.addEventListener("click", () => {
    document.getElementById("envelope-element").classList.remove("open");
    document.getElementById("ring-box").classList.remove("open");
    document.getElementById("no-btn").style.transform = "none";
    document.getElementById("yes-btn").style.transform = "none";
    state.noClickCount = 0;
    document.querySelector("#no-btn .btn-text").textContent = "No 😜";
    showStep("step-envelope");
  });

  downloadCertBtn.addEventListener("click", () => {
    window.print();
  });
}

// Live Love Stopwatch Timer
let loveTimerInterval = null;

function updateLoveTimer() {
  const daysEl = document.getElementById("days-count");
  const hoursEl = document.getElementById("hours-count");
  const minsEl = document.getElementById("mins-count");
  const secsEl = document.getElementById("secs-count");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const start = new Date(state.startDate).getTime();
  const now = new Date().getTime();
  const diff = Math.max(0, now - start);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  daysEl.textContent = days;
  hoursEl.textContent = String(hours).padStart(2, '0');
  minsEl.textContent = String(mins).padStart(2, '0');
  secsEl.textContent = String(secs).padStart(2, '0');
}

function setupLoveTimer() {
  updateLoveTimer();
  if (loveTimerInterval) clearInterval(loveTimerInterval);
  loveTimerInterval = setInterval(updateLoveTimer, 1000);
}

// Memory Polaroid Photo Uploads
function setupPolaroids() {
  for (let i = 1; i <= 3; i++) {
    const fileInput = document.getElementById(`upload-photo-${i}`);
    const imgEl = document.getElementById(`polaroid-img-${i}`);
    if (fileInput && imgEl) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            imgEl.src = event.target.result;
            try {
              localStorage.setItem(`polaroid_photo_${i}`, event.target.result);
            } catch (err) {
              console.warn("Could not save photo to localStorage (quota)");
            }
            triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.4);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }
}

// "Open When..." Little Love Letters
function setupOpenWhenLetters() {
  const envelopes = document.querySelectorAll(".mini-envelope");
  const revealBox = document.getElementById("letter-reveal-box");
  const closeBtn = document.getElementById("close-letter-btn");
  const titleEl = document.getElementById("letter-reveal-title");
  const bodyEl = document.getElementById("letter-reveal-body");

  const letterMessages = {
    miss: {
      title: "When You Miss Me 🧸❤️",
      text: () => `Meri pyaari ${formatName(state.girlName)}, jab bhi meri yaad sataye, bas ek gehri saans lena aur aankhein band karna... mai hamesha tumhare dil ki dhadkan me bas-ta hoon. Kabhi bhi akela mat samajhna, ek call door hoon mai tumse!`
    },
    low: {
      title: "When You Feel Low 🌧️🌹",
      text: () => `Meri jaan, chahe duniya kitni bhi mushkil kyu na lage, yaad rakhna tum mere liye sabse anmol ho. Tumhari muskaan meri taaqat hai. Sab theek ho jaayega, ${formatName(state.boyName)} hamesha tumhara haath thaame khada hai!`
    },
    sleep: {
      title: "When You Can't Fall Asleep 🌙✨",
      text: () => `Apna sar takiye par rakho aur hamare saare pyaare moments ko yaad karo. Chand aur sitaare bhi tumhari khoobsurati ke aage feeke hain. Sukoon se so jao meri angel, sapno me aakar gale lagaunga.`
    }
  };

  envelopes.forEach(env => {
    env.addEventListener("click", () => {
      const type = env.getAttribute("data-letter");
      const msg = letterMessages[type];
      if (msg) {
        titleEl.textContent = msg.title;
        bodyEl.textContent = msg.text();
        revealBox.classList.add("active");
        revealBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        playPulseSound();
        triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.5);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      revealBox.classList.remove("active");
    });
  }
}

// "Love Jar" Compliment Dispenser
function setupLoveJar() {
  const jarTrigger = document.getElementById("love-jar-trigger");
  const jarDisplay = document.getElementById("jar-note-display");
  const noteText = document.getElementById("jar-note-text");

  const sweetReasons = [
    "Tum meri subah ki pehli soch aur raat ka aakhri khwaab ho. ❤️",
    "Jab tum hasti ho na, lagta hai jaise duniya ki saari khushiyan mil gayi hon. ✨",
    "Tum sirf meri pasand nahi, meri aadat aur meri ibadat ho. 🌹",
    "Tumhare haath me apna haath dekhna meri zindagi ka sabse khoobsurat ehsaas hai. 💍",
    "Mujhe poori duniya nahi chahiye, bas tumhara saath chahiye umr bhar. 💫",
    "Tum meri zindagi ki wo dua ho jo rab ne qubool kar li hai. 🤲",
    "Tumhare bina har khushi aadhi aur har lamha adhoora lagta hai. 💖",
    "Tumhari choti choti baaton me bhi jo pyaar hai, wo anmol hai. 🥰",
    "Mai har din yahi dua karta hoon ki tumhari pyaari muskaan kabhi kam na ho. 🌟",
    "Mera har rasta aur har safar tum par aakar hi theharta hai. 🧭",
    "Tumhari aankhon me mujhe apna poora aane waala kal dikhta hai. 🔮",
    "Tumhare saath 5 minute baat karne se bhi mera poora din ban jaata hai. ⏳"
  ];

  let currentJarIndex = 0;

  if (jarTrigger && jarDisplay && noteText) {
    jarTrigger.addEventListener("click", () => {
      const phrase = sweetReasons[currentJarIndex % sweetReasons.length];
      currentJarIndex++;
      noteText.textContent = phrase;
      jarDisplay.classList.add("active");

      const rect = jarTrigger.getBoundingClientRect();
      triggerConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      playPulseSound();
    });
  }
}

// Customization Drawer Modal
function setupCustomModal() {
  const modal = document.getElementById("custom-modal");
  const openBtn = document.getElementById("customize-btn");
  const closeBtn = document.getElementById("close-modal");
  const saveBtn = document.getElementById("save-custom-btn");

  openBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  saveBtn.addEventListener("click", () => {
    const girl = document.getElementById("input-girl-name").value.trim();
    const boy = document.getElementById("input-boy-name").value.trim();
    const quote = document.getElementById("input-custom-quote").value.trim();
    const date = document.getElementById("input-start-date").value;

    if (girl) state.girlName = girl;
    if (boy) state.boyName = boy;
    if (quote) state.quote = quote;
    if (date) state.startDate = date;

    localStorage.setItem("love_girl_name", state.girlName);
    localStorage.setItem("love_boy_name", state.boyName);
    localStorage.setItem("love_quote", state.quote);
    localStorage.setItem("love_start_date", state.startDate);

    updateDOMWithNames();
    modal.classList.remove("active");
  });
}

// Music Button
function setupMusicToggle() {
  document.getElementById("music-btn").addEventListener("click", toggleMelody);
}

// Initialization on DOM Load
window.addEventListener("DOMContentLoaded", () => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  loadCustomSettings();
  setupEnvelope();
  setupCarousel();
  setupLoveTimer();
  setupPolaroids();
  setupOpenWhenLetters();
  setupLoveJar();
  setupHeartbeat();
  setupProposalActions();
  setupCelebration();
  setupCustomModal();
  setupMusicToggle();

  animateBackground();
});
