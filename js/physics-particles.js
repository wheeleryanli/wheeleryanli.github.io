(() => {
  if (window.__physicsParticleField) return;
  window.__physicsParticleField = true;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let canvas = document.getElementById("physics-particle-field");

  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "physics-particle-field";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext("2d", { alpha: true });
  const pointer = { x: 0, y: 0, active: false };
  const state = {
    width: 0,
    height: 0,
    particles: [],
    time: 0,
    reduced: prefersReducedMotion.matches,
  };

  const palette = {
    light: {
      grid: "rgba(44, 62, 80, 0.10)",
      wave: "rgba(66, 90, 239, 0.34)",
      link: "66, 90, 239",
      positive: "rgba(66, 90, 239, 0.72)",
      negative: "rgba(245, 108, 108, 0.68)",
      orbit: "rgba(44, 62, 80, 0.14)",
    },
    dark: {
      grid: "rgba(180, 205, 255, 0.10)",
      wave: "rgba(150, 180, 255, 0.36)",
      link: "150, 180, 255",
      positive: "rgba(150, 180, 255, 0.74)",
      negative: "rgba(255, 190, 120, 0.70)",
      orbit: "rgba(220, 232, 255, 0.16)",
    },
  };

  function getColors() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? palette.dark
      : palette.light;
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    canvas.width = Math.floor(state.width * ratio);
    canvas.height = Math.floor(state.height * ratio);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    seedParticles();
  }

  function seedParticles() {
    const base = state.width < 768 ? state.width / 24 : state.width / 16;
    const count = Math.max(36, Math.min(110, Math.floor(base)));

    state.particles = Array.from({ length: count }, (_, index) => {
      const charge = index % 2 === 0 ? 1 : -1;

      return {
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        charge,
        mass: 0.8 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }

  function drawGrid(colors) {
    ctx.save();
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;

    const gap = 96;
    const drift = state.reduced ? 0 : (state.time * 16) % gap;

    for (let x = -gap + drift; x < state.width + gap; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + state.height * 0.16, state.height);
      ctx.stroke();
    }

    for (let y = -gap; y < state.height + gap; y += gap) {
      ctx.beginPath();
      ctx.moveTo(0, y + drift * 0.28);
      ctx.lineTo(state.width, y - state.width * 0.07 + drift * 0.28);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawWave(colors) {
    const midY = state.height * 0.28;

    ctx.save();
    ctx.strokeStyle = colors.wave;
    ctx.lineWidth = 1.4;
    ctx.beginPath();

    for (let x = 0; x <= state.width; x += 10) {
      const y =
        midY +
        Math.sin(x * 0.014 + state.time * 1.5) * 18 +
        Math.sin(x * 0.004 - state.time * 0.7) * 32;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.restore();
  }

  function updateParticles() {
    const centerX = state.width * 0.72;
    const centerY = state.height * 0.36;

    for (const particle of state.particles) {
      const dx = centerX - particle.x;
      const dy = centerY - particle.y;
      const distance = Math.max(120, Math.hypot(dx, dy));
      const force = (particle.charge * 0.014) / particle.mass;

      particle.vx += (dy / distance) * force;
      particle.vy -= (dx / distance) * force;

      if (pointer.active) {
        const px = pointer.x - particle.x;
        const py = pointer.y - particle.y;
        const pd = Math.max(44, Math.hypot(px, py));
        const pull = Math.min(0.024, 2.1 / (pd * pd));

        particle.vx += px * pull;
        particle.vy += py * pull;
      }

      particle.vx *= 0.993;
      particle.vy *= 0.993;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.phase += 0.006 * particle.charge;

      if (particle.x < -30) particle.x = state.width + 30;
      if (particle.x > state.width + 30) particle.x = -30;
      if (particle.y < -30) particle.y = state.height + 30;
      if (particle.y > state.height + 30) particle.y = -30;
    }
  }

  function drawConnections(colors) {
    ctx.save();
    ctx.lineWidth = 1;

    for (let i = 0; i < state.particles.length; i += 1) {
      for (let j = i + 1; j < state.particles.length; j += 1) {
        const a = state.particles[i];
        const b = state.particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);

        if (dist < 128) {
          const alpha = (1 - dist / 128) * 0.22;
          ctx.strokeStyle = `rgba(${colors.link}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.restore();
  }

  function drawParticles(colors) {
    ctx.save();

    for (const particle of state.particles) {
      const radius = 1.2 + particle.mass * 0.72;
      ctx.fillStyle = particle.charge > 0 ? colors.positive : colors.negative;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = colors.orbit;
      ctx.beginPath();
      ctx.ellipse(
        particle.x,
        particle.y,
        radius * 4.8,
        radius * 1.7,
        particle.phase + state.time,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function render() {
    const colors = getColors();

    if (!state.reduced) {
      state.time += 0.016;
      updateParticles();
    }

    ctx.clearRect(0, 0, state.width, state.height);
    drawGrid(colors);
    drawWave(colors);
    drawConnections(colors);
    drawParticles(colors);

    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    },
    { passive: true },
  );
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  prefersReducedMotion.addEventListener("change", (event) => {
    state.reduced = event.matches;
  });

  resize();
  render();
})();
