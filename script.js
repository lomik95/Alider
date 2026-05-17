const contactForm = document.querySelector("#contactForm");
const formNote = document.querySelector("#formNote");
const revealItems = document.querySelectorAll(".reveal");
const parallaxTarget = document.querySelector("[data-parallax]");
const projectCards = document.querySelectorAll(".project-card");
const modalLinks = document.querySelectorAll("[data-modal]");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");

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

projectCards.forEach((card) => {
  const video = card.querySelector("video");
  if (!video) return;

  card.addEventListener("mouseenter", () => video.play());
  card.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0;
  });
});

window.addEventListener("mousemove", (event) => {
  if (!parallaxTarget || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 12;
  const y = (event.clientY / window.innerHeight - 0.5) * 12;
  parallaxTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});

const openModal = (id) => {
  const modal = document.querySelector(`#${id}`);
  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  document.querySelectorAll(".modal.open").forEach((modal) => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  });
  document.body.style.overflow = "";
};

modalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(link.dataset.modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const formData = new FormData(contactForm);

    submitButton.disabled = true;
    submitButton.textContent = "Wird gesendet...";
    formNote.className = "form-note";
    formNote.textContent = "Ihre Anfrage wird gesendet.";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Form request failed");
      }

      contactForm.reset();
      formNote.className = "form-note success";
      formNote.textContent = "Danke. Ihre Anfrage wurde gesendet. Ich melde mich so schnell wie möglich.";
    } catch (error) {
      formNote.className = "form-note error";
      formNote.textContent = "Leider konnte die Anfrage nicht gesendet werden. Bitte kontaktieren Sie mich direkt per E-Mail oder WhatsApp.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Jetzt unverbindlich anfragen";
    }
  });
}
