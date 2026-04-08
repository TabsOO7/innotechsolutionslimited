'use strict';

const EMAILJS_CONFIG = {
  serviceId:  'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  publicKey:  'YOUR_PUBLIC_KEY',
};

(function initContactForm() {
  const form = document.getElementById('contactForm');
  const msgEl = document.getElementById('form-message');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (!form || !msgEl || !submitBtn) return;

  // Init EmailJS
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessage();

    const name = form.user_name?.value.trim() || '';
    const email = form.user_email?.value.trim() || '';
    const message = form.message?.value.trim() || '';

    if (!name) return error('Please enter your name.', form.user_name);
    if (!email || !isValidEmail(email)) return error('Invalid email address.', form.user_email);
    if (!message) return error('Message cannot be empty.', form.message);

    setLoading(true);

    try {
      if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID') {
        await emailjs.sendForm(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          form
        );
      } else {
        await delay(1000); // demo
      }

      success("✓ Message sent successfully.");
      form.reset();

    } catch (err) {
      console.error(err);
      error('Something went wrong. Try again later.');
    }

    setLoading(false);
  });

  function setLoading(state) {
    submitBtn.disabled = state;
    submitBtn.textContent = state ? 'Sending…' : 'Send Message';
  }

  function success(msg) {
    msgEl.textContent = msg;
    msgEl.className = 'form-message success';
  }

  function error(msg, input) {
    msgEl.textContent = msg;
    msgEl.className = 'form-message error';
    input?.focus();
  }

  function clearMessage() {
    msgEl.textContent = '';
    msgEl.className = 'form-message';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }
})();