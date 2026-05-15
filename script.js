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

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector("button[type='submit']");
  const formData = new FormData(contactForm);

  submitButton.disabled = true;
  submitButton.textContent = "Wird gesendet...";
  formNote.textContent = "Ihre Anfrage wird gesendet.";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Formspree request failed");
    }

    contactForm.reset();
    formNote.textContent = "Danke. Ihre Anfrage wurde gesendet. Ich melde mich so schnell wie möglich.";
  } catch (error) {
    formNote.textContent = "Leider konnte die Anfrage nicht gesendet werden. Bitte kontaktieren Sie mich direkt per E-Mail oder WhatsApp.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Anfrage senden";
  }
});
