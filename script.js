const intro = document.getElementById("intro");
const card = document.getElementById("card");

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const songName = document.getElementById("songName");
const songProgress = document.getElementById("songProgress");

let typeText = "Game Developer & 3D Artist | Programmer: Lua, Python, JavaScript, HTML/CSS • Age | 18 • Colombia";
let typeIndex = 0;

let introText = "Click to Continue...";
let introIndex = 0;

const songs = [
  { name: "Shot For Me - Drake", src: "./Shot For Me.mp3" },
  { name: "Marvins Room - Drake", src: "./Marvins Room.mp3" }
];

let songIndex = 1;
let isPlaying = false;

intro.addEventListener("click", () => {
  intro.style.display = "none";
  card.classList.remove("hidden");
  loadSong(songIndex);
  audio.play().then(() => {
    isPlaying = true;
    playBtn.className = "ctrl pause";
  }).catch((error) => {
    console.error('Audio play failed:', error);
  });
  typeWriter();
});

function loadSong(index) {
  audio.src = songs[index].src;
  songName.textContent = songs[index].name;
  songProgress.style.width = "0%";
  audio.load();
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    playBtn.className = "ctrl play";
    isPlaying = false;
  } else {
    audio.play().then(() => {
      playBtn.className = "ctrl pause";
      isPlaying = true;
    }).catch((error) => {
      console.error('Audio play failed:', error);
    });
  }
});

nextBtn.addEventListener("click", () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songIndex);
  audio.play().then(() => {
    playBtn.className = "ctrl pause";
    isPlaying = true;
  }).catch((error) => {
    console.error('Audio play failed:', error);
  });
});

prevBtn.addEventListener("click", () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songIndex);
  audio.play().then(() => {
    playBtn.className = "ctrl pause";
    isPlaying = true;
  }).catch((error) => {
    console.error('Audio play failed:', error);
  });
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    songProgress.style.width = (audio.currentTime / audio.duration) * 100 + "%";
  }
});

audio.addEventListener("ended", () => {
  if (songIndex === 1) {
    nextBtn.click();
  }
});

document.querySelector('.song-progress-bar').addEventListener('click', (e) => {
  if (audio.duration) {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * audio.duration;
    audio.currentTime = seekTime;
  }
});

function typeWriter() {
  if (typeIndex < typeText.length) {
    document.getElementById("typewriter").textContent += typeText.charAt(typeIndex);
    typeIndex++;
    setTimeout(typeWriter, 55);
  }
}

function typeIntro() {
  if (introIndex < introText.length) {
    document.getElementById("introText").textContent += introText.charAt(introIndex);
    introIndex++;
    setTimeout(typeIntro, 100);
  }
}

class StarParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;
    this.opacity = 1;
    this.color = Math.random() > 0.5 ? '#8B008B' : Math.random() > 0.5 ? '#4B0082' : Math.random() > 0.5 ? '#FF1493' : '#FFFFFF';
    this.life = 100;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.02;
    this.life--;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const canvas = document.createElement('canvas');
canvas.id = 'starCanvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '10';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createStars(x, y, count = 3) {
  for (let i = 0; i < count; i++) {
    particles.push(new StarParticle(x, y));
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw(ctx);

    if (particles[i].life <= 0 || particles[i].opacity <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animateParticles);
}

animateParticles();

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (Math.random() > 0.7) {
    createStars(mouseX, mouseY, Math.floor(Math.random() * 3) + 1);
  }

  updateCardRotation(e.clientX, e.clientY);
});

document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  mouseX = touch.clientX;
  mouseY = touch.clientY;

  if (Math.random() > 0.8) {
    createStars(mouseX, mouseY, Math.floor(Math.random() * 2) + 1);
  }

  updateCardRotation(touch.clientX, touch.clientY);
});

function updateCardRotation(mouseX, mouseY) {
  const card = document.getElementById('card');
  if (!card || card.classList.contains('hidden')) return;

  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const deltaX = mouseX - centerX;
  const deltaY = mouseY - centerY;

  const rotateX = Math.max(-12, Math.min(12, (deltaY / window.innerHeight) * 24));
  const rotateY = Math.max(-12, Math.min(12, -(deltaX / window.innerWidth) * 24));

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', (event) => {
    const card = document.getElementById('card');
    if (!card || card.classList.contains('hidden')) return;

    const beta = event.beta;
    const gamma = event.gamma;

    if (beta !== null && gamma !== null) {
      const rotateX = Math.max(-12, Math.min(12, (beta / 180) * 12));
      const rotateY = Math.max(-12, Math.min(12, (gamma / 90) * 12));

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });
}

document.addEventListener('mouseout', (e) => {
  if (e.relatedTarget) return;
  const card = document.getElementById('card');
  if (card) {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }
});

if (typeof audio !== 'undefined') {
  audio.volume = audio.volume || 0.6;
}

typeIntro();


