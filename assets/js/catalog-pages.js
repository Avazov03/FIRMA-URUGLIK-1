/* Fills shop-details / service-details from ?id= and prefills the contact form. Runs before main.js. */
(function () {
  var C = window.AEG_CATALOG;
  if (!C) return;

  var lang = (window.AEG_I18N && window.AEG_I18N.lang) || "uz";
  var ui = C.ui[lang] || C.ui.uz;
  var params = new URLSearchParams(window.location.search);

  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    var el = $(id);
    if (el) el.textContent = value;
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function withLang(url) {
    if (lang === "uz") return url;
    return url + (url.indexOf("?") === -1 ? "?" : "&") + "lang=" + lang;
  }

  function findBy(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function setButton(el, text, href) {
    if (!el) return;
    el.setAttribute("href", href);
    var label = el.querySelector(".btn-text");
    if (label) label.setAttribute("data-text", text);
  }

  function setPageTitle(name) {
    document.title = name + " — AGRO EXPORT GROUP";
  }

  function renderProduct() {
    var root = $("aegProduct");
    if (!root) return;
    var p = findBy(C.products, params.get("id"));
    if (!p) {
      window.location.replace("shop.html");
      return;
    }
    var name = p[lang] || p.uz;
    var catName = C.categories[p.cat][lang];

    setPageTitle(name);
    setText("aegCrumbTitle", name);
    var crumb = $("aegCrumbLink");
    if (crumb) {
      crumb.textContent = catName;
      crumb.setAttribute("href", withLang("shop.html?cat=" + p.cat));
    }

    var img = $("aegProductImage");
    if (img) {
      img.src = p.img;
      img.alt = name;
    }
    setText("aegProductCat", catName);
    setText("aegProductName", name);
    setText("aegProductPrice", C.price[lang]);
    setText("aegProductLead", C.lead(lang, name, p.cat));
    setText("aegProductFeatTitle", ui.featureTitle);
    setText("aegProductOrder", C.order[lang]);

    var list = $("aegProductFeatures");
    if (list) {
      list.innerHTML = C.features[p.cat][lang]
        .map(function (f) {
          return '<li><i class="fa-solid fa-check"></i> ' + esc(f) + "</li>";
        })
        .join("");
    }

    setButton($("aegProductRequest"), ui.request, withLang("contact.html?product=" + p.id));

    var related = C.products.filter(function (x) {
      return x.cat === p.cat && x.id !== p.id;
    });
    if (related.length < 4) {
      related = related.concat(
        C.products.filter(function (x) {
          return x.cat !== p.cat;
        })
      );
    }
    related = related.slice(0, 6);

    setText("aegRelatedTitle", ui.related);
    var wrap = $("aegRelated");
    if (wrap) {
      wrap.innerHTML = related
        .map(function (x) {
          var href = withLang("shop-details.html?id=" + x.id);
          var xName = x[lang] || x.uz;
          return (
            '<div class="swiper-slide"><div class="shop-item">' +
            "<span>" + esc(C.categories[x.cat][lang]) + "</span>" +
            '<div class="shop-thumb"><a href="' + href + '"><img alt="' + esc(xName) + '" src="' + x.img + '"/></a>' +
            '<a class="card-btn" href="' + href + '">' + esc(ui.details) + "</a></div>" +
            '<div class="shop-content"><h3 class="title"><a href="' + href + '">' + esc(xName) + "</a></h3>" +
            '<h3 class="price">' + esc(C.price[lang]) + "</h3></div>" +
            "</div></div>"
          );
        })
        .join("");
    }
  }

  function renderService() {
    var root = $("aegService");
    if (!root) return;
    var s = findBy(C.services, params.get("id"));
    if (!s) {
      window.location.replace("service.html");
      return;
    }
    var t = s[lang] || s.uz;

    setPageTitle(t.title);
    setText("aegCrumbTitle", t.title);
    var crumb = $("aegCrumbLink");
    if (crumb) {
      crumb.textContent = ui.services;
      crumb.setAttribute("href", withLang("service.html"));
    }

    setText("aegServiceHeading", t.heading);
    setText("aegServiceP1", t.p1);
    setText("aegServiceP2", t.p2);
    setText("aegServiceP3", t.p3);

    var list = $("aegServiceList");
    if (list) {
      list.innerHTML = t.list
        .map(function (item) {
          return '<li><i class="fa-regular fa-circle-check"></i> ' + esc(item) + "</li>";
        })
        .join("");
    }

    var img = $("aegServiceImage");
    if (img) {
      img.src = s.img;
      img.alt = t.title;
    }

    setButton($("aegServiceRequest"), ui.request, withLang("contact.html?service=" + s.id));
    setButton($("aegServiceProducts"), ui.viewProducts, withLang(s.link));

    setText("aegOtherServicesTitle", ui.otherServices);
    var others = $("aegOtherServices");
    if (others) {
      others.innerHTML = C.services
        .filter(function (x) {
          return x.id !== s.id;
        })
        .map(function (x) {
          var xt = x[lang] || x.uz;
          return (
            '<li><a href="' + withLang("service-details.html?id=" + x.id) + '">' +
            esc(xt.title) + ' <i class="fa-regular fa-arrow-right"></i></a></li>'
          );
        })
        .join("");
    }
  }

  function prefillContact() {
    var message = $("message");
    var form = $("ajax_contact");
    if (!message || !form) return;
    var p = findBy(C.products, params.get("product"));
    var s = findBy(C.services, params.get("service"));
    var label = p ? p[lang] || p.uz : s ? (s[lang] || s.uz).title : "";
    if (!label) return;
    if (!message.value) message.value = ui.requestPrefix + label + "\n";
    var select = form.querySelector("select[name='topic']");
    if (select) {
      var want = p ? p.cat : C.categories[s.id] ? s.id : "service-" + s.id;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === want) select.selectedIndex = i;
      }
    }
  }

  renderProduct();
  renderService();
  prefillContact();
  if (window.AEG_I18N && window.AEG_I18N.fitTitles) window.AEG_I18N.fitTitles();
})();
