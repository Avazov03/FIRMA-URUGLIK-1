/* Request cart: wholesale RFQ list stored in localStorage. Needs catalog-data.js and i18n.js. */
(function () {
  var C = window.AEG_CATALOG;
  if (!C) return;

  var KEY = "aeg-cart";
  var LAST = "aeg-cart-last-request";
  var EMAIL = "hello.lawlab@gmail.com";
  var PHONE = "+998921958008";
  var PHONE_LABEL = "+998 92 195 80 08";

  var lang = (window.AEG_I18N && window.AEG_I18N.lang) || "uz";

  var UNITS = {
    kg: { uz: "kg", ru: "кг", en: "kg" },
    t: { uz: "tonna", ru: "т", en: "t" },
    bag: { uz: "qop", ru: "мешок", en: "bag" },
    l: { uz: "litr", ru: "л", en: "L" },
  };
  var CAT_UNITS = {
    uruglik: ["kg", "t", "bag"],
    galla: ["t", "kg", "bag"],
    ogit: ["t", "kg", "bag"],
    himoya: ["l", "kg"],
    ozuqa: ["t", "kg", "bag"],
  };

  function ruPlural(n, one, few, many) {
    var n10 = n % 10;
    var n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return one;
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
    return many;
  }

  var T = {
    uz: {
      cart: "So'rov savati",
      open: "Savatni ochish",
      items: function (n) { return n + " ta mahsulot"; },
      empty: "Savat hozircha bo'sh",
      emptyHint: "Katalogdan kerakli mahsulotlarni tanlang — hammasini bitta so'rov bilan yuborasiz.",
      toCatalog: "Katalogga o'tish",
      checkout: "So'rovni rasmiylashtirish",
      keepBrowsing: "Tanlashni davom ettirish",
      note: "Narx so'rov asosida. Mutaxassis siz bilan bog'lanib, aniq taklif beradi.",
      add: "Savatga qo'shish",
      inCart: "Savatda",
      update: "Savatni yangilash",
      added: function (n) { return n + " savatga qo'shildi"; },
      remove: "O'chirish",
      qty: "Miqdor",
      unit: "O'lchov birligi",
      close: "Yopish",
      clear: "Savatni tozalash",
      formTitle: "Aloqa ma'lumotlari",
      name: "Ism va familiya",
      phone: "Telefon",
      company: "Kompaniya yoki xo'jalik",
      region: "Viloyat / shahar",
      comment: "Izoh: yetkazish muddati, qadoq va h.k.",
      contactBy: "Qanday bog'lanaylik?",
      methods: { call: "Qo'ng'iroq", telegram: "Telegram", email: "Email" },
      optional: "ixtiyoriy",
      submit: "So'rovni yuborish",
      errName: "Ismingizni kiriting",
      errPhone: "Telefon raqamini to'liq kiriting",
      errEmpty: "Savat bo'sh — avval mahsulot tanlang",
      successTitle: "So'rovingiz tayyor",
      successText: "Email ilovangiz ochildi — xatni yuboring. Mutaxassis tez orada siz bilan bog'lanadi.",
      requestNo: "So'rov raqami",
      sendEmail: "Email orqali yuborish",
      copy: "Matnni nusxalash",
      copied: "Nusxalandi",
      call: "Qo'ng'iroq qilish",
      newRequest: "Yangi so'rov",
      summary: "Tanlangan mahsulotlar",
      subject: "Ulgurji so'rov",
      mailIntro: "Assalomu alaykum! Quyidagi mahsulotlar bo'yicha taklif yuboring:",
      contactLabel: "Aloqa",
      decrease: "Kamaytirish",
      increase: "Ko'paytirish",
    },
    ru: {
      cart: "Корзина запроса",
      open: "Открыть корзину",
      items: function (n) { return n + " " + ruPlural(n, "позиция", "позиции", "позиций"); },
      empty: "Корзина пока пуста",
      emptyHint: "Выберите нужные товары в каталоге — отправите всё одним запросом.",
      toCatalog: "Перейти в каталог",
      checkout: "Оформить запрос",
      keepBrowsing: "Продолжить выбор",
      note: "Цена по запросу. Специалист свяжется с вами и подготовит точное предложение.",
      add: "В корзину",
      inCart: "В корзине",
      update: "Обновить корзину",
      added: function (n) { return "Добавлено в корзину: " + n; },
      remove: "Удалить",
      qty: "Количество",
      unit: "Единица",
      close: "Закрыть",
      clear: "Очистить корзину",
      formTitle: "Контактные данные",
      name: "Имя и фамилия",
      phone: "Телефон",
      company: "Компания или хозяйство",
      region: "Область / город",
      comment: "Комментарий: срок поставки, фасовка и т. п.",
      contactBy: "Как с вами связаться?",
      methods: { call: "Звонок", telegram: "Telegram", email: "Email" },
      optional: "необязательно",
      submit: "Отправить запрос",
      errName: "Введите имя",
      errPhone: "Введите номер телефона полностью",
      errEmpty: "Корзина пуста — сначала выберите товары",
      successTitle: "Запрос готов",
      successText: "Открылось ваше почтовое приложение — отправьте письмо. Специалист скоро свяжется с вами.",
      requestNo: "Номер запроса",
      sendEmail: "Отправить по email",
      copy: "Скопировать текст",
      copied: "Скопировано",
      call: "Позвонить",
      newRequest: "Новый запрос",
      summary: "Выбранные товары",
      subject: "Оптовый запрос",
      mailIntro: "Здравствуйте! Пришлите, пожалуйста, предложение по следующим позициям:",
      contactLabel: "Связь",
      decrease: "Уменьшить",
      increase: "Увеличить",
    },
    en: {
      cart: "Request cart",
      open: "Open cart",
      items: function (n) { return n + (n === 1 ? " item" : " items"); },
      empty: "Your cart is empty",
      emptyHint: "Pick the products you need from the catalogue and send them all in one request.",
      toCatalog: "Go to catalogue",
      checkout: "Review request",
      keepBrowsing: "Keep browsing",
      note: "Prices on request. A specialist will contact you with an exact offer.",
      add: "Add to cart",
      inCart: "In cart",
      update: "Update cart",
      added: function (n) { return "Added to cart: " + n; },
      remove: "Remove",
      qty: "Quantity",
      unit: "Unit",
      close: "Close",
      clear: "Clear cart",
      formTitle: "Contact details",
      name: "Full name",
      phone: "Phone",
      company: "Company or farm",
      region: "Region / city",
      comment: "Comment: delivery date, packaging, etc.",
      contactBy: "How should we contact you?",
      methods: { call: "Call", telegram: "Telegram", email: "Email" },
      optional: "optional",
      submit: "Send request",
      errName: "Enter your name",
      errPhone: "Enter a full phone number",
      errEmpty: "The cart is empty — pick products first",
      successTitle: "Your request is ready",
      successText: "Your email app has opened — send the message. A specialist will get back to you shortly.",
      requestNo: "Request number",
      sendEmail: "Send by email",
      copy: "Copy text",
      copied: "Copied",
      call: "Call us",
      newRequest: "New request",
      summary: "Selected products",
      subject: "Wholesale request",
      mailIntro: "Hello! Please send an offer for the following items:",
      contactLabel: "Contact",
      decrease: "Decrease",
      increase: "Increase",
    },
  };
  var t = T[lang] || T.uz;

  /* ---------- helpers ---------- */
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function withLang(url) {
    if (lang === "uz") return url;
    return url + (url.indexOf("?") === -1 ? "?" : "&") + "lang=" + lang;
  }
  function product(id) {
    for (var i = 0; i < C.products.length; i++) if (C.products[i].id === id) return C.products[i];
    return null;
  }
  function pName(p) {
    return p[lang] || p.uz;
  }
  function unitsFor(p) {
    return CAT_UNITS[p.cat] || ["kg", "t"];
  }
  function unitLabel(u) {
    return (UNITS[u] && UNITS[u][lang]) || u;
  }
  function cleanQty(v) {
    var n = parseFloat(String(v).replace(",", "."));
    if (!isFinite(n) || n <= 0) n = 1;
    if (n > 100000) n = 100000;
    return Math.round(n * 100) / 100;
  }
  function fmtQty(n) {
    return String(n).replace(".", lang === "en" ? "." : ",");
  }

  /* ---------- store ---------- */
  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(raw)
        ? raw.filter(function (x) {
            return x && product(x.id);
          })
        : [];
    } catch (e) {
      return [];
    }
  }
  var items = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {}
    renderAll();
  }
  function find(id) {
    for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i];
    return null;
  }
  function addItem(id, qty, unit) {
    var p = product(id);
    if (!p) return;
    var allowed = unitsFor(p);
    if (allowed.indexOf(unit) === -1) unit = allowed[0];
    var cur = find(id);
    if (cur) {
      cur.qty = cleanQty(qty);
      cur.unit = unit;
    } else {
      items.push({ id: id, qty: cleanQty(qty), unit: unit });
    }
    save();
  }
  function setQty(id, qty) {
    var cur = find(id);
    if (!cur) return;
    cur.qty = cleanQty(qty);
    save();
  }
  function setUnit(id, unit) {
    var cur = find(id);
    if (!cur) return;
    cur.unit = unit;
    save();
  }
  function removeItem(id) {
    items = items.filter(function (x) {
      return x.id !== id;
    });
    save();
  }
  function clearCart() {
    items = [];
    save();
  }

  window.addEventListener("storage", function (e) {
    if (e.key === KEY) {
      items = load();
      renderAll();
    }
  });

  /* ---------- shared fragments ---------- */
  function stepper(id, qty, extraClass) {
    return (
      '<div class="aeg-stepper ' + (extraClass || "") + '" data-id="' + esc(id) + '">' +
      '<button type="button" class="aeg-step" data-step="-1" aria-label="' + esc(t.decrease) + '"><i class="fa-regular fa-minus"></i></button>' +
      '<input type="text" inputmode="decimal" class="aeg-qty" value="' + esc(fmtQty(qty)) + '" aria-label="' + esc(t.qty) + '"/>' +
      '<button type="button" class="aeg-step" data-step="1" aria-label="' + esc(t.increase) + '"><i class="fa-regular fa-plus"></i></button>' +
      "</div>"
    );
  }
  function unitChips(p, current, id) {
    return (
      '<div class="aeg-units" role="radiogroup" aria-label="' + esc(t.unit) + '" data-id="' + esc(id || "") + '">' +
      unitsFor(p)
        .map(function (u) {
          var on = u === current;
          return (
            '<button type="button" role="radio" aria-checked="' + on + '" class="aeg-unit' + (on ? " is-active" : "") +
            '" data-unit="' + u + '">' + esc(unitLabel(u)) + "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  /* ---------- header button ---------- */
  var headerBtn = null;
  function mountHeader() {
    var right = document.querySelector(".header .header-right-wrap");
    if (!right || right.querySelector(".aeg-cart-btn")) return;
    headerBtn = document.createElement("button");
    headerBtn.type = "button";
    headerBtn.className = "aeg-cart-btn";
    headerBtn.innerHTML =
      '<i class="fa-regular fa-basket-shopping" aria-hidden="true"></i><span class="aeg-cart-badge" hidden>0</span>';
    var switcher = right.querySelector(".aeg-lang");
    if (switcher && switcher.nextSibling) right.insertBefore(headerBtn, switcher.nextSibling);
    else right.insertBefore(headerBtn, right.firstChild);
    headerBtn.addEventListener("click", openDrawer);
  }
  function renderHeader() {
    if (!headerBtn) return;
    var n = items.length;
    var badge = headerBtn.querySelector(".aeg-cart-badge");
    badge.textContent = n;
    badge.hidden = n === 0;
    headerBtn.setAttribute("aria-label", t.cart + (n ? " — " + t.items(n) : ""));
    headerBtn.title = t.cart;
  }
  function bump() {
    if (!headerBtn) return;
    headerBtn.classList.remove("is-bump");
    void headerBtn.offsetWidth;
    headerBtn.classList.add("is-bump");
  }

  /* ---------- drawer ---------- */
  var drawer, overlay, lastFocus;
  function mountDrawer() {
    overlay = document.createElement("div");
    overlay.className = "aeg-cart-overlay";
    drawer = document.createElement("aside");
    drawer.className = "aeg-cart-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", t.cart);
    drawer.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    overlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) closeDrawer();
    });
    bindListEvents(drawer);
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeDrawer();
    });
  }
  function smoother(paused) {
    try {
      var s = window.ScrollSmoother && window.ScrollSmoother.get();
      if (s) s.paused(paused);
    } catch (e) {}
  }
  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    renderDrawer();
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("aeg-cart-lock");
    smoother(true);
    var close = drawer.querySelector(".aeg-cart-close");
    if (close) close.focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("aeg-cart-lock");
    smoother(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function itemRow(it, compact) {
    var p = product(it.id);
    var href = withLang("shop-details.html?id=" + p.id);
    return (
      '<li class="aeg-line" data-id="' + esc(p.id) + '">' +
      '<a class="aeg-line-img" href="' + href + '"><img src="' + p.img + '" alt=""/></a>' +
      '<div class="aeg-line-body">' +
      '<div class="aeg-line-top">' +
      '<div><span class="aeg-line-cat">' + esc(C.categories[p.cat][lang]) + "</span>" +
      '<a class="aeg-line-name" href="' + href + '">' + esc(pName(p)) + "</a></div>" +
      '<button type="button" class="aeg-line-remove" data-remove="' + esc(p.id) + '" aria-label="' + esc(t.remove + ": " + pName(p)) + '" title="' + esc(t.remove) + '"><i class="fa-regular fa-trash-can"></i></button>' +
      "</div>" +
      '<div class="aeg-line-controls' + (compact ? " is-compact" : "") + '">' +
      stepper(p.id, it.qty) +
      unitChips(p, it.unit, p.id) +
      "</div>" +
      "</div>" +
      "</li>"
    );
  }

  function emptyState() {
    return (
      '<div class="aeg-cart-empty">' +
      '<span class="aeg-cart-empty-ic"><i class="fa-regular fa-basket-shopping"></i></span>' +
      "<h4>" + esc(t.empty) + "</h4>" +
      "<p>" + esc(t.emptyHint) + "</p>" +
      '<a class="aeg-btn" href="' + withLang("shop.html") + '">' + esc(t.toCatalog) + ' <i class="fa-regular fa-arrow-right"></i></a>' +
      "</div>"
    );
  }

  function renderDrawer() {
    if (!drawer) return;
    var n = items.length;
    var head =
      '<div class="aeg-cart-head">' +
      "<div><h3>" + esc(t.cart) + "</h3>" +
      (n ? '<span class="aeg-cart-count">' + esc(t.items(n)) + "</span>" : "") +
      "</div>" +
      '<button type="button" class="aeg-cart-close" data-close aria-label="' + esc(t.close) + '"><i class="fa-regular fa-xmark"></i></button>' +
      "</div>";
    if (!n) {
      drawer.innerHTML = head + '<div class="aeg-cart-body">' + emptyState() + "</div>";
      return;
    }
    drawer.innerHTML =
      head +
      '<div class="aeg-cart-body"><ul class="aeg-lines">' +
      items.map(function (it) { return itemRow(it, true); }).join("") +
      "</ul></div>" +
      '<div class="aeg-cart-foot">' +
      '<p class="aeg-cart-note"><i class="fa-regular fa-circle-info"></i> ' + esc(t.note) + "</p>" +
      '<a class="aeg-btn aeg-btn-block" href="' + withLang("cart.html") + '">' + esc(t.checkout) + ' <i class="fa-regular fa-arrow-right"></i></a>' +
      '<button type="button" class="aeg-btn-link" data-close>' + esc(t.keepBrowsing) + "</button>" +
      "</div>";
  }

  /* list interactions shared by drawer and cart page */
  function bindListEvents(root) {
    root.addEventListener("click", function (e) {
      var rm = e.target.closest("[data-remove]");
      if (rm) {
        removeItem(rm.getAttribute("data-remove"));
        return;
      }
      var step = e.target.closest(".aeg-stepper .aeg-step");
      if (step) {
        var box = step.closest(".aeg-stepper");
        var id = box.getAttribute("data-id");
        if (!id) return;
        var cur = find(id);
        if (!cur) return;
        var next = cleanQty(Math.max(1, Math.round((cur.qty + Number(step.getAttribute("data-step"))) * 100) / 100));
        setQty(id, next);
        return;
      }
      var unit = e.target.closest(".aeg-units .aeg-unit");
      if (unit) {
        var group = unit.closest(".aeg-units");
        var uid = group.getAttribute("data-id");
        if (uid) setUnit(uid, unit.getAttribute("data-unit"));
      }
    });
    root.addEventListener("change", function (e) {
      var input = e.target.closest(".aeg-stepper .aeg-qty");
      if (!input) return;
      var id = input.closest(".aeg-stepper").getAttribute("data-id");
      if (id) setQty(id, input.value);
    });
    root.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.classList && e.target.classList.contains("aeg-qty")) {
        e.preventDefault();
        e.target.blur();
      }
    });
  }

  /* ---------- toast ---------- */
  var toast, toastTimer;
  function mountToast() {
    toast = document.createElement("div");
    toast.className = "aeg-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    toast.addEventListener("click", function (e) {
      if (e.target.closest("[data-open-cart]")) {
        hideToast();
        openDrawer();
      }
    });
  }
  function showToast(p) {
    if (!toast) return;
    toast.innerHTML =
      '<img src="' + p.img + '" alt=""/>' +
      '<div class="aeg-toast-txt"><strong><i class="fa-solid fa-circle-check"></i> ' + esc(t.added(pName(p))) + "</strong>" +
      '<span>' + esc(t.items(items.length)) + "</span></div>" +
      '<button type="button" class="aeg-toast-btn" data-open-cart>' + esc(t.open) + "</button>";
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4000);
  }
  function hideToast() {
    if (toast) toast.classList.remove("is-show");
  }

  /* ---------- catalog cards: quick add ---------- */
  function cardId(card) {
    var a = card.querySelector(".shop-content .title a, .shop-thumb a");
    if (!a) return null;
    try {
      return new URL(a.getAttribute("href"), window.location.href).searchParams.get("id");
    } catch (e) {
      return null;
    }
  }
  function mountQuickAdd(scope) {
    var cards = (scope || document).querySelectorAll(".shop-item");
    Array.prototype.forEach.call(cards, function (card) {
      if (card.querySelector(".aeg-quick")) return;
      var id = cardId(card);
      var p = id && product(id);
      var thumb = card.querySelector(".shop-thumb");
      if (!p || !thumb) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "aeg-quick";
      btn.setAttribute("data-quick", id);
      thumb.appendChild(btn);
    });
    renderQuick();
  }
  function renderQuick() {
    var btns = document.querySelectorAll(".aeg-quick");
    Array.prototype.forEach.call(btns, function (btn) {
      var id = btn.getAttribute("data-quick");
      var p = product(id);
      var on = !!find(id);
      btn.classList.toggle("is-in", on);
      btn.innerHTML = on
        ? '<i class="fa-solid fa-check"></i><span>' + esc(t.inCart) + "</span>"
        : '<i class="fa-regular fa-basket-shopping"></i><span>' + esc(t.add) + "</span>";
      btn.setAttribute("aria-label", (on ? t.inCart : t.add) + ": " + (p ? pName(p) : ""));
    });
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".aeg-quick");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var id = btn.getAttribute("data-quick");
    var p = product(id);
    if (!p) return;
    if (find(id)) {
      openDrawer();
      return;
    }
    addItem(id, 1, unitsFor(p)[0]);
    bump();
    showToast(p);
  });

  /* ---------- product detail: qty + unit + add ---------- */
  var buyState = null;
  function mountBuy() {
    var box = document.getElementById("aegBuy");
    if (!box) return;
    var id = new URLSearchParams(window.location.search).get("id");
    var p = product(id);
    if (!p) return;
    var cur = find(id);
    buyState = { id: id, qty: cur ? cur.qty : 1, unit: cur ? cur.unit : unitsFor(p)[0] };
    box.addEventListener("click", function (e) {
      var step = e.target.closest(".aeg-step");
      if (step) {
        buyState.qty = cleanQty(Math.max(1, buyState.qty + Number(step.getAttribute("data-step"))));
        renderBuy();
        return;
      }
      var unit = e.target.closest(".aeg-unit");
      if (unit) {
        buyState.unit = unit.getAttribute("data-unit");
        renderBuy();
        return;
      }
      if (e.target.closest("[data-buy]")) {
        addItem(buyState.id, buyState.qty, buyState.unit);
        bump();
        showToast(p);
        return;
      }
      if (e.target.closest("[data-open-cart]")) openDrawer();
    });
    box.addEventListener("change", function (e) {
      if (e.target.classList.contains("aeg-qty")) {
        buyState.qty = cleanQty(e.target.value);
        renderBuy();
      }
    });
    renderBuy();
  }
  function renderBuy() {
    var box = document.getElementById("aegBuy");
    if (!box || !buyState) return;
    var p = product(buyState.id);
    var cur = find(buyState.id);
    var same = cur && cur.qty === buyState.qty && cur.unit === buyState.unit;
    var label = !cur ? t.add : same ? t.inCart : t.update;
    box.innerHTML =
      '<div class="aeg-buy-row">' +
      '<div class="aeg-buy-field"><span class="aeg-buy-label">' + esc(t.qty) + "</span>" + stepper("", buyState.qty, "is-lg") + "</div>" +
      '<div class="aeg-buy-field"><span class="aeg-buy-label">' + esc(t.unit) + "</span>" + unitChips(p, buyState.unit, "") + "</div>" +
      "</div>" +
      '<div class="aeg-buy-actions">' +
      '<button type="button" class="aeg-btn aeg-btn-lg' + (same ? " is-done" : "") + '" data-buy>' +
      (same ? '<i class="fa-solid fa-check"></i> ' : '<i class="fa-regular fa-basket-shopping"></i> ') + esc(label) + "</button>" +
      (cur ? '<button type="button" class="aeg-btn-link" data-open-cart>' + esc(t.open) + ' <i class="fa-regular fa-arrow-right"></i></button>' : "") +
      '<a class="aeg-product-call" href="tel:' + PHONE + '"><i class="fa-solid fa-phone"></i> ' + PHONE_LABEL + "</a>" +
      "</div>";
  }

  /* ---------- cart page ---------- */
  var page = null;
  var form = { name: "", phone: "", company: "", region: "", comment: "", method: "call" };
  function mountPage() {
    page = document.getElementById("aegCartPage");
    if (!page) return;
    bindListEvents(page);
    page.addEventListener("input", function (e) {
      var f = e.target.getAttribute && e.target.getAttribute("data-field");
      if (f) {
        form[f] = e.target.value;
        var wrap = e.target.closest(".aeg-field");
        if (wrap) wrap.classList.remove("has-error");
      }
    });
    page.addEventListener("click", function (e) {
      var m = e.target.closest("[data-method]");
      if (m) {
        form.method = m.getAttribute("data-method");
        Array.prototype.forEach.call(page.querySelectorAll("[data-method]"), function (b) {
          var on = b === m;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-checked", on);
        });
        return;
      }
      if (e.target.closest("[data-clear]")) {
        clearCart();
        return;
      }
      if (e.target.closest("[data-copy]")) {
        copyText(e.target.closest("[data-copy]"));
        return;
      }
      if (e.target.closest("[data-new]")) {
        try {
          sessionStorage.removeItem(LAST);
        } catch (err) {}
        renderPage();
      }
    });
    page.addEventListener("submit", function (e) {
      e.preventDefault();
      submit();
    });
    renderPage();
  }

  function lastRequest() {
    try {
      return JSON.parse(sessionStorage.getItem(LAST) || "null");
    } catch (e) {
      return null;
    }
  }

  function field(name, label, type, required, opts) {
    opts = opts || {};
    var tag = type === "textarea"
      ? '<textarea id="aeg-f-' + name + '" data-field="' + name + '" rows="3">' + esc(form[name]) + "</textarea>"
      : '<input id="aeg-f-' + name + '" data-field="' + name + '" type="' + type + '" value="' + esc(form[name]) + '"' +
        (opts.inputmode ? ' inputmode="' + opts.inputmode + '"' : "") +
        (opts.autocomplete ? ' autocomplete="' + opts.autocomplete + '"' : "") +
        (opts.placeholder ? ' placeholder="' + esc(opts.placeholder) + '"' : "") +
        (required ? ' required aria-required="true"' : "") + "/>";
    return (
      '<div class="aeg-field" data-wrap="' + name + '">' +
      '<label for="aeg-f-' + name + '">' + esc(label) + (required ? ' <b>*</b>' : ' <em>(' + esc(t.optional) + ")</em>") + "</label>" +
      tag +
      '<small class="aeg-field-err">' + esc(opts.error || "") + "</small>" +
      "</div>"
    );
  }

  function renderPage() {
    if (!page) return;
    var done = lastRequest();
    if (done) {
      page.innerHTML = successView(done);
      refreshScroll();
      return;
    }
    if (!items.length) {
      page.innerHTML = '<div class="aeg-cart-page-empty">' + emptyState() + "</div>";
      refreshScroll();
      return;
    }
    var keepFocus = document.activeElement && document.activeElement.id;
    page.innerHTML =
      '<div class="row gy-5">' +
      '<div class="col-lg-7">' +
      '<div class="aeg-page-head"><h2>' + esc(t.summary) + "</h2>" +
      '<span class="aeg-cart-count">' + esc(t.items(items.length)) + "</span></div>" +
      '<ul class="aeg-lines aeg-lines-page">' +
      items.map(function (it) { return itemRow(it, false); }).join("") +
      "</ul>" +
      '<div class="aeg-page-tools">' +
      '<a class="aeg-btn-link" href="' + withLang("shop.html") + '"><i class="fa-regular fa-arrow-left"></i> ' + esc(t.keepBrowsing) + "</a>" +
      '<button type="button" class="aeg-btn-link is-muted" data-clear><i class="fa-regular fa-trash-can"></i> ' + esc(t.clear) + "</button>" +
      "</div>" +
      "</div>" +
      '<div class="col-lg-5">' +
      '<form class="aeg-request-card" novalidate>' +
      "<h3>" + esc(t.formTitle) + "</h3>" +
      field("name", t.name, "text", true, { autocomplete: "name", error: t.errName }) +
      field("phone", t.phone, "tel", true, { inputmode: "tel", autocomplete: "tel", placeholder: "+998 __ ___ __ __", error: t.errPhone }) +
      field("company", t.company, "text", false, { autocomplete: "organization" }) +
      field("region", t.region, "text", false, { autocomplete: "address-level1" }) +
      field("comment", t.comment, "textarea", false) +
      '<div class="aeg-field"><span class="aeg-field-label">' + esc(t.contactBy) + "</span>" +
      '<div class="aeg-methods" role="radiogroup">' +
      ["call", "telegram", "email"]
        .map(function (m) {
          var on = form.method === m;
          var ic = m === "call" ? "fa-solid fa-phone" : m === "telegram" ? "fa-brands fa-telegram" : "fa-regular fa-envelope";
          return '<button type="button" role="radio" aria-checked="' + on + '" class="aeg-method' + (on ? " is-active" : "") + '" data-method="' + m + '"><i class="' + ic + '"></i> ' + esc(t.methods[m]) + "</button>";
        })
        .join("") +
      "</div></div>" +
      '<p class="aeg-cart-note"><i class="fa-regular fa-circle-info"></i> ' + esc(t.note) + "</p>" +
      '<button type="submit" class="aeg-btn aeg-btn-lg aeg-btn-block"><i class="fa-regular fa-paper-plane"></i> ' + esc(t.submit) + "</button>" +
      "</form>" +
      "</div>" +
      "</div>";
    if (keepFocus) {
      var el = document.getElementById(keepFocus);
      if (el && el.focus) el.focus();
    }
    refreshScroll();
  }

  function requestNumber() {
    var d = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return "AEG-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" +
      Math.floor(1000 + Math.random() * 9000);
  }

  function buildText(req) {
    var lines = [t.mailIntro, ""];
    req.items.forEach(function (it, i) {
      lines.push(i + 1 + ". " + it.name + " — " + fmtQty(it.qty) + " " + it.unit);
    });
    lines.push("");
    lines.push(t.name + ": " + req.form.name);
    lines.push(t.phone + ": " + req.form.phone);
    if (req.form.company) lines.push(t.company + ": " + req.form.company);
    if (req.form.region) lines.push(t.region + ": " + req.form.region);
    lines.push(t.contactBy + " " + t.methods[req.form.method]);
    if (req.form.comment) lines.push(t.comment + ": " + req.form.comment);
    lines.push("");
    lines.push(t.requestNo + ": " + req.no);
    return lines.join("\n");
  }

  function mailto(req) {
    return "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(t.subject + " " + req.no) +
      "&body=" + encodeURIComponent(buildText(req));
  }

  function submit() {
    if (!items.length) {
      renderPage();
      return;
    }
    var ok = true;
    var nameOk = form.name.trim().length >= 2;
    var phoneOk = form.phone.replace(/\D/g, "").length >= 9;
    var nameWrap = page.querySelector('[data-wrap="name"]');
    var phoneWrap = page.querySelector('[data-wrap="phone"]');
    if (nameWrap) nameWrap.classList.toggle("has-error", !nameOk);
    if (phoneWrap) phoneWrap.classList.toggle("has-error", !phoneOk);
    if (!nameOk || !phoneOk) {
      ok = false;
      var first = page.querySelector(".has-error input");
      if (first) first.focus();
    }
    if (!ok) return;

    var req = {
      no: requestNumber(),
      form: {
        name: form.name.trim(),
        phone: form.phone.trim(),
        company: form.company.trim(),
        region: form.region.trim(),
        comment: form.comment.trim(),
        method: form.method,
      },
      items: items.map(function (it) {
        var p = product(it.id);
        return { id: it.id, name: pName(p), img: p.img, qty: it.qty, unit: unitLabel(it.unit) };
      }),
    };
    try {
      sessionStorage.setItem(LAST, JSON.stringify(req));
    } catch (e) {}
    clearCart();
    window.location.href = mailto(req);
    renderPage();
    try {
      window.scrollTo(0, 0);
      var s = window.ScrollSmoother && window.ScrollSmoother.get();
      if (s) s.scrollTo(0, false);
    } catch (e) {}
  }

  function successView(req) {
    return (
      '<div class="aeg-success">' +
      '<span class="aeg-success-ic"><i class="fa-solid fa-check"></i></span>' +
      "<h2>" + esc(t.successTitle) + "</h2>" +
      '<p class="aeg-success-no">' + esc(t.requestNo) + ": <b>" + esc(req.no) + "</b></p>" +
      "<p>" + esc(t.successText) + "</p>" +
      '<ul class="aeg-success-list">' +
      req.items
        .map(function (it) {
          return '<li><img src="' + it.img + '" alt=""/><span>' + esc(it.name) + "</span><b>" + esc(fmtQty(it.qty) + " " + it.unit) + "</b></li>";
        })
        .join("") +
      "</ul>" +
      '<div class="aeg-success-actions">' +
      '<a class="aeg-btn" href="' + esc(mailto(req)) + '"><i class="fa-regular fa-envelope"></i> ' + esc(t.sendEmail) + "</a>" +
      '<button type="button" class="aeg-btn aeg-btn-ghost" data-copy="' + esc(buildText(req)) + '"><i class="fa-regular fa-copy"></i> <span>' + esc(t.copy) + "</span></button>" +
      '<a class="aeg-btn aeg-btn-ghost" href="tel:' + PHONE + '"><i class="fa-solid fa-phone"></i> ' + esc(t.call) + "</a>" +
      "</div>" +
      '<button type="button" class="aeg-btn-link" data-new>' + esc(t.newRequest) + ' <i class="fa-regular fa-arrow-right"></i></button>' +
      "</div>"
    );
  }

  function copyText(btn) {
    var text = btn.getAttribute("data-copy");
    var done = function () {
      var span = btn.querySelector("span");
      if (span) span.textContent = t.copied;
      setTimeout(function () {
        if (span) span.textContent = t.copy;
      }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch (e) {}
      document.body.removeChild(ta);
      done();
    }
  }

  function refreshScroll() {
    try {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    } catch (e) {}
  }

  /* ---------- render all ---------- */
  function renderAll() {
    renderHeader();
    renderQuick();
    if (drawer && drawer.classList.contains("is-open")) renderDrawer();
    renderBuy();
    renderPage();
  }

  mountHeader();
  mountDrawer();
  mountToast();
  mountQuickAdd();
  mountBuy();
  mountPage();
  renderHeader();

  window.AEG_CART = {
    open: openDrawer,
    close: closeDrawer,
    add: addItem,
    mountQuickAdd: mountQuickAdd,
  };
})();
