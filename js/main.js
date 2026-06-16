/**
 * I-NEX Landing Page — Main JavaScript
 */

(function() {
  'use strict';

  // ============================================================
  // Configuration
  // ============================================================
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyf-OZ3tenynkF2iWdhSBHSldkLcICtO9gziwHa9-hJ8I0oWLXMXGUZusIseKvjqvac3g/exec';

  // ============================================================
  // Mobile menu
  // ============================================================
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      const isOpen = nav.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on link click
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================================
  // Smooth scroll for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // Form handling
  // ============================================================
  const form = document.getElementById('registrationForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (!form) return;

  const validators = {
    fullName: function(value) {
      if (!value.trim()) return 'Будь ласка, вкажіть прізвище та ім’я.';
      if (value.trim().length < 3) return 'Ім’я занадто коротке.';
      return '';
    },
    company: function(value) {
      if (!value.trim()) return 'Будь ласка, вкажіть назву компанії.';
      return '';
    },
    position: function(value) {
      if (!value.trim()) return 'Будь ласка, вкажіть вашу посаду.';
      return '';
    },
    email: function(value) {
      if (!value.trim()) return 'Будь ласка, вкажіть email.';
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) return 'Некоректний формат email.';
      return '';
    },
    phone: function(value) {
      if (!value.trim()) return 'Будь ласка, вкажіть номер телефону.';
      const digits = value.replace(/\D/g, '');
      if (digits.length < 9) return 'Номер телефону занадто короткий.';
      return '';
    }
  };

  function showFieldError(fieldName, message) {
    const input = form.querySelector('[name="' + fieldName + '"]');
    const errorEl = form.querySelector('.error-message[data-for="' + fieldName + '"]');
    if (input) input.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll('input, textarea').forEach(function(el) {
      el.classList.remove('error');
    });
    form.querySelectorAll('.error-message').forEach(function(el) {
      el.textContent = '';
    });
  }

  function showStatus(type, message) {
    formStatus.className = 'form-status ' + type;
    formStatus.textContent = message;
    formStatus.style.display = 'block';
  }

  function hideStatus() {
    formStatus.className = 'form-status';
    formStatus.textContent = '';
    formStatus.style.display = 'none';
  }

  function validateForm() {
    clearErrors();
    let isValid = true;

    for (const fieldName in validators) {
      const input = form.querySelector('[name="' + fieldName + '"]');
      if (!input) continue;

      const error = validators[fieldName](input.value);
      if (error) {
        showFieldError(fieldName, error);
        isValid = false;
      }
    }

    return isValid;
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    hideStatus();

    if (!validateForm()) {
      showStatus('error', 'Будь ласка, виправте помилки у формі.');
      return;
    }

    // Check if SCRIPT_URL is still a placeholder
    if (SCRIPT_URL.includes('ВАШ_ІДЕНТИФІКАТОР')) {
      showStatus('error', 'Форма ще не підключена до Google Sheets. Дотримуйтесь інструкцій у README.md.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Відправлення...';

    const formData = new FormData(form);
    const params = new URLSearchParams(formData);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        throw new Error('Сервер повернув некоректну відповідь. Перевірте URL Web App.');
      }

      if (result.status === 'success') {
        showStatus('success', result.message || 'Дякуємо за реєстрацію! Ми зв’яжемося з вами найближчим часом.');
        form.reset();
      } else {
        let message = result.message || 'Сталася помилка під час відправлення.';
        if (result.errors && result.errors.length) {
          message += ' ' + result.errors.map(function(err) { return err.message; }).join(' ');
        }
        showStatus('error', message);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      showStatus('error', 'Не вдалося відправити форму: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Зареєструватися та отримати доступ до Zoom';
    }
  });

  // Clear error on input
  form.querySelectorAll('input, textarea').forEach(function(input) {
    input.addEventListener('input', function() {
      this.classList.remove('error');
      const errorEl = form.querySelector('.error-message[data-for="' + this.name + '"]');
      if (errorEl) errorEl.textContent = '';
    });
  });

  // ============================================================
  // Header shadow on scroll
  // ============================================================
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  }
})();
