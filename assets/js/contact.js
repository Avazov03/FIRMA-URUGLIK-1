/* Site forms (contact, article comment, service question).
   There is no mail endpoint yet, so a valid form opens the visitor's email app with the
   message filled in and offers copy / call as fallbacks. */
(function () {
  var EMAIL = "hello.lawlab@gmail.com";
  var PHONE = "+998921958008";

  var T = {
    uz: {
      errName: "Ismingizni kiriting",
      errContact: "Telefon yoki email kiriting",
      errPhone: "Telefon raqamini to‘liq kiriting",
      errEmail: "Email manzilini tekshiring",
      doneTitle: "Xabaringiz tayyor",
      doneText: "Email ilovangiz ochildi — xatni yuboring. Ochilmagan bo‘lsa, matnni nusxalab yoki qo‘ng‘iroq qilib bog‘laning.",
      sendEmail: "Email orqali yuborish",
      copy: "Matnni nusxalash",
      copied: "Nusxalandi",
      call: "Qo‘ng‘iroq qilish",
      subject: { contact: "Saytdan xabar", comment: "Maqolaga izoh", question: "Xizmat bo‘yicha savol" },
      name: "Ism",
      phone: "Telefon",
      email: "Email",
      topic: "Mavzu",
      message: "Xabar",
      page: "Sahifa",
    },
    ru: {
      errName: "Введите имя",
      errContact: "Укажите телефон или email",
      errPhone: "Введите номер телефона полностью",
      errEmail: "Проверьте адрес email",
      doneTitle: "Сообщение готово",
      doneText: "Открылось почтовое приложение — отправьте письмо. Если оно не открылось, скопируйте текст или позвоните нам.",
      sendEmail: "Отправить по email",
      copy: "Скопировать текст",
      copied: "Скопировано",
      call: "Позвонить",
      subject: { contact: "Сообщение с сайта", comment: "Комментарий к статье", question: "Вопрос по услуге" },
      name: "Имя",
      phone: "Телефон",
      email: "Email",
      topic: "Тема",
      message: "Сообщение",
      page: "Страница",
    },
    en: {
      errName: "Enter your name",
      errContact: "Enter a phone number or email",
      errPhone: "Enter a full phone number",
      errEmail: "Check the email address",
      doneTitle: "Your message is ready",
      doneText: "Your email app has opened — send the message. If it did not open, copy the text or call us.",
      sendEmail: "Send by email",
      copy: "Copy text",
      copied: "Copied",
      call: "Call us",
      subject: { contact: "Message from the website", comment: "Comment on an article", question: "Question about a service" },
      name: "Name",
      phone: "Phone",
      email: "Email",
      topic: "Topic",
      message: "Message",
      page: "Page",
    },
  };

  function lang() {
    return (window.AEG_I18N && window.AEG_I18N.lang) || "uz";
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function field(form, names) {
    for (var i = 0; i < names.length; i++) {
      var el = form.querySelector('[name="' + names[i] + '"]');
      if (el) return el;
    }
    return null;
  }

  function setError(el, text) {
    if (!el) return;
    var wrap = el.closest(".form-item") || el.parentElement;
    wrap.classList.toggle("aeg-invalid", !!text);
    var msg = wrap.querySelector(".aeg-form-err");
    if (text) {
      if (!msg) {
        msg = document.createElement("small");
        msg.className = "aeg-form-err";
        wrap.appendChild(msg);
      }
      msg.textContent = text;
      el.setAttribute("aria-invalid", "true");
    } else {
      if (msg) msg.remove();
      el.removeAttribute("aria-invalid");
    }
  }

  function copyText(btn, text, t) {
    var label = btn.querySelector("span");
    var done = function () {
      if (label) label.textContent = t.copied;
      setTimeout(function () {
        if (label) label.textContent = t.copy;
      }, 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
      return;
    }
    var ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(ta);
    done();
  }

  function handle(form, event) {
    event.preventDefault();
    var t = T[lang()] || T.uz;
    var kind = form.getAttribute("data-aeg-form") || "contact";
    var nameEl = field(form, ["fullname", "name"]);
    var phoneEl = field(form, ["phone", "Phone"]);
    var emailEl = field(form, ["email"]);
    var topicEl = field(form, ["topic"]);
    var msgEl = field(form, ["message"]);

    var name = nameEl ? nameEl.value.trim() : "";
    var phone = phoneEl ? phoneEl.value.trim() : "";
    var email = emailEl ? emailEl.value.trim() : "";
    var ok = true;

    setError(nameEl, name.length >= 2 ? "" : t.errName);
    if (name.length < 2) ok = false;

    var phoneDigits = phone.replace(/\D/g, "").length;
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    setError(phoneEl, "");
    setError(emailEl, "");
    if (!phone && !email) {
      setError(phoneEl || emailEl, t.errContact);
      ok = false;
    } else {
      if (phone && phoneDigits < 9) {
        setError(phoneEl, t.errPhone);
        ok = false;
      }
      if (email && !emailOk) {
        setError(emailEl, t.errEmail);
        ok = false;
      }
    }

    if (!ok) {
      var first = form.querySelector("[aria-invalid='true']");
      if (first) first.focus();
      return;
    }

    var topic = "";
    if (topicEl) topic = topicEl.tagName === "SELECT" ? (topicEl.value ? topicEl.options[topicEl.selectedIndex].text : "") : topicEl.value.trim();

    var lines = [];
    lines.push(t.name + ": " + name);
    if (phone) lines.push(t.phone + ": " + phone);
    if (email) lines.push(t.email + ": " + email);
    if (topic) lines.push(t.topic + ": " + topic);
    if (msgEl && msgEl.value.trim()) lines.push("", t.message + ":", msgEl.value.trim());
    lines.push("", t.page + ": " + document.title + " — " + window.location.href.split("#")[0]);
    var text = lines.join("\n");
    var href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(t.subject[kind] || t.subject.contact) + "&body=" + encodeURIComponent(text);

    var box = form.parentElement.querySelector(".aeg-form-done");
    if (!box) {
      box = document.createElement("div");
      box.className = "aeg-form-done";
      box.setAttribute("role", "status");
      form.insertAdjacentElement("afterend", box);
    }
    box.innerHTML =
      '<div class="aeg-form-done-head"><span class="aeg-form-done-ic"><i class="fa-solid fa-check"></i></span><strong>' + esc(t.doneTitle) + "</strong></div>" +
      "<p>" + esc(t.doneText) + "</p>" +
      '<div class="aeg-form-done-actions">' +
      '<a class="aeg-btn" href="' + esc(href) + '"><i class="fa-regular fa-envelope"></i> ' + esc(t.sendEmail) + "</a>" +
      '<button type="button" class="aeg-btn aeg-btn-ghost" data-copy><i class="fa-regular fa-copy"></i> <span>' + esc(t.copy) + "</span></button>" +
      '<a class="aeg-btn aeg-btn-ghost" href="tel:' + PHONE + '"><i class="fa-solid fa-phone"></i> ' + esc(t.call) + "</a>" +
      "</div>";
    box.querySelector("[data-copy]").addEventListener("click", function () {
      copyText(this, text, t);
    });

    window.location.href = href;
    try {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    } catch (e) {}
  }

  function bind() {
    var forms = document.querySelectorAll("form[data-aeg-form]");
    Array.prototype.forEach.call(forms, function (form) {
      form.setAttribute("novalidate", "");
      form.addEventListener("submit", function (e) {
        handle(form, e);
      });
      form.addEventListener("input", function (e) {
        if (e.target.getAttribute("aria-invalid") === "true") setError(e.target, "");
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
