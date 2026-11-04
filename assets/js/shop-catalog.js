(function () {
  var tabs = document.querySelectorAll(".shop-catalog-tabs .shop-tab");
  var cards = Array.prototype.slice.call(
    document.querySelectorAll("#shopCatalogGrid .shop-card")
  );
  var countEl = document.getElementById("shopResultCount");
  var pagination = document.getElementById("shopPagination");
  if (!tabs.length || !cards.length) return;

  var PAGE_SIZE = 8;
  var currentFilter = "all";
  var currentQuery = "";
  var currentPage = 1;

  function norm(value) {
    if (window.AEGSmartSearch && window.AEGSmartSearch.normalize) {
      return window.AEGSmartSearch.normalize(value);
    }
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[ʻʼ`´’]/g, "'")
      .replace(/\s+/g, " ");
  }

  function compact(value) {
    if (window.AEGSmartSearch && window.AEGSmartSearch.compact) {
      return window.AEGSmartSearch.compact(value);
    }
    return norm(value).replace(/['\s-]/g, "");
  }

  function cardText(card) {
    return (
      (card.getAttribute("data-category") || "") +
      " " +
      (card.textContent || "")
    );
  }

  function cardMatchesQuery(card, q) {
    if (!q) return true;
    var hay = norm(cardText(card));
    var hayC = compact(cardText(card));
    var ql = norm(q);
    var qC = compact(q);
    if (hay.indexOf(ql) !== -1 || hayC.indexOf(qC) !== -1) return true;
    var parts = ql.split(" ").filter(Boolean);
    return parts.every(function (p) {
      return hay.indexOf(p) !== -1 || hayC.indexOf(compact(p)) !== -1;
    });
  }

  function matchedCards() {
    return cards.filter(function (card) {
      var catOk =
        currentFilter === "all" ||
        card.getAttribute("data-category") === currentFilter;
      return catOk && cardMatchesQuery(card, currentQuery);
    });
  }

  function setCount(n) {
    if (!countEl) return;
    countEl.textContent = n + " ta mahsulot";
  }

  function renderPagination(totalPages) {
    if (!pagination) return;
    var html = "";
    for (var i = 1; i <= totalPages; i++) {
      var num = i < 10 ? "0" + i : String(i);
      html +=
        '<li><a href="#" data-page="' +
        i +
        '"' +
        (i === currentPage ? ' class="active"' : "") +
        ">" +
        num +
        "</a></li>";
    }
    if (totalPages > 1) {
      html +=
        '<li><a href="#" data-page="next" aria-label="Keyingi"' +
        (currentPage >= totalPages ? ' class="is-disabled"' : "") +
        '><i class="fa-regular fa-arrow-right"></i></a></li>';
    }
    pagination.innerHTML = html;
  }

  function render() {
    var matched = matchedCards();
    var totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    cards.forEach(function (card) {
      card.classList.add("is-hidden");
    });

    var start = (currentPage - 1) * PAGE_SIZE;
    matched.slice(start, start + PAGE_SIZE).forEach(function (card) {
      card.classList.remove("is-hidden");
    });

    setCount(matched.length);
    renderPagination(totalPages);
  }

  function activateTab(filter) {
    currentFilter = filter || "all";
    tabs.forEach(function (t) {
      var on = (t.getAttribute("data-filter") || "all") === currentFilter;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      activateTab(tab.getAttribute("data-filter") || "all");
      currentPage = 1;
      render();
    });
  });

  if (pagination) {
    pagination.addEventListener("click", function (e) {
      var link = e.target.closest("a[data-page]");
      if (!link || link.classList.contains("is-disabled")) return;
      e.preventDefault();
      var page = link.getAttribute("data-page");
      var totalPages = Math.max(1, Math.ceil(matchedCards().length / PAGE_SIZE));
      if (page === "next") {
        currentPage = Math.min(totalPages, currentPage + 1);
      } else {
        currentPage = parseInt(page, 10) || 1;
      }
      render();
      var section = document.querySelector(".shop-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /* Deep-link from smart search: ?cat=&q= */
  try {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get("cat");
    var q = params.get("q");
    if (cat) activateTab(cat);
    if (q) currentQuery = q;
  } catch (err) {
    /* ignore */
  }

  render();

  if (currentQuery) {
    var section = document.querySelector(".shop-section");
    if (section) {
      window.setTimeout(function () {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }
})();
