(function () {
  "use strict";

  document.addEventListener("dragstart", function (event) {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });
})();
