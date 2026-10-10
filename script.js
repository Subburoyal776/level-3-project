
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");


navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("show");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});


document.querySelectorAll("#navLinks a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
  });
});


document.getElementById("currentYear").textContent = new Date().getFullYear();


const galleryButtons = [...document.querySelectorAll(".gallery-item")];
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxCount = document.getElementById("lightboxCount");
const closeButton = document.getElementById("lightboxClose");
const prevButton = document.getElementById("lightboxPrev");
const nextButton = document.getElementById("lightboxNext");
const slideshowButton = document.getElementById("slideshowBtn");
const slideStatus = document.getElementById("slideStatus");

let activeIndex = 0;
let slideshowTimer = null;
let previouslyFocused = null;

function showImage(index) {
  activeIndex = (index + galleryButtons.length) % galleryButtons.length;
  const card = galleryButtons[activeIndex];
  const image = card.querySelector("img");
  const label = card.querySelector(".image-overlay strong");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = label ? label.textContent.replace(" ↗", "") : image.alt;
  lightboxCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(galleryButtons.length).padStart(2, "0")}`;
}

function openLightbox(index) {
  previouslyFocused = document.activeElement;
  showImage(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (previouslyFocused) previouslyFocused.focus();
}

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => openLightbox(Number(button.dataset.index)));
});

closeButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", () => showImage(activeIndex - 1));
nextButton.addEventListener("click", () => showImage(activeIndex + 1));


lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});


document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(activeIndex - 1);
  if (event.key === "ArrowRight") showImage(activeIndex + 1);
});

function stopSlideshow() {
  if (slideshowTimer) clearInterval(slideshowTimer);
  slideshowTimer = null;
  slideshowButton.textContent = "▶ Start slideshow";
  slideStatus.textContent = "Slideshow paused";
}

function startSlideshow() {
  stopSlideshow();
  slideshowTimer = setInterval(() => {
    if (lightbox.classList.contains("open")) {
      showImage(activeIndex + 1);
    } else {
     
      openLightbox((activeIndex + 1) % galleryButtons.length);
    }
  }, 3000);
  slideshowButton.textContent = "Ⅱ Pause slideshow";
  slideStatus.textContent = "Changing every 3 seconds";
}

slideshowButton.addEventListener("click", () => {
  if (slideshowTimer) {
    stopSlideshow();
  } else {
    startSlideshow();
    if (!lightbox.classList.contains("open")) openLightbox(activeIndex);
  }
});


if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  stopSlideshow();
}
