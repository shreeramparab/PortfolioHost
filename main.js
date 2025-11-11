document.addEventListener('DOMContentLoaded', function () {
  const yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();
  // Mobile menu toggle (hamburger)
  try {
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.nav');
    if (menuBtn && nav) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('active');
      });

      // Close when clicking outside
      document.addEventListener('click', (ev) => {
        if (!nav.contains(ev.target) && !menuBtn.contains(ev.target)) {
          nav.classList.remove('active');
        }
      });

      // Close when a link inside nav is clicked
      nav.addEventListener('click', (ev) => {
        if (ev.target.tagName === 'A') nav.classList.remove('active');
      });
    }
  } catch (e) {
    // ignore if DOM APIs not available
    console.warn('menu toggle error', e);
  }
  const elements = document.querySelectorAll('.fade-in, .slide-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (idx * 0.08) + 's';
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  elements.forEach(el => observer.observe(el));

  // portrait parallax hover
  const portraitWrap = document.querySelector('.portrait-wrap');
  if (portraitWrap) {
    portraitWrap.addEventListener('mousemove', (e) => {
      const rect = portraitWrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      portraitWrap.style.transform = `rotateX(${ -y * 3 }deg) rotateY(${ x * 4 }deg)`;
    });
    portraitWrap.addEventListener('mouseleave', ()=> portraitWrap.style.transform = '');
  }
  // Image modal helper
  function openImageModal(src, title) {
    const overlay = document.createElement('div');
    overlay.className = 'image-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'image-modal';

    modal.innerHTML = `
      <div style="position:relative">
        <button class="image-modal-close" aria-label="Close">&times;</button>
        <div class="image-modal-body"><img src="${src}" alt="${title}" /></div>
        <div class="image-modal-footer">${title}</div>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const closeBtn = modal.querySelector('.image-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }

  // view image buttons (stop propagation so card click still works separately)
  document.querySelectorAll('.view-img-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const src = btn.dataset.img || btn.getAttribute('data-img') || 'images/myimage.jpg';
      const title = btn.closest('.project-card')?.querySelector('h3')?.innerText || btn.closest('.cert-card')?.querySelector('h3')?.innerText || 'Image';
      openImageModal(src, title);
    });
  });

  // project-card click: show a simple informational modal (separate from image modal)
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.dataset.title || card.querySelector('h3')?.innerText || 'Project';
      const body = card.querySelector('p')?.innerText || '';
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed'; overlay.style.inset = 0; overlay.style.background = 'rgba(0,0,0,0.5)'; overlay.style.display = 'flex'; overlay.style.alignItems = 'center'; overlay.style.justifyContent = 'center'; overlay.style.zIndex = 9999; overlay.style.padding = '20px';
      const box = document.createElement('div');
      box.style.background = '#fff'; box.style.maxWidth = '760px'; box.style.width = '100%'; box.style.borderRadius = '12px'; box.style.padding = '22px';
      box.innerHTML = `<h2 style="margin-top:0">${title}</h2><p style="color:#5a5a5a;line-height:1.6">${body}</p><div style="margin-top:18px;display:flex;gap:12px;justify-content:flex-end"><button class="project-modal-close" style="background:#0f2b46;color:#fff;padding:8px 12px;border-radius:8px;border:none">Close</button></div>`;
      overlay.appendChild(box); document.body.appendChild(overlay);
      overlay.querySelector('.project-modal-close').addEventListener('click', () => overlay.remove());
      overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
    });
  });
});