/* ==========================================================================
   JAVASCRIPT — comportamento interativo da página
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Header com sombra ao rolar a página ---------- */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  });

  /* ---------- 2. Menu hambúrguer (mobile) ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha o menu ao clicar em um link (útil no mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- 3. Cards de serviços expansíveis ---------- */
  document.querySelectorAll('.service-card').forEach(card => {
    const head = card.querySelector('.service-head');
    head.addEventListener('click', () => {
      const isOpen = card.classList.toggle('open');
      head.setAttribute('aria-expanded', String(isOpen));
    });
  });

  /* ---------- 4. Contador animado dos números de resultados ---------- */
  const counters = document.querySelectorAll('[data-count-to]');
  const animateCounter = (el) => {
    const target = Number(el.dataset.countTo);
    if (el.dataset.static !== undefined || Number.isNaN(target)) { el.textContent = target || '0'; return; }
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ---------- 5. Validação do formulário de captação de leads ---------- */
  const form = document.getElementById('leadForm');
  const successPanel = document.getElementById('formSuccess');

  const validators = {
    nome: (value) => value.trim().length >= 3,
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    telefone: (value) => value.replace(/\D/g, '').length >= 10,
  };

  const setFieldError = (fieldName, hasError) => {
    const group = form.querySelector(`.form-group[data-field="${fieldName}"]`);
    if (group) group.classList.toggle('has-error', hasError);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;

    Object.entries(validators).forEach(([fieldName, validate]) => {
      const field = form.elements[fieldName];
      const ok = validate(field.value || '');
      setFieldError(fieldName, !ok);
      if (!ok) isValid = false;
    });

    if (!isValid) {
      form.querySelector('.has-error input, .has-error select')?.focus();
      return;
    }

    // Simulação de envio bem-sucedido.
    // Para uso real, substitua este bloco por uma chamada a um backend,
    // serviço de e-mail (ex.: Formspree, EmailJS) ou webhook próprio.
    form.classList.add('is-submitted');
    successPanel.classList.add('visible');
    form.reset();
  });
});
