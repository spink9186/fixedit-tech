// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Contact form — submits to Web3Forms (no backend needed)
  const form = document.querySelector('#contact-form');
  if (form) {
    const status = document.querySelector('#form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    const setStatus = (msg, color) => {
      if (!status) return;
      status.textContent = msg;
      status.style.color = color;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot: if a bot ticked the hidden box, silently drop it.
      if (form.querySelector('[name="botcheck"]')?.checked) return;

      // Guard against shipping without a real Web3Forms key.
      const key = form.querySelector('[name="access_key"]')?.value || '';
      if (!key || key === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        setStatus('Form not connected yet — add your Web3Forms access key to go live.', 'var(--trust-blue)');
        return;
      }

      const original = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      setStatus('Sending…', 'var(--trust-blue)');

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          form.reset();
          setStatus("Thanks — we've got your details and will reach out to schedule your assessment.", 'var(--presence-green, #16a34a)');
        } else {
          setStatus('Something went wrong sending that. Please email us directly and we’ll follow up.', '#dc2626');
        }
      } catch (err) {
        setStatus('Network error — please try again, or email us directly.', '#dc2626');
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = original; }
      }
    });
  }
});
