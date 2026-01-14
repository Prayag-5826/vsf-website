// ===== Menu + Year =====
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const yearEl = document.getElementById("year");

if (yearEl) yearEl.textContent = new Date().getFullYear();

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    const expanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!expanded));
  });

  navMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => navMenu.classList.remove("open"));
  });
}

// ===== VSF Enquiry Handler (EMAIL ONLY + Success Message) =====
const MAIL_TO = "vsf.indore@outlook.com"; // UPDATED (.com)

function buildEnquiryMessage(data) {
  const lines = [
    "Website Enquiry - Vidhya Security Force & Housekeeping Services",
    "------------------------------------------------------------",
    `Name: ${data.name || "-"}`,
    `Phone: ${data.phone || "-"}`,
    `Email: ${data.email || "-"}`,
    `Service: ${data.service || "-"}`,
    `Requirement: ${data.message || "-"}`,
    "------------------------------------------------------------",
    "Office Address: 012 A Block, Treasure Town, Indore"
  ];
  return lines.join("\n");
}

async function sendEmailViaFormSubmit(message) {
  // Note: First submission may require activation/confirm in your inbox (FormSubmit behavior).
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(MAIL_TO)}`;

  const payload = {
    _subject: "Website Enquiry - VSF",
    _template: "table",
    message: message
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload)
  });

  return res.ok;
}

function showInlineSuccess(form) {
  const box = form.querySelector(".form-status");
  const msg = "Enquiry submitted. We will contact you soon.";

  if (box) {
    box.textContent = msg;
    box.style.display = "block";
  } else {
    alert(msg);
  }
}

function bindVSFForms() {
  const forms = document.querySelectorAll("form.vsf-form");
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fd = new FormData(form);
      const data = {
        name: (fd.get("name") || "").toString().trim(),
        phone: (fd.get("phone") || "").toString().trim(),
        email: (fd.get("email") || "").toString().trim(),
        service: (fd.get("service") || "").toString().trim(),
        message: (fd.get("message") || "").toString().trim()
      };

      // 1) Show only the requested success message (no WhatsApp open)
      showInlineSuccess(form);

      // 2) Send enquiry to email via FormSubmit (best effort)
      try {
        await sendEmailViaFormSubmit(buildEnquiryMessage(data));
      } catch (_) {
        // Do nothing extra; keep only the success message as requested
      }

      // 3) Reset fields
      form.reset();
    });
  });
}

document.addEventListener("DOMContentLoaded", bindVSFForms);
