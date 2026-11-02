(function () {
  "use strict";

  var OVERLAY_SELECTOR = ".page-transition-overlay";
  var EXIT_DURATION = 350;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var navigating = false;

  function getOverlay() {
    return document.querySelector(OVERLAY_SELECTOR);
  }

  function revealPage() {
    var overlay = getOverlay();
    if (!overlay) return;

    if (reduceMotion.matches) {
      overlay.classList.remove("is-visible");
      return;
    }

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        overlay.classList.remove("is-visible");
      });
    });

    window.setTimeout(function () {
      overlay.classList.remove("is-visible");
    }, 1500);
  }

  function hideOverlay() {
    var overlay = getOverlay();
    if (overlay) overlay.classList.remove("is-visible");
    navigating = false;
  }

  function navigateTo(url) {
    if (navigating) return;
    navigating = true;

    var overlay = getOverlay();
    if (!overlay || reduceMotion.matches) {
      window.location.href = url;
      return;
    }

    overlay.classList.add("is-visible");
    window.setTimeout(function () {
      window.location.href = url;
    }, EXIT_DURATION);
  }

  document.addEventListener("click", function (event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    var link = event.target && event.target.closest ? event.target.closest("a[href]") : null;
    if (!link) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    var url;
    try {
      url = new URL(link.getAttribute("href"), window.location.href);
    } catch (error) {
      return;
    }

    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;
    if (url.href === window.location.href) return;

    event.preventDefault();
    navigateTo(url.href);
  });

  function start() {
    revealPage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      hideOverlay();
    } else {
      revealPage();
    }
  });

  window.addEventListener("pagehide", function () {
    navigating = false;
  });
})();
