// 平滑捲動 (針對 data-target)
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const offset = window.scrollY + rect.top - 70; // 預留 header 高度
  window.scrollTo({ top: offset, behavior: "smooth" });
}

// 綁定 data-target 點擊
document.querySelectorAll("[data-target]").forEach((el) => {
  el.addEventListener("click", (e) => {
    const target = el.getAttribute("data-target");
    if (target) {
      e.preventDefault();
      scrollToSection(target);
      // 手機版關閉 nav
      navLinks.classList.remove("open");
    }
  });
});

// Nav active 狀態 (簡單依捲動位置)
const sections = ["hero", "portfolio", "pricing", "about", "contact"];
const navLinksEls = document.querySelectorAll(".nav-link");

function onScroll() {
  const fromTop = window.scrollY + 120;
  let current = "hero";
  for (const id of sections) {
    const sec = document.getElementById(id);
    if (sec && sec.offsetTop <= fromTop) current = id;
  }
  navLinksEls.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("data-target") === current
    );
  });
}
window.addEventListener("scroll", onScroll);

// 手機版 nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

document.querySelectorAll(".portfolio-item").forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    const caption = item.getAttribute("data-caption") || img.alt || "";
    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add("open");
  });
});

lightboxClose.addEventListener("click", () => {
  lightbox.classList.remove("open");
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("open");
  }
});

// 表單送出示意
const form = document.getElementById("booking-form");
const formStatus = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formStatus.style.display = "inline";
  form.reset();
});
