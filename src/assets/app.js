// Thème, filtrage de l'index, et navigation sans rechargement.
//
// Tout le contenu est dans le HTML : sans JavaScript la page reste complète et
// les liens mènent à des pages statiques autonomes. Le script ne fait
// qu'épargner un rechargement quand il s'exécute.

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  // --- Thème ---------------------------------------------------------------
  // Trois états : clair, sombre, système. Le choix explicite pose data-theme,
  // l'état système le retire et laisse prefers-color-scheme décider.

  var KEY = "theme";

  function store(value) {
    try {
      value ? localStorage.setItem(KEY, value) : localStorage.removeItem(KEY);
    } catch (e) {
      /* navigation privée : le thème ne survivra pas au rechargement */
    }
  }

  function current() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function apply(value) {
    if (value === "system") {
      root.removeAttribute("data-theme");
      store(null);
    } else {
      root.setAttribute("data-theme", value);
      store(value);
    }
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      var dark = current() === "dark";
      toggle.setAttribute("aria-label", dark ? "Passer au thème clair" : "Passer au thème sombre");
      toggle.textContent = dark ? "thème clair" : "thème sombre";
    }
  }

  function initTheme() {
    var toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    apply(root.getAttribute("data-theme") || "system");
    toggle.addEventListener("click", function () {
      apply(current() === "dark" ? "light" : "dark");
    });
  }

  // --- Filtres -------------------------------------------------------------
  // Réinitialisés après chaque navigation, puisque le panneau est remplacé.

  function initFilters(scope) {
    var list = scope.querySelector("#projects");
    var filters = scope.querySelectorAll("[data-filter]");
    if (!list || !filters.length) return;

    var counter = scope.querySelector("#projects-count");
    var empty = scope.querySelector("#projects-empty");
    var items = Array.prototype.slice.call(list.querySelectorAll(".project"));
    var active = "all";

    function estFiltre(valeur) {
      return Array.prototype.some.call(filters, function (b) {
        return b.getAttribute("data-filter") === valeur;
      });
    }

    function matches(item) {
      if (active === "all") return true;
      if (item.getAttribute("data-status") === active) return true;
      return (item.getAttribute("data-stack") || "").split("|").indexOf(active) !== -1;
    }

    function render() {
      var shown = 0;
      items.forEach(function (item) {
        var ok = matches(item);
        item.hidden = !ok;
        if (ok) shown++;
      });

      filters.forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn.getAttribute("data-filter") === active));
      });

      if (counter) {
        counter.textContent =
          shown === items.length ? items.length + " projets" : shown + " sur " + items.length;
      }
      if (empty) empty.hidden = shown !== 0;

      // Le filtre vit dans le fragment, mais il n'est pas seul a y vivre : une
      // ancre de section (#experience) doit survivre au premier rendu.
      var hash = location.hash.replace("#", "");
      if (active !== "all") {
        history.replaceState(history.state, "", location.pathname + "#" + active);
      } else if (estFiltre(hash)) {
        history.replaceState(history.state, "", location.pathname);
      }
    }

    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-filter");
        active = active === value ? "all" : value;
        render();
      });
    });

    var initial = location.hash.replace("#", "");
    if (initial && estFiltre(initial)) active = initial;

    render();
  }

  // --- Navigation sans rechargement ----------------------------------------
  // Chaque page porte le même panneau de profil. On ne remplace donc que le
  // panneau de droite : le profil ne clignote pas et sa position de défilement
  // est conservée d'une fiche à l'autre.

  var main = document.querySelector(".pane-main");
  if (!main || !window.history.pushState || !window.fetch || !window.DOMParser) {
    initTheme();
    if (main) initFilters(main);
    return;
  }

  var cache = Object.create(null);
  var enCours = null;

  // Un simple changement de fragment (#experience, #rust) declenche lui aussi
  // popstate. Le rechercher serait absurde : on ne renavigue que si le chemin
  // a reellement change, sinon le navigateur fait son travail d'ancre et le
  // defilement obtenu n'est pas annule.
  var derniere = location.pathname + location.search;

  function estInterne(a) {
    if (a.target || a.hasAttribute("download")) return false;
    if (a.origin !== location.origin) return false;
    return /\.html$/.test(a.pathname) || a.pathname === "/" || /\/$/.test(a.pathname);
  }

  function activer(doc, url, push) {
    var neuf = doc.querySelector(".pane-main");
    if (!neuf) {
      location.href = url; // structure inattendue : on laisse le navigateur faire
      return;
    }

    // L'URL est changee avant l'insertion : les chemins relatifs du contenu
    // injecte (`../img/...`) se resolvent alors depuis la page d'ou il vient,
    // pas depuis celle qu'on quitte.
    if (push) history.pushState({ url: url }, "", url);

    main.replaceWith(neuf);
    main = neuf;

    var titre = doc.querySelector("title");
    if (titre) document.title = titre.textContent;

    // Le panneau de droite repart en haut ; celui de gauche ne bouge pas,
    // c'est tout l'intérêt.
    main.scrollTop = 0;
    if (getComputedStyle(main).overflowY !== "auto") window.scrollTo(0, 0);

    initFilters(main);
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
  }

  function naviguer(url, push) {
    if (cache[url]) {
      activer(cache[url], url, push);
      return;
    }

    if (enCours) enCours.abort();
    enCours = typeof AbortController === "function" ? new AbortController() : null;
    main.setAttribute("aria-busy", "true");

    fetch(url, enCours ? { signal: enCours.signal } : undefined)
      .then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        cache[url] = doc;
        activer(doc, url, push);
      })
      .catch(function (err) {
        // Une navigation annulée n'est pas une erreur ; tout le reste retombe
        // sur le comportement natif du navigateur.
        if (err && err.name === "AbortError") return;
        location.href = url;
      })
      .then(function () {
        if (main) main.removeAttribute("aria-busy");
      });
  }

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || !estInterne(a)) return;

    var url = a.pathname + a.search;
    if (url === location.pathname + location.search) return;

    e.preventDefault();
    derniere = url;
    naviguer(url, true);
  });

  window.addEventListener("popstate", function () {
    var url = location.pathname + location.search;
    if (url === derniere) return;
    derniere = url;
    naviguer(url, false);
  });

  history.replaceState({ url: derniere }, "");

  initTheme();
  initFilters(main);
})();
