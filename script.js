const products = [
  { name: "BizOps AI", category: "business", status: "In development", mark: "B", description: "Business management and accounting software for financial operations, inventory, sales and workflows.", tag: "Business intelligence" },
  { name: "Caterflow", category: "business", status: "Commercial rollout", mark: "C", description: "A white-label catering platform for menus, orders, quotes and customer management.", tag: "Hospitality operations" },
  { name: "FIKA Taxi App", category: "community", status: "In development", mark: "F", description: "Route-planning and commuter safety intelligence for South African taxi travel.", tag: "Mobility & safety" },
  { name: "Municore", category: "infrastructure", status: "Prototype", mark: "M", description: "A municipal technology platform for meter validation, field operations and readings.", tag: "Public services" },
  { name: "MyRoots", category: "community", status: "Prototype", mark: "R", description: "A digital space for families to preserve ancestry, traditions and shared histories.", tag: "Heritage & identity" },
  { name: "KasiPay", category: "community", status: "Prototype", mark: "K", description: "A digital payments concept focused on township commerce and vendor transactions.", tag: "Commerce & inclusion" },
  { name: "Khonza", category: "community", status: "Planning", mark: "H", description: "A white-label church application concept for building and managing a digital community platform.", tag: "Faith & community" },
  { name: "OneProfile", category: "business", status: "Status to be confirmed", mark: "O", description: "A digital identity and onboarding concept designed to reduce account-opening friction.", tag: "Digital identity" },
  { name: "Mukunda Launchpad", category: "business", status: "Service offering", mark: "L", description: "Digital services and tools that help SMEs establish and grow their online presence.", tag: "SME growth" },
  { name: "Utility / Utilify", category: "infrastructure", status: "Prototype", mark: "U", description: "A utility management product concept for more organised operational data.", tag: "Infrastructure" },
  { name: "Integrations & automation", category: "business", status: "Capability", mark: "↗", description: "Connected systems and workflow automation that help business tools work better together.", tag: "Connected operations" }
];

const productGrid = document.querySelector("[data-product-grid]");
const filterButtons = document.querySelectorAll("[data-filter]");

function renderProducts(filter = "all") {
  if (!productGrid) return;
  productGrid.innerHTML = products
    .filter((product) => filter === "all" || product.category === filter)
    .map((product) => `
      <article class="product-card reveal is-visible">
        <div class="product-top"><span class="product-mark">${product.mark}</span><span class="status">${product.status}</span></div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <span class="product-tag">${product.tag}</span>
        <button class="product-open" type="button" data-product="${product.name}">View overview <span aria-hidden="true">↗</span></button>
      </article>
    `).join("");
}

renderProducts();

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderProducts(button.dataset.filter);
  });
});

const productModal = document.querySelector("[data-product-modal]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalMark = document.querySelector("[data-modal-mark]");
const modalStatus = document.querySelector("[data-modal-status]");
const modalDescription = document.querySelector("[data-modal-description]");
const modalTag = document.querySelector("[data-modal-tag]");
const modalCategory = document.querySelector("[data-modal-category]");
let lastFocusedProduct = null;
if (productModal) productModal.inert = true;

function openProductModal(product) {
  if (!productModal || !product) return;
  lastFocusedProduct = document.activeElement;
  modalTitle.textContent = product.name;
  modalMark.textContent = product.mark;
  modalStatus.textContent = product.status;
  modalDescription.textContent = product.description;
  modalTag.textContent = product.tag;
  modalCategory.textContent = product.category;
  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  productModal.inert = false;
  document.body.classList.add("menu-open");
  productModal.querySelector(".modal-close").focus();
}

function closeProductModal() {
  if (!productModal) return;
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  productModal.inert = true;
  document.body.classList.remove("menu-open");
  lastFocusedProduct?.focus();
}

productGrid?.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-product]");
  if (!trigger) return;
  openProductModal(products.find((product) => product.name === trigger.dataset.product));
});

productModal?.querySelectorAll("[data-modal-close]").forEach((element) => element.addEventListener("click", closeProductModal));
productModal?.querySelector("[data-modal-contact]")?.addEventListener("click", closeProductModal);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && productModal?.classList.contains("is-open")) closeProductModal();
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const navLinks = document.querySelectorAll(".primary-nav a");

menuToggle?.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const enquiry = String(formData.get("enquiry") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !enquiry || !message || !email.includes("@")) {
    formStatus.textContent = "Please complete the required fields with a valid email address.";
    formStatus.classList.add("error");
    return;
  }

  const company = String(formData.get("company") || "").trim();
  const subject = encodeURIComponent(`${enquiry} — enquiry from ${name}`);
  const body = encodeURIComponent([
    `Name: ${name}`,
    `Company: ${company || "Not provided"}`,
    `Email: ${email}`,
    `Enquiry: ${enquiry}`,
    "",
    message
  ].join("\n"));
  formStatus.classList.remove("error");
  formStatus.textContent = "Opening your email app with the prepared enquiry…";
  window.location.href = `mailto:info@mukundatech.co.za?subject=${subject}&body=${body}`;
});

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();