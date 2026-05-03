var posts=["2025/03/27/hello-world/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };
(function loadPhysicsParticleField(){
  if (window.__physicsParticleAssetsLoaded) return;
  window.__physicsParticleAssetsLoaded = true;

  var cssHref = "/css/physics-particles.css";
  if (!document.querySelector('link[href="' + cssHref + '"]')) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssHref;
    document.head.appendChild(link);
  }

  var scriptSrc = "/js/physics-particles.js";
  if (!document.querySelector('script[src="' + scriptSrc + '"]')) {
    var script = document.createElement("script");
    script.src = scriptSrc;
    script.defer = true;
    document.head.appendChild(script);
  }
})();
