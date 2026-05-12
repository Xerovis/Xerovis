const subtitleNode = document.getElementById("animatedSubtitle");
const subtitles = [
  "Vision Beyond Limits",
  "Machine Perception Redefined",
  "Where Intelligence Learns to See",
  "Engineering Visual Intelligence"
];

let subtitleIndex = 0;
let charIndex = 0;
let deleting = false;

function animateSubtitle() {
  const full = subtitles[subtitleIndex];
  subtitleNode.textContent = deleting
    ? full.slice(0, charIndex--)
    : full.slice(0, charIndex++);

  let delay = deleting ? 35 : 55;

  if (!deleting && charIndex > full.length) {
    deleting = true;
    delay = 1300;
  }

  if (deleting && charIndex < 0) {
    deleting = false;
    subtitleIndex = (subtitleIndex + 1) % subtitles.length;
    delay = 250;
  }

  setTimeout(animateSubtitle, delay);
}

animateSubtitle();

const mouseGlow = document.getElementById("mouseGlow");
window.addEventListener("pointermove", (event) => {
  mouseGlow.style.setProperty("--x", `${event.clientX}px`);
  mouseGlow.style.setProperty("--y", `${event.clientY}px`);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function makeParticles() {
  const count = Math.max(28, Math.floor(window.innerWidth / 45));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.8 + 0.5,
    a: Math.random() * 0.6 + 0.2
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.clientWidth) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.clientHeight) p.vy *= -1;

    ctx.beginPath();
    ctx.fillStyle = `rgba(189, 217, 255, ${p.a})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const d = Math.hypot(dx, dy);
      if (d < 95) {
        ctx.strokeStyle = `rgba(77, 159, 255, ${(95 - d) / 700})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
makeParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  makeParticles();
});
