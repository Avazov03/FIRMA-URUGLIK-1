/* Phone helpers: smart sticky header, quick call button, hiding placeholder social links. */
(function () {
  var PHONE = "+998921958008";
  var CALL = { uz: "Qo‘ng‘iroq qilish", ru: "Позвонить", en: "Call us" };
  var lang = (window.AEG_I18N && window.AEG_I18N.lang) || "uz";

  /* Social icons that still point to "#" or "" are template placeholders. */
  function hidePlaceholderSocial() {
    var links = document.querySelectorAll('a[href="#"], a[href=""]');
    Array.prototype.forEach.call(links, function (a) {
      if (!a.querySelector('i.fab, i[class*="fa-brands"]')) return;
      var li = a.closest("li");
      (li || a).style.display = "none";
    });
    var lists = document.querySelectorAll("ul");
    Array.prototype.forEach.call(lists, function (ul) {
      var items = ul.children;
      if (!items.length) return;
      var anyHidden = false;
      var anyVisible = false;
      Array.prototype.forEach.call(items, function (li) {
        if (li.style.display === "none") anyHidden = true;
        else anyVisible = true;
      });
      if (anyHidden && !anyVisible) ul.style.display = "none";
    });
  }

  /* Below 992px the template header scrolls away; keep it reachable when scrolling up. */
  function stickyHeader() {
    var bar = document.querySelector(".header .primary-header");
    if (!bar) return;
    var mq = window.matchMedia("(max-width: 991.98px)");
    var lastY = window.scrollY;
    var ticking = false;

    function update() {
      ticking = false;
      if (!mq.matches) {
        bar.classList.remove("aeg-hide");
        return;
      }
      var y = window.scrollY;
      if (y < 120) {
        bar.classList.remove("fixed", "aeg-hide");
      } else {
        bar.classList.add("fixed");
        if (y > lastY + 6) bar.classList.add("aeg-hide");
        else if (y < lastY - 6) bar.classList.remove("aeg-hide");
      }
      if (document.documentElement.classList.contains("aeg-cart-lock")) bar.classList.remove("aeg-hide");
      lastY = y;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  function callButton() {
    if (document.querySelector(".aeg-fab-call")) return;
    var a = document.createElement("a");
    a.className = "aeg-fab-call";
    a.href = "tel:" + PHONE;
    a.setAttribute("aria-label", CALL[lang] || CALL.uz);
    a.title = CALL[lang] || CALL.uz;
    a.innerHTML = '<i class="fa-solid fa-phone" aria-hidden="true"></i>';
    document.body.appendChild(a);
  }

  hidePlaceholderSocial();
  stickyHeader();
  callButton();
})();
