// script.js

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load Projects from JSON
async function loadProjects() {
    try {
        const response = await fetch('projects.json');
        const projects = await response.json();
        const container = document.getElementById('projectsContainer');
        
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.onclick = () => openModal(project);
            
            const techTags = project.tech.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('');
            
            card.innerHTML = `
                <h3>${project.title}</h3>
                <p>${project.shortDescription}</p>
                <div class="tech-tags">${techTags}</div>
            `;
            
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Modal Functions
function openModal(project) {
    const modal = document.getElementById('projectModal');
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.fullDescription;
    
    const techTags = project.tech.map(tech => 
        `<span class="tech-tag">${tech}</span>`
    ).join('');
    document.getElementById('modalTech').innerHTML = techTags;
    
    document.getElementById('modalGithub').href = project.github;
    document.getElementById('modalDemo').href = project.demo;
    
    modal.style.display = 'block';
}

// Close Modal
document.querySelector('.close').onclick = function() {
    document.getElementById('projectModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('projectModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category, .project-card, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Initialize
document.addEventListener('DOMContentLoaded', loadProjects);
