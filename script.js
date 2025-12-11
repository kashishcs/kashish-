// Scroll down button
document.getElementById("scrollBtn").onclick = () => {
  document.querySelector("main").scrollIntoView({ behavior: "smooth" });
};

// Cards open/close logic
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
  card.addEventListener("click", () => {
    const target = card.dataset.card;
    const panel = document.getElementById("panel-" + target);

    document.querySelectorAll(".panel").forEach(p => p.classList.remove("show"));
    panel.classList.add("show");
  });
});

