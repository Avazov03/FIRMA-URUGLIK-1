/* Applies UZ (source HTML) / RU / EN before buttons and GSAP read the text. */
(function () {
  var DICT = window.AEG_I18N_DICT || { ru: {}, en: {} };
  var ALIAS = {
    "Bug'doy urug'i": "пшеница wheat",
    "Bug'doy (galla)": "пшеница wheat",
    "Makka urug'i": "кукуруза corn maize",
    "Makka (galla)": "кукуруза corn",
    "Paxta urug'i": "хлопок cotton",
    "Arpa urug'i": "ячмень barley",
    Arpa: "ячмень barley",
    "No'xat urug'i": "нут chickpea",
    "Sabzi urug'i": "морковь carrot",
    "Pomidor urug'i": "томат помидор tomato",
    "Piyoz urug'i": "лук onion",
    "Kartoshka urug'i": "картофель potato",
    "Kivi urug'i": "киви kiwi",
    "Guava urug'i": "гуава guava",
    Sholi: "рис rice",
    Suli: "овёс овес oats",
    Javdar: "рожь rye",
    "Azotli o'g'it": "азот nitrogen",
    "Fosforli o'g'it": "фосфор phosphate",
    "Kompleks o'g'it": "комплексное удобрение npk",
    Gerbitsid: "гербицид herbicide",
    Fungitsid: "фунгицид fungicide",
    Insektitsid: "инсектицид insecticide",
    "Chorva ozuqasi": "корм скот feed",
    "Aralash ozuqa": "комбикорм feed",
    "O'g'itlar": "удобрения fertilizer",
    "Himoya vositalari": "защита растений pesticide",
    "Urug'lik": "семена seeds",
    Galla: "зерно grain",
    Ozuqa: "корм feed",
  };

  function readLang() {
    try {
      var q = new URLSearchParams(window.location.search).get("lang");
      if (q === "ru" || q === "en" || q === "uz") return q;
      var saved = localStorage.getItem("aeg-lang");
      if (saved === "ru" || saved === "en" || saved === "uz") return saved;
    } catch (e) {}
    return "uz";
  }

  function fold(value) {
    return String(value || "")
      .replace(/[\u00a0\u2007\u202f]/g, " ")
      .replace(/[\u2018\u2019\u201b\u02bb\u02bc`\u00b4]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  var lang = readLang();

  function lookup(raw) {
    var key = fold(raw);
    if (!key) return null;
    var table = DICT[lang];
    if (table && Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    return null;
  }

  function t(raw) {
    if (raw == null) return "";
    if (lang === "uz") return String(raw);
    var hit = lookup(raw);
    return hit == null ? String(raw) : hit;
  }

  function variants(raw) {
    var key = fold(raw);
    if (!key) return "";
    return [raw, DICT.ru[key], DICT.en[key], ALIAS[key]].filter(Boolean).join(" ");
  }

  function productCount(n) {
    n = Number(n) || 0;
    if (lang === "ru") {
      var n10 = n % 10;
      var n100 = n % 100;
      var word = "товаров";
      if (n10 === 1 && n100 !== 11) word = "товар";
      else if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) word = "товара";
      return n + " " + word;
    }
    if (lang === "en") return n + (n === 1 ? " product" : " products");
    return n + " ta mahsulot";
  }

  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, CODE: 1, SVG: 1 };
  var ATTRS = ["placeholder", "data-text", "aria-label", "alt", "title", "data-cursor"];

  function translateAttr(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var name = ATTRS[i];
      if (!el.hasAttribute || !el.hasAttribute(name)) continue;
      var value = el.getAttribute(name);
      var next = lookup(value);
      if (next != null && next !== value) el.setAttribute(name, next);
    }
  }

  function translateText(node) {
    var raw = node.nodeValue;
    if (!raw || !fold(raw)) return;
    var next = lookup(raw);
    if (next == null) return;
    var lead = /^\s/.test(raw) ? " " : "";
    var trail = /\s$/.test(raw) ? " " : "";
    node.nodeValue = lead + next + trail;
  }

  function walk(node) {
    if (!node) return;
    if (node.nodeType === 3) {
      translateText(node);
      return;
    }
    if (node.nodeType !== 1) return;
    if (node.tagName === "TEXTAREA") translateAttr(node);
    if (SKIP[node.tagName]) return;
    if (node.classList && node.classList.contains("aeg-lang")) return;
    translateAttr(node);
    var kids = node.childNodes;
    for (var i = 0; i < kids.length; i++) walk(kids[i]);
  }

  if (lang !== "uz") {
    walk(document.body);
    if (document.title) {
      var title = lookup(document.title);
      if (title) document.title = title;
    }
  }

  document.documentElement.setAttribute("lang", lang);
  try {
    localStorage.setItem("aeg-lang", lang);
  } catch (e) {}

  var NAMES = { uz: "Oʻzbekcha", ru: "Русский", en: "English" };
  var GROUP = { uz: "Til", ru: "Язык", en: "Language" };
  var CODES = ["uz", "ru", "en"];

  function makeSwitcher(kind) {
    var wrap = document.createElement("div");
    wrap.className = "aeg-lang aeg-lang--" + kind;
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", GROUP[lang] || GROUP.uz);
    CODES.forEach(function (code) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("data-set-lang", code);
      btn.title = NAMES[code];
      btn.setAttribute("aria-pressed", code === lang ? "true" : "false");
      if (code === lang) btn.className = "is-active";
      btn.textContent = code.toUpperCase();
      wrap.appendChild(btn);
    });
    return wrap;
  }

  var right = document.querySelector(".header .header-right-wrap");
  if (right && !right.querySelector(".aeg-lang")) right.insertBefore(makeSwitcher("bar"), right.firstChild);

  var menuHead = document.querySelector(".mobile-side-menu .side-menu-head");
  if (menuHead && !document.querySelector(".aeg-lang-row")) {
    var row = document.createElement("div");
    row.className = "aeg-lang-row";
    row.appendChild(makeSwitcher("menu"));
    menuHead.insertAdjacentElement("afterend", row);
  }

  if (!right && !document.querySelector(".aeg-lang--float")) {
    document.body.appendChild(makeSwitcher("float"));
  }

  document.addEventListener("click", function (event) {
    var btn = event.target.closest ? event.target.closest("[data-set-lang]") : null;
    if (!btn) return;
    event.preventDefault();
    var next = btn.getAttribute("data-set-lang");
    if (next !== "uz" && next !== "ru" && next !== "en") return;
    if (next === lang) return;
    try {
      localStorage.setItem("aeg-lang", next);
    } catch (e) {}
    var url = new URL(window.location.href);
    if (next === "uz") url.searchParams.delete("lang");
    else url.searchParams.set("lang", next);
    window.location.assign(url.toString());
  });

  document.documentElement.classList.remove("i18n-wait");

  window.AEG_I18N = {
    lang: lang,
    t: t,
    variants: variants,
    productCount: productCount,
  };
})();
