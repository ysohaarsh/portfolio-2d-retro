const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menuList");
const navLinks = [...document.querySelectorAll(".menu a")];
const sections = [...document.querySelectorAll("section[id]")];
const form = document.getElementById("contactForm");
const statusText = document.getElementById("formStatus");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.querySelector(".theme-label");
const body = document.body;

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function applyTheme(theme) {
  body.setAttribute("data-theme", theme);

  if (!themeToggle) return;

  const isDark = theme === "dark";
  themeToggle.setAttribute("aria-checked", String(isDark));

  if (themeLabel) {
    themeLabel.textContent = isDark ? "Dark" : "Light";
  }
}

if (themeToggle) {
  const storedTheme = localStorage.getItem("portfolio-theme");
  const initialTheme = storedTheme === "dark" ? "dark" : "light";
  applyTheme(initialTheme);

  themeToggle.addEventListener("click", () => {
    const nextTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });
}

document.querySelectorAll(".reveal-item").forEach((item, index) => {
  item.style.setProperty("--delay", `${(index % 8) * 45}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal, .reveal-item").forEach((item) => {
  revealObserver.observe(item);
});

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      if (!id || !entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        const active = href === `#${id}` || (id === "hero" && href === "#top");
        link.classList.toggle("active", active);
      });
    });
  },
  { threshold: 0.52 }
);

sections.forEach((section) => spyObserver.observe(section));

if (form && statusText) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    statusText.textContent = `Thanks ${name || "there"}, your message is received. I will get back to you soon.`;
    form.reset();
  });
}
