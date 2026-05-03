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
(function applyAtriHomepageFixes(){
  var ATRI_AVATAR = "https://images7.alphacoders.com/136/1368598.jpeg";
  var ATRI_BANNER = "https://images4.alphacoders.com/136/1369875.jpeg";
  var OLD_AVATARS = [
    "https://bu.dusays.com/2023/04/27/64496e511b09c.jpg",
    "https://npm.elemecdn.com/anzhiyu-blog-static@1.0.4/img/avatar.jpg"
  ];

  function ensureStyle() {
    if (document.getElementById("atri-homepage-fixes")) return;

    var style = document.createElement("style");
    style.id = "atri-homepage-fixes";
    style.textContent = `
      #random-banner {
        position: relative;
        min-height: 376px;
        overflow: hidden;
        background:
          linear-gradient(90deg, rgba(255,255,255,0.74) 0%, rgba(245,250,255,0.50) 42%, rgba(222,243,255,0.18) 100%),
          url("${ATRI_BANNER}") center 46% / cover no-repeat !important;
      }

      #random-banner::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 18% 18%, rgba(66, 90, 239, 0.12), transparent 30%),
          linear-gradient(135deg, rgba(255,255,255,0.10), rgba(125,210,255,0.10));
      }

      #peoplecanvas {
        display: none !important;
      }

      .avatar-img,
      .loading-img {
        object-fit: cover !important;
        object-position: 36% 42% !important;
        background: #eef7ff !important;
      }

      .author-info-avatar .avatar-img {
        box-shadow: 0 8px 24px rgba(66, 90, 239, 0.18);
      }

      .post_bg,
      .todayCard-cover {
        object-fit: cover !important;
        object-position: 45% 52% !important;
        background: #eef7ff !important;
      }

      #recent-posts .post_cover img.post_bg[src],
      .todayCard-cover[src] {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function setImage(img, url) {
    if (!img) return;
    img.src = url;
    img.setAttribute("data-lazy-src", url);
    img.setAttribute("data-src", url);
    img.removeAttribute("srcset");
  }

  function replaceImages() {
    document.querySelectorAll("img").forEach(function(img) {
      var src = img.getAttribute("src") || "";
      var lazy = img.getAttribute("data-lazy-src") || "";
      var shouldReplaceAvatar = OLD_AVATARS.some(function(oldUrl) {
        return src === oldUrl || lazy === oldUrl;
      });

      if (shouldReplaceAvatar || img.classList.contains("avatar-img") || img.classList.contains("loading-img")) {
        setImage(img, ATRI_AVATAR);
      }
    });

    document.querySelectorAll("img.post_bg, .todayCard-cover").forEach(function(img) {
      setImage(img, ATRI_BANNER);
    });

    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(function(meta) {
      meta.setAttribute("content", ATRI_AVATAR);
    });

    var banner = document.getElementById("random-banner");
    if (banner) {
      banner.style.backgroundImage =
        'linear-gradient(90deg, rgba(255,255,255,0.74) 0%, rgba(245,250,255,0.50) 42%, rgba(222,243,255,0.18) 100%), url("' +
        ATRI_BANNER +
        '")';
    }
  }

  function run() {
    ensureStyle();
    replaceImages();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }

  document.addEventListener("pjax:complete", run);
  window.addEventListener("load", run, { once: true });
})();
