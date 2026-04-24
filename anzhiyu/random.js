var posts=["2025/03/27/hello-world/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };

(function () {
  if (window.__loadPhysicsParticleField) return;
  window.__loadPhysicsParticleField = true;

  function loadPhysicsParticleField() {
    if (!document.querySelector('link[href="/css/physics-particles.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/css/physics-particles.css";
      document.head.appendChild(link);
    }

    if (!document.querySelector('script[src="/js/physics-particles.js"]')) {
      const script = document.createElement("script");
      script.src = "/js/physics-particles.js";
      script.defer = true;
      document.body.appendChild(script);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPhysicsParticleField, { once: true });
  } else {
    loadPhysicsParticleField();
  }
})();
