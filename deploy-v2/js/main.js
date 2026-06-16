/* I-NEX landing — main.js */
(function () {
  "use strict";

  /* ---- Mobile menu ---- */
  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", false);
      });
    });
  }

  /* ---- Helpers ---- */
  function setErr(form, name, msg) {
    var e = form.querySelector('[data-for="' + name + '"]');
    if (e) e.textContent = msg || "";
  }
  function isEmail(v) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  }

  /* ---- Google Apps Script backend ---- */
  var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyf-OZ3tenynkF2iWdhSBHSldkLcICtO9gziwHa9-hJ8I0oWLXMXGUZusIseKvjqvac3g/exec';

  /* ---- Registration form (Google Sheets) ---- */
  var reg = document.getElementById("registrationForm");
  if (reg) {
    var rs = document.getElementById("formStatus");
    reg.addEventListener("submit", function (ev) {
      ev.preventDefault();

      var ok = true;
      ["fullName", "company", "position", "email", "phone"].forEach(function (k) {
        var v = (reg[k].value || "").trim();
        if (!v) { setErr(reg, k, "Заповніть це поле"); ok = false; }
        else setErr(reg, k, "");
      });

      var em = (reg.email.value || "").trim();
      if (em && !isEmail(em)) { setErr(reg, "email", "Невірний email"); ok = false; }

      if (!ok) {
        if (rs) { rs.className = "form-status err"; rs.textContent = "Перевірте підсвічені поля."; }
        return;
      }

      if (rs) { rs.className = "form-status"; rs.textContent = "Надсилаємо…"; }

      var formData = new FormData(reg);
      var params = new URLSearchParams(formData);

      fetch(SCRIPT_URL, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.success) {
          if (rs) { rs.className = "form-status ok"; rs.textContent = "Дякуємо! Ви зареєстровані. Ми зв'яжемося з вами найближчим часом."; }
          reg.reset();
        } else {
          throw new Error((data && data.message) || "Невідома помилка");
        }
      })
      .catch(function (err) {
        console.error('Form error:', err);
        if (rs) { rs.className = "form-status err"; rs.textContent = "Помилка надсилання. Спробуйте ще раз або напишіть нам."; }
      });
    });
  }

  /* ---- Cookie consent ---- */
  var banner = document.getElementById("cookieBanner");
  if (banner) {
    var KEY = "inex_cookie_ok";
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    if (!stored) {
      setTimeout(function () { banner.classList.add("show"); }, 600);
    }
    var accept = document.getElementById("cookieAccept");
    if (accept) accept.addEventListener("click", function () {
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      banner.classList.remove("show");
    });
  }
})();
