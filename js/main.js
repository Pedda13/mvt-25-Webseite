\
(() => {
  const root = document.documentElement;

  // --- Theme
  const STORAGE_KEY = "mvt-theme";
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  function applyTheme(t){
    root.setAttribute("data-theme", t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
  }

  const stored = (() => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } })();
  applyTheme(stored || (prefersLight ? "light" : "dark"));

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if(!btn) return;
    const current = root.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  // --- Mobile menu
  const menuBtn = document.querySelector("[data-menu-toggle]");
  const topnav = document.querySelector("[data-topnav]");
  if(menuBtn && topnav){
    menuBtn.addEventListener("click", () => {
      topnav.classList.toggle("is-open");
    });
    document.addEventListener("click", (e) => {
      if(!topnav.classList.contains("is-open")) return;
      if(e.target.closest("[data-topnav]") || e.target.closest("[data-menu-toggle]")) return;
      topnav.classList.remove("is-open");
    });
  }

  // --- Gallery lightbox (dialog)
  const dialog = document.querySelector("[data-lightbox]");
  if(dialog){
    const img = dialog.querySelector("img");
    const cap = dialog.querySelector("[data-lightbox-cap]");
    document.querySelectorAll("[data-thumb]").forEach((t) => {
      t.addEventListener("click", () => {
        const src = t.getAttribute("data-src");
        const title = t.getAttribute("data-title") || "";
        img.src = src;
        img.alt = title;
        cap.textContent = title;
        dialog.showModal();
      });
    });
    dialog.addEventListener("click", (e) => {
      const close = e.target.closest("[data-close]");
      if(close) dialog.close();
      // click outside
      if(e.target === dialog) dialog.close();
    });
    document.addEventListener("keydown", (e) => {
      if(e.key === "Escape" && dialog.open) dialog.close();
    });
  }

  // --- Docs scrollspy
  const sidebar = document.querySelector("[data-sidebar]");
  if(sidebar){
    const links = Array.from(sidebar.querySelectorAll("a[href^='#']"));
    const targets = links
      .map(a => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const obs = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(en => en.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if(!visible) return;
      const id = "#" + visible.target.id;
      links.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === id));
      history.replaceState(null, "", id);
    }, { rootMargin: "-20% 0px -70% 0px", threshold: [0.1, 0.2, 0.4, 0.6] });

    targets.forEach(t => obs.observe(t));
  }
})();
