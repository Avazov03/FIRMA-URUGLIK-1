/* Runs in <head> before paint. Hides the page only when a non-default language is stored. */
(function () {
  var lang = "uz";
  try {
    var q = new URLSearchParams(window.location.search).get("lang");
    if (q === "ru" || q === "en" || q === "uz") lang = q;
    else {
      var saved = localStorage.getItem("aeg-lang");
      if (saved === "ru" || saved === "en" || saved === "uz") lang = saved;
    }
  } catch (e) {}
  document.documentElement.setAttribute("lang", lang);
  window.odometerOptions = { format: "d" };
  try {
    if (sessionStorage.getItem("aeg-preloaded") === "1" || window.matchMedia("(pointer: coarse)").matches) {
      document.documentElement.classList.add("aeg-no-preloader");
    }
  } catch (e) {}
  if (lang === "ru") {
    var font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(font);
  }
  if (lang !== "uz") document.documentElement.classList.add("i18n-wait");
  window.setTimeout(function () {
    document.documentElement.classList.remove("i18n-wait");
  }, 3000);
})();
