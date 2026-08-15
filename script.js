/* =========================================================
   Gopiyapar Foundation Website Scripts (Full Updated)
========================================================= */

// 🕒 Live Clock Function (Date and Time Engine)
function tick() {
  const el = document.getElementById("clock");
  if (el) {
    el.textContent = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium"
    });
  }
}

// 🖼️ Gallery Lightbox — click any photo to view it larger, with next/prev
function setupLightbox() {
  const grid = document.getElementById("mainGallery");
  const lightbox = document.getElementById("lightbox");
  if (!grid || !lightbox) return;

  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  const images = Array.from(grid.querySelectorAll("img"));
  let currentIndex = 0;

  function openAt(index) {
    currentIndex = (index + images.length) % images.length;
    const img = images[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
  }

  images.forEach((img, index) => {
    img.addEventListener("click", () => openAt(index));
  });

  closeBtn?.addEventListener("click", close);
  prevBtn?.addEventListener("click", () => openAt(currentIndex - 1));
  nextBtn?.addEventListener("click", () => openAt(currentIndex + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") openAt(currentIndex - 1);
    if (e.key === "ArrowRight") openAt(currentIndex + 1);
  });
}

// 📱 Mobile Navigation Menu
function toggleNav() {
  const nav = document.querySelector("nav");
  const btn = document.querySelector(".menu");
  if (!nav) return;
  const open = nav.classList.toggle("open");
  if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
}

function closeNav() {
  const nav = document.querySelector("nav");
  const btn = document.querySelector(".menu");
  nav?.classList.remove("open");
  btn?.setAttribute("aria-expanded", "false");
}

// 📌 Active Page Highlight
function setActive() {
  const p = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(a => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === p);
  });
}

// 📩 Contact Form Handler
function setupContactForm() {
  const f = document.querySelector("#contactForm");
  if (!f) return;

  f.addEventListener("submit", e => {
    e.preventDefault();
    const msg = document.querySelector("#formMsg");
    if (msg) {
      msg.textContent = "Thank you. Your message has been recorded. / धन्यवाद।";
    }
    f.reset();
  });
}

/* =========================================================
   🔒 Content Protection
   - Blocks right-click / context menu
   - Blocks image dragging
   - Blocks copy / cut of page text
   - Blocks common "view source / inspect" shortcuts
   Note: this is a basic deterrent for casual copying only —
   it is not, and cannot be, a real security measure.
========================================================= */
let protectionToastTimer = null;

function showProtectionToast(message) {
  let toast = document.getElementById("protectionToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "protectionToast";
    toast.setAttribute("role", "status");
    toast.style.cssText = [
      "position:fixed", "left:50%", "bottom:24px", "transform:translateX(-50%)",
      "background:#111827", "color:#fff", "padding:10px 18px", "border-radius:999px",
      "font-size:13px", "font-weight:600", "z-index:99999", "box-shadow:0 8px 24px rgba(0,0,0,.25)",
      "opacity:0", "transition:opacity .2s ease", "pointer-events:none"
    ].join(";");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => { toast.style.opacity = "1"; });
  clearTimeout(protectionToastTimer);
  protectionToastTimer = setTimeout(() => { toast.style.opacity = "0"; }, 1800);
}

function setupContentProtection() {
  // Disable right-click / context menu
  document.addEventListener("contextmenu", e => {
    e.preventDefault();
    showProtectionToast("Right-click is disabled on this site / राइट-क्लिक अक्षम है");
  });

  // Disable dragging of images
  document.addEventListener("dragstart", e => {
    if (e.target && e.target.tagName === "IMG") {
      e.preventDefault();
    }
  });

  // Discourage copy / cut of page text (form fields are exempt)
  const isFormField = el => el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName || "");
  document.addEventListener("copy", e => {
    if (!isFormField(e.target)) {
      e.preventDefault();
      showProtectionToast("Copying content is disabled / सामग्री कॉपी करना अक्षम है");
    }
  });
  document.addEventListener("cut", e => {
    if (!isFormField(e.target)) e.preventDefault();
  });

  // Block common view-source / dev-tools keyboard shortcuts
  document.addEventListener("keydown", e => {
    const key = (e.key || "").toLowerCase();
    if (
      key === "f12" ||
      (e.ctrlKey && key === "u") ||
      (e.ctrlKey && e.shiftKey && (key === "i" || key === "j" || key === "c"))
    ) {
      e.preventDefault();
      showProtectionToast("This action is disabled / यह क्रिया अक्षम है");
    }
  });
}

// 🚀 Page Load Event Listener
document.addEventListener("DOMContentLoaded", () => {
  setupContentProtection();
  // Activate Menu and Gallery
  setActive();
  setupLightbox();
  
  // Start Clock Immediately & Update Every Second
  tick();
  setInterval(tick, 1000);

  // Mobile Menu Click Listeners
  document.querySelectorAll("nav a")
    .forEach(a => a.addEventListener("click", closeNav));

  // Close Navigation on ESC Key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeNav();
  });

  // Close Navigation on Outside Click
  document.addEventListener("click", e => {
    const nav = document.querySelector("nav");
    const btn = document.querySelector(".menu");

    if (nav?.classList.contains("open") &&
        !nav.contains(e.target) &&
        !btn?.contains(e.target)) {
      closeNav();
    }
  });

  // Setup Contact Form Submissions
  setupContactForm();
});