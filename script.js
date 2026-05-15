const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.querySelector("#contactForm");
const formNote = document.querySelector("#formNote");
const revealItems = document.querySelectorAll(".reveal");
const parallaxTarget = document.querySelector("[data-parallax]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelector(".filter-button.active").classList.remove("active");
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("hidden", filter !== "alle" && !categories.includes(filter));
    });
  });
});

projectCards.forEach((card) => {
  const video = card.querySelector("video");
  if (!video) return;

  card.addEventListener("mouseenter", () => video.play());
  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const range = slider.querySelector("input");
  const after = slider.querySelector(".after-wrap");

  range.addEventListener("input", () => {
    after.style.width = `${range.value}%`;
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

window.addEventListener("mousemove", (event) => {
  if (!parallaxTarget || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 16;
  const y = (event.clientY / window.innerHeight - 0.5) * 16;
  parallaxTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const contact = formData.get("contact").trim();
  const service = formData.get("service").trim();
  const message = formData.get("message").trim();

  const subject = encodeURIComponent(`ALIDER Anfrage: ${service}`);
  const body = encodeURIComponent(
    `Name: ${name}\nKontakt: ${contact}\nLeistung: ${service}\n\nNachricht:\n${message}`
  );

  formNote.textContent = "Bereit. Ihr E-Mail-Programm wird mit der Anfrage geöffnet.";
  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
});
