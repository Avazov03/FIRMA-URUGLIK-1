/**
 * Aqlli qidiruv — open.tsul.uz uslubida (live suggestions + synonym/score)
 * Moslashtirilgan: mahsulot, kategoriya, sahifa, maqola
 */
(function () {
  var TYPE_META = {
    product: { label: "Mahsulot", icon: "fa-seedling" },
    category: { label: "Kategoriya", icon: "fa-layer-group" },
    page: { label: "Sahifa", icon: "fa-file-lines" },
    article: { label: "Maqola", icon: "fa-newspaper" },
  };

  var SYNONYMS = {
    urug: ["uruglik", "urug", "seed"],
    uruglik: ["urug", "uruglik", "seed"],
    bugdoy: ["bugdoy", "wheat"],
    makka: ["makka", "corn"],
    paxta: ["paxta", "cotton"],
    arpa: ["arpa", "barley"],
    sholi: ["sholi", "guruch", "rice"],
    ogit: ["ogit", "fertilizer", "mineral", "azot", "fosfor"],
    fertilizer: ["ogit", "azot", "fosfor", "kompleks"],
    himoya: ["himoya", "gerbitsid", "fungitsid", "insektitsid", "pestitsid"],
    gerbitsid: ["gerbitsid", "himoya", "weed"],
    fungitsid: ["fungitsid", "himoya"],
    insektitsid: ["insektitsid", "himoya", "hasharot"],
    ozuqa: ["ozuqa", "yem", "chorva", "feed"],
    yem: ["ozuqa", "yem", "chorva"],
    galla: ["galla", "don", "grain"],
    don: ["galla", "don", "bugdoy", "arpa"],
    kontakt: ["boglanish", "telefon", "manzil", "contact"],
    telefon: ["boglanish", "kontakt", "call"],
    manzil: ["boglanish", "address", "ipak"],
    kompaniya: ["about", "firma", "agro", "export"],
    firma: ["kompaniya", "about", "agro"],
    jurnal: ["magazine", "maqola", "blog"],
    maqola: ["blog", "jurnal", "yangilik"],
    agronomiya: ["ekish", "parvarish", "qollanma"],
    ekish: ["agronomiya", "urug", "parvarish"],
    hamkor: ["partner", "brend", "brand"],
    mahsulot: ["shop", "katalog", "uruglik", "galla"],
  };

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[ʻʼ`´’]/g, "'")
      .replace(/\s+/g, " ");
  }

  function compact(value) {
    return normalize(value).replace(/['\s-]/g, "");
  }

  function tokens(query) {
    var ql = normalize(query);
    if (!ql) return [];
    var parts = ql.split(" ").filter(Boolean);
    var out = {};
    parts.forEach(function (p) {
      out[p] = true;
      out[compact(p)] = true;
      var key = compact(p);
      var syns = SYNONYMS[key];
      if (syns) {
        syns.forEach(function (s) {
          out[normalize(s)] = true;
          out[compact(s)] = true;
        });
      }
    });
    return Object.keys(out).filter(Boolean);
  }

  function scoreItem(item, query) {
    var ql = normalize(query);
    if (!ql || ql.length < 1) return 0;

    var title = normalize(item.title);
    var titleC = compact(item.title);
    var qC = compact(ql);
    var hay = normalize(
      [item.title, item.desc, item.keywords, item.cat].filter(Boolean).join(" ")
    );
    var hayC = compact(hay);

    var score = 0;

    if (title === ql || titleC === qC) score = Math.max(score, 100);
    else if (title.indexOf(ql) === 0 || titleC.indexOf(qC) === 0)
      score = Math.max(score, 92);
    else if (title.indexOf(ql) !== -1 || titleC.indexOf(qC) !== -1)
      score = Math.max(score, 78);

    if (hay.indexOf(ql) !== -1 || hayC.indexOf(qC) !== -1)
      score = Math.max(score, 55);

    var toks = tokens(ql);
    var hit = 0;
    toks.forEach(function (t) {
      if (t.length < 2) return;
      if (hay.indexOf(t) !== -1 || hayC.indexOf(compact(t)) !== -1) hit += 1;
    });
    if (hit) score = Math.max(score, 40 + Math.min(30, hit * 8));

    if (score > 0 && item.type === "product") score += 4;
    if (score > 0 && item.type === "category") score += 2;

    return score;
  }

  function buildSuggestions(query, limit) {
    limit = limit || 8;
    var index = window.AEG_SEARCH_INDEX || [];
    var ql = normalize(query);
    if (!ql || ql.length < 1) return [];

    var scored = [];
    for (var i = 0; i < index.length; i++) {
      var item = index[i];
      var s = scoreItem(item, ql);
      if (s > 0) scored.push({ item: item, score: s });
    }
    scored.sort(function (a, b) {
      return b.score - a.score || a.item.title.localeCompare(b.item.title, "uz");
    });
    return scored.slice(0, limit).map(function (x) {
      return x.item;
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function highlight(text, query) {
    var ql = normalize(query);
    if (!ql) return escapeHtml(text);
    var raw = String(text);
    var lower = normalize(raw);
    var idx = lower.indexOf(ql);
    if (idx === -1) {
      var qC = compact(ql);
      var rawC = compact(raw);
      if (qC && rawC.indexOf(qC) !== -1) return escapeHtml(raw);
      return escapeHtml(raw);
    }
    return (
      escapeHtml(raw.slice(0, idx)) +
      "<mark>" +
      escapeHtml(raw.slice(idx, idx + ql.length)) +
      "</mark>" +
      escapeHtml(raw.slice(idx + ql.length))
    );
  }

  function init() {
    var box = document.getElementById("popup-search-box");
    var input = document.getElementById("popup-search");
    var form = box && box.querySelector("form");
    if (!box || !input || !form) return;

    form.classList.add("aeg-smart-form");
    form.setAttribute("autocomplete", "off");
    form.setAttribute("role", "search");
    form.removeAttribute("action");

    var suggest = document.createElement("div");
    suggest.className = "aeg-smart-suggest";
    suggest.setAttribute("role", "listbox");
    suggest.id = "aeg-smart-suggest";
    form.appendChild(suggest);

    var activeIdx = -1;
    var currentItems = [];
    var navigating = false;

    function closeSuggest() {
      suggest.classList.remove("open");
      suggest.innerHTML = "";
      box.classList.remove("has-suggest");
      activeIdx = -1;
      currentItems = [];
    }

    function go(url) {
      if (!url || navigating) return;
      navigating = true;
      try {
        box.classList.remove("toggled");
      } catch (e) {}
      /* Absolute-safe relative navigation */
      window.location.assign(url);
    }

    function render(items, query) {
      currentItems = items;
      activeIdx = items.length ? 0 : -1;
      if (!normalize(query)) {
        closeSuggest();
        return;
      }
      if (!items.length) {
        suggest.innerHTML =
          '<div class="aeg-suggest-empty">Natija topilmadi. Boshqa kalit so‘z sinab ko‘ring.</div>';
        suggest.classList.add("open");
        box.classList.add("has-suggest");
        return;
      }
      var html = items
        .map(function (it, i) {
          var meta = TYPE_META[it.type] || TYPE_META.page;
          var href = it.url || "#";
          return (
            '<a class="aeg-suggest-row' +
            (i === 0 ? " is-active" : "") +
            '" role="option" href="' +
            escapeHtml(href) +
            '" data-idx="' +
            i +
            '">' +
            '<span class="aeg-suggest-ic"><i class="fa-solid ' +
            meta.icon +
            '" aria-hidden="true"></i></span>' +
            '<span class="aeg-suggest-label">' +
            "<span>" +
            highlight(it.title, query) +
            "</span>" +
            "<small>" +
            escapeHtml(meta.label) +
            (it.desc ? " · " + escapeHtml(it.desc) : "") +
            "</small>" +
            "</span>" +
            '<span class="aeg-suggest-go"><i class="fa-regular fa-arrow-right"></i></span>' +
            "</a>"
          );
        })
        .join("");
      suggest.innerHTML = html;
      suggest.classList.add("open");
      box.classList.add("has-suggest");
    }

    function setActive(idx) {
      var rows = suggest.querySelectorAll(".aeg-suggest-row");
      rows.forEach(function (r) {
        r.classList.remove("is-active");
      });
      if (idx < 0 || idx >= rows.length) {
        activeIdx = -1;
        return;
      }
      activeIdx = idx;
      rows[idx].classList.add("is-active");
      rows[idx].scrollIntoView({ block: "nearest" });
    }

    input.addEventListener("input", function () {
      var q = input.value;
      render(buildSuggestions(q), q);
    });

    input.addEventListener("focus", function () {
      var q = input.value;
      if (normalize(q)) render(buildSuggestions(q), q);
    });

    input.addEventListener("keydown", function (e) {
      if (!suggest.classList.contains("open")) {
        if (e.key === "Enter") {
          e.preventDefault();
          var q0 = input.value.trim();
          var top0 = buildSuggestions(q0, 1)[0];
          go(top0 ? top0.url : q0 ? "shop.html?q=" + encodeURIComponent(q0) : "shop.html");
        }
        return;
      }
      var rows = suggest.querySelectorAll(".aeg-suggest-row");
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(Math.min(rows.length - 1, (activeIdx < 0 ? -1 : activeIdx) + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(Math.max(0, activeIdx - 1));
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeSuggest();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIdx >= 0 && currentItems[activeIdx]) {
          go(currentItems[activeIdx].url);
        } else if (currentItems[0]) {
          go(currentItems[0].url);
        } else {
          var q = input.value.trim();
          go(q ? "shop.html?q=" + encodeURIComponent(q) : "shop.html");
        }
      }
    });

    /* mousedown: popup close handlerdan OLDIN navigatsiya */
    suggest.addEventListener("mousedown", function (e) {
      var row = e.target.closest(".aeg-suggest-row");
      if (!row) return;
      e.preventDefault();
      e.stopPropagation();
      var idx = parseInt(row.getAttribute("data-idx"), 10);
      var url =
        (currentItems[idx] && currentItems[idx].url) || row.getAttribute("href");
      go(url);
    });

    suggest.addEventListener("click", function (e) {
      var row = e.target.closest(".aeg-suggest-row");
      if (!row) return;
      e.preventDefault();
      e.stopPropagation();
      if (navigating) return;
      var idx = parseInt(row.getAttribute("data-idx"), 10);
      var url =
        (currentItems[idx] && currentItems[idx].url) || row.getAttribute("href");
      go(url);
    });

    form.addEventListener("mousedown", function (e) {
      e.stopPropagation();
    });
    form.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var q = input.value.trim();
      if (activeIdx >= 0 && currentItems[activeIdx]) {
        go(currentItems[activeIdx].url);
        return;
      }
      var top = buildSuggestions(q, 1)[0];
      if (top) {
        go(top.url);
        return;
      }
      go(q ? "shop.html?q=" + encodeURIComponent(q) : "shop.html");
    });

    var obs = new MutationObserver(function () {
      if (!box.classList.contains("toggled") && !navigating) closeSuggest();
    });
    obs.observe(box, { attributes: true, attributeFilter: ["class"] });

    window.AEGSmartSearch = {
      normalize: normalize,
      compact: compact,
      buildSuggestions: buildSuggestions,
      scoreItem: scoreItem,
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
