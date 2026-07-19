(function () {
  function initialiseConstellation(constellation) {
    var nodes = Array.prototype.slice.call(constellation.querySelectorAll("[data-constellation-node]"));
    var detail = constellation.querySelector("[data-constellation-detail]");
    var detailContext = detail.querySelector("[data-constellation-detail-context]");
    var detailTitle = detail.querySelector("[data-constellation-detail-title]");
    var detailDescription = detail.querySelector("[data-constellation-detail-description]");
    var lockedNode = null;

    function resetDetail() {
      constellation.removeAttribute("data-active-context");
      constellation.removeAttribute("data-active-node");
      detailContext.textContent = constellation.dataset.defaultContext;
      detailTitle.textContent = constellation.dataset.defaultTitle;
      detailDescription.textContent = constellation.dataset.defaultDescription;
      nodes.forEach(function (node) {
        node.classList.remove("is-active");
        node.setAttribute("aria-pressed", "false");
      });
    }

    function showNode(node, isLocked) {
      var nodeId = node.dataset.node;
      constellation.dataset.activeNode = nodeId;
      constellation.dataset.activeContext = node.dataset.context;
      detailContext.textContent = node.dataset.contextName;
      detailTitle.textContent = node.dataset.nodeName;
      detailDescription.textContent = node.dataset.nodeDescription;
      nodes.forEach(function (item) {
        var isActive = item.dataset.node === nodeId;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", isActive && isLocked ? "true" : "false");
      });
    }

    nodes.forEach(function (node) {
      node.addEventListener("mouseenter", function () {
        if (!lockedNode) showNode(node, false);
      });
      node.addEventListener("mouseleave", function () {
        if (!lockedNode) resetDetail();
      });
      node.addEventListener("focus", function () {
        if (!lockedNode) showNode(node, false);
      });
      node.addEventListener("blur", function () {
        if (!lockedNode) resetDetail();
      });
      node.addEventListener("click", function () {
        lockedNode = lockedNode === node.dataset.node ? null : node.dataset.node;
        if (lockedNode) {
          showNode(node, true);
        } else {
          resetDetail();
        }
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lockedNode) {
        lockedNode = null;
        resetDetail();
      }
    });
  }

  function initialiseAll() {
    document.querySelectorAll("[data-interactive-constellation]").forEach(initialiseConstellation);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseAll);
  } else {
    initialiseAll();
  }
}());
