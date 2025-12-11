// scroll arrow
const scrollArrow = document.getElementById("scrollArrow");
const mainSection = document.getElementById("mainSection");

scrollArrow.addEventListener("click", () => {
  mainSection.scrollIntoView({ behavior: "smooth" });
});

// panel -> overlay open
const panels = document.querySelectorAll(".panel");

panels.forEach(panel => {
  panel.addEventListener("click", () => {
    const targetId = panel.getAttribute("data-overlay-target");
    if (!targetId) return;
    const overlay = document.getElementById(targetId);
    if (!overlay) return;
    overlay.classList.add("active");
  });
});

// close buttons and click outside
const overlays = document.querySelectorAll(".overlay");

overlays.forEach(overlay => {
  const closeBtn = overlay.querySelector("[data-close]");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active");
    });
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
    }
  });
});
