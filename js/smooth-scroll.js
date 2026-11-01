/*
 * Smooth wheel scrolling for the site.
 * Uses Lenis (js/lenis.min.js) and leaves touch scrolling native.
 * Automatically disabled for visitors who prefer reduced motion.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var lenis = null;

  function raf(time) {
    if (!lenis) return;
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  function init() {
    if (lenis || reduceMotion.matches || typeof window.Lenis === "undefined") {
      return;
    }

    lenis = new window.Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      allowNestedScroll: true,
      anchors: true,
    });

    window.lenis = lenis;
    requestAnimationFrame(raf);
  }

  function destroy() {
    if (!lenis) return;
    lenis.destroy();
    lenis = null;
    window.lenis = undefined;
    document.documentElement.classList.remove("lenis", "lenis-smooth");
  }

  function syncPreference() {
    if (reduceMotion.matches) {
      destroy();
    } else {
      init();
    }
  }

  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", syncPreference);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncPreference, { once: true });
  } else {
    syncPreference();
  }
})();
