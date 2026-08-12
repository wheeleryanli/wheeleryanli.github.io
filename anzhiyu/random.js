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
  var ATRI_BANNER = "/img/atri-in-sunlit-seaside-study.webp";
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
(function applyYanliBranding(){
  if (window.__yanliBrandingInstalled) return;
  window.__yanliBrandingInstalled = true;

  var attributeNames = ["title", "alt", "aria-label", "content", "value"];
  var skipTextTags = { SCRIPT: true, STYLE: true, NOSCRIPT: true, TEXTAREA: true, INPUT: true };
  var scheduled = false;

  function replaceBrandText(value) {
    if (!value || typeof value !== "string") return value;
    return value
      .replace(/Theme-AnZhiYu/g, "言里主页")
      .replace(/John Doe/g, "言里")
      .replace(/Hexo/g, "言里")
      .replace(/\$ hexo/g, "$ 言里");
  }

  function replaceTextNodes(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        var parent = node.parentElement;
        if (!parent || skipTextTags[parent.tagName]) return NodeFilter.FILTER_REJECT;
        return /Hexo|John Doe|Theme-AnZhiYu|\$ hexo/.test(node.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    var node;
    while ((node = walker.nextNode())) {
      node.nodeValue = replaceBrandText(node.nodeValue);
    }
  }

  function replaceAttributes(root) {
    if (!root) return;
    var elements = root.querySelectorAll ? root.querySelectorAll("*") : [];
    elements.forEach(function(element) {
      attributeNames.forEach(function(name) {
        if (!element.hasAttribute || !element.hasAttribute(name)) return;
        var current = element.getAttribute(name);
        var next = replaceBrandText(current);
        if (next !== current) element.setAttribute(name, next);
      });
    });
  }

  function updateRuntimeConfig() {
    var nextTitle = replaceBrandText(document.title);
    document.title = nextTitle;

    var titleElement = document.querySelector("title");
    if (titleElement && titleElement.textContent !== nextTitle) {
      titleElement.textContent = replaceBrandText(titleElement.textContent);
      document.title = replaceBrandText(document.title);
    }

    if (window.GLOBAL_CONFIG_SITE) {
      window.GLOBAL_CONFIG_SITE.title = replaceBrandText(window.GLOBAL_CONFIG_SITE.title || "言里");
      window.GLOBAL_CONFIG_SITE.configTitle = replaceBrandText(window.GLOBAL_CONFIG_SITE.configTitle || "言里");
    }

    document.querySelectorAll('meta[name="author"], meta[name="copyright"], meta[property="article:author"], meta[property="og:site_name"], meta[property="og:description"], meta[name="description"]').forEach(function(meta) {
      var current = meta.getAttribute("content") || "";
      var next = replaceBrandText(current);
      if (next !== current) meta.setAttribute("content", next);
    });
  }

  function run(root) {
    var target = root || document.documentElement;
    updateRuntimeConfig();
    replaceTextNodes(target);
    replaceAttributes(document.documentElement);
  }

  function schedule(root) {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function() {
      scheduled = false;
      run(root || document.documentElement);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() { run(document.documentElement); }, { once: true });
  } else {
    run(document.documentElement);
  }

  window.addEventListener("load", function() { run(document.documentElement); }, { once: true });
  document.addEventListener("pjax:complete", function() { run(document.documentElement); });

  var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i += 1) {
      if (mutations[i].type === "characterData" || mutations[i].type === "attributes" || (mutations[i].addedNodes && mutations[i].addedNodes.length)) {
        schedule(document.documentElement);
        return;
      }
    }
  });

  function observeBrandingTargets() {
    if (document.head) observer.observe(document.head, { attributes: true, childList: true, characterData: true, subtree: true });
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.head || document.body) observeBrandingTargets();
  else document.addEventListener("DOMContentLoaded", observeBrandingTargets, { once: true });

  [300, 1000, 2500, 5000, 8000].forEach(function(delay) {
    setTimeout(function() { run(document.documentElement); }, delay);
  });
})();
(function applyOriginArticle(){
  if (window.__originArticleInstalled) return;
  window.__originArticleInstalled = true;

  var ARTICLE_PATH = "/2025/03/27/hello-world/";
  var OLD_TITLE = "Hello World";
  var ARTICLE_TITLE = "这个网站是怎么来的";
  var ARTICLE_DESCRIPTION = "高中毕业后的那个假期，我看到学计算机的朋友搭起了个人博客，于是也萌生了做一个个人主页的想法。它曾经因为维护成本被搁置，又在人工智能出现后被我重新捡起。";
  var ARTICLE_HTML = [
    "<p>高中毕业后的那个假期，我看到一位学计算机的朋友折腾起了个人博客。那时候我对“在互联网上拥有一小块自己的地方”这件事很感兴趣，于是也跟着动了念头。</p>",
    "<p>最开始的做法很朴素：打开 B 站教程，一步一步照着搭环境、改配置、部署页面。那段时间更多是在学习怎么把一个网站跑起来，而不是认真思考它应该承载什么内容。</p>",
    "<p>后来这个站点被搁置了很久。原因也很简单：维护它太耗时耗力。调样式、修资源、处理各种看起来很表面的细节，会不断消耗注意力。我逐渐意识到，自己不想把太多时间花在这种表面工程上，而更想把精力放到对我更有意义的事情里，比如物理学、科研，以及真正能沉淀下来的学习。</p>",
    "<p>再后来，人工智能出现了。它直接改变了我维护这个网站的成本：很多前端上的琐碎工作不再需要从零开始慢慢摸索，我可以把更多判断留给自己，把重复劳动交给模型。也许不久的将来，人类真的会拥有自己的 ATRI。至少现在，我已经可以借助模型把这个小站重新打理起来。</p>",
    "<p>所以这一次重新维护它，一方面是为了让这个个人主页真正开始记录一些东西，另一方面也是想亲自感受模型在前端工作中的能力边界：它能理解多少设计意图，能处理多少细节，又会在哪些地方犯错。</p>",
    "<p>这个网站并不是从零开始写出来的。它脱胎自安知鱼大佬的主题 AnZhiYu：视觉结构、交互和很多基础能力都来自这个优秀的模板。我现在做的事情，更像是在这个基础上把它慢慢改成属于自己的空间。</p>",
    "<p>它的来历大概就是这样：起于一次模仿，搁置于时间和精力的权衡，又因为人工智能带来的新工具而重新开始。</p>"
  ].join("");
  var scheduled = false;

  function normalizePath(value) {
    try {
      return new URL(value, window.location.origin).pathname.replace(/\/index\.html$/, "/");
    } catch (error) {
      return "";
    }
  }

  function isArticlePath(value) {
    return normalizePath(value) === ARTICLE_PATH;
  }

  function isArticlePage() {
    return normalizePath(window.location.href) === ARTICLE_PATH;
  }

  function setText(element, text) {
    if (!element) return;
    if (element.textContent.trim() !== text) element.textContent = text;
  }

  function setAttr(element, name, value) {
    if (!element || !element.setAttribute) return;
    if (element.getAttribute(name) !== value) element.setAttribute(name, value);
  }

  function updateHead() {
    var pageTitle = ARTICLE_TITLE + " | 言里";
    if (isArticlePage() && document.title !== pageTitle) document.title = pageTitle;

    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach(function(meta) {
      var current = meta.getAttribute("content") || "";
      if (isArticlePage() || current === OLD_TITLE || current.indexOf(OLD_TITLE) !== -1) {
        setAttr(meta, "content", isArticlePage() ? pageTitle : current.replace(OLD_TITLE, ARTICLE_TITLE));
      }
    });

    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach(function(meta) {
      var current = meta.getAttribute("content") || "";
      if (isArticlePage() || current.indexOf("Welcome to Hexo") !== -1 || current.indexOf("Quick Start") !== -1) {
        setAttr(meta, "content", ARTICLE_DESCRIPTION);
      }
    });
  }

  function updateArticleLinks(root) {
    var target = root && root.querySelectorAll ? root : document;

    target.querySelectorAll('a[href]').forEach(function(anchor) {
      if (!isArticlePath(anchor.getAttribute("href"))) return;

      setAttr(anchor, "title", ARTICLE_TITLE);
      setAttr(anchor, "aria-label", ARTICLE_TITLE);

      var text = anchor.textContent.trim();
      if (!text || text === OLD_TITLE || text.indexOf(OLD_TITLE) !== -1) {
        setText(anchor, text ? text.replace(OLD_TITLE, ARTICLE_TITLE) : ARTICLE_TITLE);
      }
    });

    target.querySelectorAll('.article-title, .article-sort-item-title, .post-title, #post-info .post-title, #CrawlerTitle').forEach(function(element) {
      var link = element.matches && element.matches('a[href]') ? element : element.querySelector && element.querySelector('a[href]');
      if (link && !isArticlePath(link.getAttribute("href")) && !isArticlePage()) return;
      var text = element.textContent.trim();
      if (text === OLD_TITLE || text.indexOf(OLD_TITLE) !== -1 || (isArticlePage() && element.id !== "site-title")) {
        setText(element, text ? text.replace(OLD_TITLE, ARTICLE_TITLE) : ARTICLE_TITLE);
      }
    });
  }

  function updateArticleCards(root) {
    var target = root && root.querySelectorAll ? root : document;

    target.querySelectorAll('a[href]').forEach(function(anchor) {
      if (!isArticlePath(anchor.getAttribute("href"))) return;

      var card = anchor.closest('.recent-post-item, .article-sort-item, .aside-list-item, .card-widget, .relatedPosts-list, li');
      if (!card) return;

      card.querySelectorAll('.content, .article-content, .recent-post-info > .content, .aside-list .content').forEach(function(content) {
        var current = content.textContent.trim();
        if (!current || current.indexOf("Welcome to") !== -1 || current.indexOf("Quick Start") !== -1 || current.indexOf(OLD_TITLE) !== -1) {
          setText(content, ARTICLE_DESCRIPTION);
        }
      });
    });
  }

  function updateArticlePage() {
    if (!isArticlePage()) return;

    document.querySelectorAll('#post-info .post-title, h1.post-title, .post-title, #CrawlerTitle').forEach(function(element) {
      setText(element, ARTICLE_TITLE);
    });

    var article = document.querySelector('#article-container') || document.querySelector('article.post-content');
    if (article && article.getAttribute("data-origin-article") !== "ready") {
      article.innerHTML = ARTICLE_HTML;
      article.setAttribute("data-origin-article", "ready");
    }

    document.querySelectorAll('#card-toc, .toc-content, .toc').forEach(function(toc) {
      toc.style.display = "none";
    });

    if (window.GLOBAL_CONFIG_SITE) {
      window.GLOBAL_CONFIG_SITE.postTitle = ARTICLE_TITLE;
      window.GLOBAL_CONFIG_SITE.pageFillDescription = ARTICLE_DESCRIPTION;
    }
  }

  function run(root) {
    updateHead();
    updateArticleLinks(root || document);
    updateArticleCards(root || document);
    updateArticlePage();
  }

  function schedule(root) {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function() {
      scheduled = false;
      run(root || document);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() { run(document); }, { once: true });
  } else {
    run(document);
  }

  window.addEventListener("load", function() { run(document); }, { once: true });
  document.addEventListener("pjax:complete", function() { run(document); });

  var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i += 1) {
      if (mutations[i].type === "childList" || mutations[i].type === "characterData" || mutations[i].type === "attributes") {
        schedule(document);
        return;
      }
    }
  });

  function observeArticleTargets() {
    if (document.body) observer.observe(document.body, { attributes: true, childList: true, characterData: true, subtree: true });
    if (document.head) observer.observe(document.head, { attributes: true, childList: true, characterData: true, subtree: true });
  }

  if (document.head || document.body) observeArticleTargets();
  else document.addEventListener("DOMContentLoaded", observeArticleTargets, { once: true });

  [300, 1000, 2500, 5000, 8000].forEach(function(delay) {
    setTimeout(function() { run(document); }, delay);
  });
})();
