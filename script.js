// Smooth scroll from hero arrow to first panel
const scrollArrow = document.getElementById("scrollArrow");
const firstPanel = document.querySelector(".panel-screen");

if (scrollArrow && firstPanel) {
  scrollArrow.addEventListener("click", () => {
    firstPanel.scrollIntoView({ behavior: "smooth" });
  });
}

// Open overlays when clicking panel buttons
const openButtons = document.querySelectorAll(".panel-open");

openButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const targetId = btn.getAttribute("data-overlay-target");
    if (!targetId) return;
    const overlay = document.getElementById(targetId);
    if (!overlay) return;
    overlay.classList.add("active");
  });
});

// Close overlays via close button or clicking backdrop
const overlays = document.querySelectorAll(".overlay");

overlays.forEach((overlay) => {
  const closeBtn = overlay.querySelector("[data-close]");
  const backdrop = overlay.querySelector(".overlay-backdrop");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active");
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      overlay.classList.remove("active");
    });
  }
});
