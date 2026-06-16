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

  /* ---- Registration form (Netlify Forms) ----
     Валідуємо на клієнті; якщо все ок — даємо формі відправитись на Netlify,
     який перенаправить на /thank-you.html. Бекенд не потрібен. */
  var reg = document.getElementById("registrationForm");
  if (reg) {
    var rs = document.getElementById("formStatus");
    reg.addEventListener("submit", function (ev) {
      var ok = true;
      ["fullName", "company", "position", "email", "phone"].forEach(function (k) {
        var v = (reg[k].value || "").trim();
        if (!v) { setErr(reg, k, "Заповніть це поле"); ok = false; }
        else setErr(reg, k, "");
      });
      var em = (reg.email.value || "").trim();
      if (em && !isEmail(em)) { setErr(reg, "email", "Невірний email"); ok = false; }
      if (!ok) {
        ev.preventDefault();
        if (rs) { rs.className = "form-status err"; rs.textContent = "Перевірте підсвічені поля."; }
        return;
      }
      // валідно → форма відправляється на Netlify (без preventDefault)
      if (rs) { rs.className = "form-status ok"; rs.textContent = "Надсилаємо…"; }
    });
  }

  /* ---- Login form (UI-заглушка) ----
     Реального входу нема: портал учасників відкриється з початком навчання.
     Для справжньої авторизації — Netlify Identity або власний бекенд. */
  var login = document.getElementById("loginForm");
  if (login) {
    var ls = document.getElementById("loginStatus");
    login.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var ok = true;
      var em = (login.loginEmail.value || "").trim();
      var pw = (login.loginPass.value || "").trim();
      if (!em) { setErr(login, "loginEmail", "Введіть email"); ok = false; }
      else if (!isEmail(em)) { setErr(login, "loginEmail", "Невірний email"); ok = false; }
      else setErr(login, "loginEmail", "");
      if (!pw) { setErr(login, "loginPass", "Введіть пароль"); ok = false; }
      else setErr(login, "loginPass", "");
      if (!ok) return;
      if (ls) {
        ls.className = "form-status ok";
        ls.textContent = "Портал учасників відкриється з початком навчання. Ми надішлемо вам доступ.";
      }
    });
    var forgot = document.getElementById("forgotLink");
    if (forgot) forgot.addEventListener("click", function (e) {
      e.preventDefault();
      if (ls) { ls.className = "form-status ok"; ls.textContent = "Напишіть Марії — відновимо доступ вручну: mariia.halai@gmail.com"; }
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
