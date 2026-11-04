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
  var currentPage = 1;

  function matchedCards() {
    return cards.filter(function (card) {
      return (
        currentFilter === "all" ||
        card.getAttribute("data-category") === currentFilter
      );
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

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      tabs.forEach(function (t) {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      currentFilter = tab.getAttribute("data-filter") || "all";
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

  render();
})();
