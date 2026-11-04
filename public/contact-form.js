(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("contact-status");
  var alertBox = document.getElementById("contact-alert");
  var submit = form.querySelector("[type=submit]");
  var mailto = "mailto:info@mukundatech.co.za?subject=Enquiry%20from%20mukundatech.co.za";

  function setSending(sending) {
    submit.disabled = sending;
    submit.textContent = sending ? "Sending…" : "Send message ";
    if (!sending) {
      var arr = document.createElement("span");
      arr.className = "arr";
      arr.setAttribute("aria-hidden", "true");
      submit.appendChild(arr);
    }
  }
  var emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  function fieldError(input, message) {
    input.setAttribute("aria-invalid", "true");
    var note = document.createElement("p");
    note.className = "contact-field-error";
    note.id = input.id + "-error";
    note.textContent = message;
    input.setAttribute("aria-describedby", note.id);
    input.insertAdjacentElement("afterend", note);
  }

  function clearErrors() {
    form.querySelectorAll(".contact-field-error").forEach(function (node) { node.remove(); });
    form.querySelectorAll("[aria-invalid]").forEach(function (node) {
      node.removeAttribute("aria-invalid");
      node.removeAttribute("aria-describedby");
    });
    status.hidden = true;
    status.textContent = "";
    alertBox.hidden = true;
    alertBox.textContent = "";
  }

  function showAlert(message) {
    alertBox.hidden = false;
    alertBox.textContent = message + " ";
    var link = document.createElement("a");
    link.href = mailto;
    link.textContent = "email info@mukundatech.co.za";
    alertBox.appendChild(link);
    alertBox.appendChild(document.createTextNode("."));
  }

  function validate() {
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var phone = form.phone.value.trim();
    var message = form.message.value.trim();
    var ok = true;

    if (!name || name.length > 100) {
      fieldError(form.name, "Enter your name.");
      ok = false;
    }
    if (!emailPattern.test(email) || email.length > 254) {
      fieldError(form.email, "Enter a valid email address.");
      ok = false;
    }
    if (phone && !/^[0-9+().\-\s]{7,30}$/.test(phone)) {
      fieldError(form.phone, "Enter a phone number using digits, or leave it blank.");
      ok = false;
    }
    if (!message || message.length > 5000) {
      fieldError(form.message, "Enter a message.");
      ok = false;
    }
    return ok;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();
    if (!validate()) return;

    setSending(true);

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        message: form.message.value.trim(),
        company_website: form.company_website.value
      })
    }).then(function (response) {
      return response.json().catch(function () { return { ok: false, error: "send" }; }).then(function (body) {
        return { ok: response.ok && body.ok, error: body.error, status: response.status };
      });
    }).then(function (result) {
      if (result.ok) {
        form.classList.add("is-sent");
        status.hidden = false;
        status.textContent = "Message sent. We’ll reply to the email you gave us.";
        form.reset();
        return;
      }
      if (result.status === 429 || result.error === "rate") {
        showAlert("Too many messages from this network. Please wait a little while, or");
        return;
      }
      showAlert("We couldn’t send that just now. You can still");
    }).catch(function () {
      showAlert("We couldn’t send that just now. You can still");
    }).then(function () {
      setSending(false);
    });
  });
})();
