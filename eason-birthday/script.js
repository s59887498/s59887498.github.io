"use strict";

const invitationView = document.getElementById("invitation-view");
const acceptedView = document.getElementById("accepted-view");
const declinedView = document.getElementById("declined-view");
const heartRain = document.getElementById("heart-rain");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const heartColors = ["#1f1b18", "#1f1b18", "#b87b56", "#ccb69e"];
let heartInterval;
let celebrationTimeout;
let currentView = invitationView;

function stopHearts() {
  window.clearInterval(heartInterval);
  window.clearTimeout(celebrationTimeout);
  heartRain.replaceChildren();
}

function addHeart(initial = false) {
  if (reducedMotion.matches || document.hidden || heartRain.childElementCount >= 70) return;

  const heart = document.createElement("span");
  const duration = 5 + Math.random() * 4;
  const rotation = Math.random() * 70 - 35;
  heart.className = "floating-heart";
  heart.textContent = Math.random() > 0.3 ? "♥" : "♡";
  heart.style.setProperty("--x", `${Math.random() * 100}%`);
  heart.style.setProperty("--size", `${18 + Math.random() * 44}px`);
  heart.style.setProperty("--heart-color", heartColors[Math.floor(Math.random() * heartColors.length)]);
  heart.style.setProperty("--duration", `${duration}s`);
  // Start the first hearts at different heights so the whole screen celebrates immediately.
  heart.style.setProperty("--delay", initial ? `${-Math.random() * duration * 0.85}s` : "0s");
  heart.style.setProperty("--opacity", `${0.35 + Math.random() * 0.5}`);
  heart.style.setProperty("--sway", `${Math.random() * 100 - 50}px`);
  heart.style.setProperty("--drift", `${Math.random() * 140 - 70}px`);
  heart.style.setProperty("--rotation", `${rotation}deg`);
  heart.style.setProperty("--end-rotation", `${rotation * 2}deg`);
  heart.addEventListener("animationend", () => heart.remove(), { once: true });
  heartRain.append(heart);
}

function celebrate() {
  stopHearts();
  if (reducedMotion.matches || document.hidden) return;
  for (let i = 0; i < 42; i += 1) addHeart(true);
  heartInterval = window.setInterval(() => {
    addHeart();
    addHeart();
  }, 480);
  // Let the celebration settle after a while; the button can start it again.
  celebrationTimeout = window.setTimeout(() => window.clearInterval(heartInterval), 18000);
}

function showView(view, focusTarget) {
  stopHearts();
  for (const section of [invitationView, acceptedView, declinedView]) {
    section.hidden = section !== view;
  }
  currentView = view;
  window.scrollTo({ top: 0, behavior: "instant" });
  focusTarget.focus({ preventScroll: true });
}

document.getElementById("accept-button").addEventListener("click", () => {
  showView(acceptedView, document.getElementById("accepted-title"));
  celebrate();
});

document.getElementById("decline-button").addEventListener("click", () => {
  showView(declinedView, document.getElementById("declined-title"));
});

document.getElementById("more-hearts-button").addEventListener("click", celebrate);

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => {
    showView(invitationView, document.getElementById("reply-question"));
    document.getElementById("reply-question").scrollIntoView({ block: "center", behavior: "instant" });
  });
});

reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) stopHearts();
  else if (currentView === acceptedView) celebrate();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopHearts();
  else if (currentView === acceptedView) celebrate();
});
