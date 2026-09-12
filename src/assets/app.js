// Deux fonctions, rien de plus : le thème et le filtrage de l'index.
// Tout le contenu est dans le HTML ; sans JavaScript la page reste complète,
// seuls les contrôles optionnels disparaissent (ils sont masqués par défaut
// en CSS et révélés par la classe `js` posée ci-dessous).

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  // --- Thème ---------------------------------------------------------------
  // Trois états : clair, sombre, système. Le choix explicite pose data-theme,
  // l'état système le retire et laisse prefers-color-scheme décider.

  var KEY = "theme";
  var toggle = document.getElementById("theme-toggle");

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
    if (toggle) {
      var dark = current() === "dark";
      toggle.setAttribute("aria-label", dark ? "Passer au thème clair" : "Passer au thème sombre");
      toggle.textContent = dark ? "thème clair" : "thème sombre";
    }
  }

  if (toggle) {
    apply(root.getAttribute("data-theme") || "system");
    toggle.addEventListener("click", function () {
      apply(current() === "dark" ? "light" : "dark");
    });
  }

  // --- Filtres -------------------------------------------------------------

  var list = document.getElementById("projects");
  var filters = document.querySelectorAll("[data-filter]");
  var counter = document.getElementById("projects-count");
  if (!list || !filters.length) return;

  var items = Array.prototype.slice.call(list.querySelectorAll(".project"));
  var active = "all";

  function matches(item) {
    if (active === "all") return true;
    if (item.getAttribute("data-status") === active) return true;
    var stack = (item.getAttribute("data-stack") || "").split("|");
    return stack.indexOf(active) !== -1;
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
      counter.textContent = shown === items.length
        ? items.length + " projets"
        : shown + " sur " + items.length;
    }

    var empty = document.getElementById("projects-empty");
    if (empty) empty.hidden = shown !== 0;

    // L'URL reflète le filtre : le lien reste partageable et le retour arrière
    // ramène à la vue précédente.
    var url = active === "all" ? location.pathname : location.pathname + "#" + active;
    history.replaceState(null, "", url);
  }

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-filter");
      active = active === value ? "all" : value;
      render();
    });
  });

  var hash = location.hash.replace("#", "");
  if (hash) {
    var known = Array.prototype.some.call(filters, function (b) {
      return b.getAttribute("data-filter") === hash;
    });
    if (known) active = hash;
  }

  render();
})();
