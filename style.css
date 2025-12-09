// Small interactivity: year, nav toggle, simple contact fallback
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // nav toggle for mobile
  const toggle = document.querySelector('.nav-toggle');
  toggle && toggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav-links');
    if(nav.style.display === 'flex') nav.style.display = 'none';
    else nav.style.display = 'flex';
  });

  // demo buttons: open links or alert placeholder
  document.querySelectorAll('[data-demo]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const which = btn.dataset.demo;
      alert('Demo for "' + which + '" is a placeholder. Deploy a demo and replace this link with the live URL.');
    });
  });
});

// Simple contact form handler (mailto fallback)
function handleContact(e){
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  // Use mailto: fallback so this works without a server
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:kashish.cs@outlook.com?subject=${subject}&body=${body}`;
}
