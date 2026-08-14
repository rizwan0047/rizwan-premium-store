/* ============================================================
   RIZWAN — PREMIUM TECH STORE
   app.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ==========================================================
     DOM ELEMENTS
     ========================================================== */

  const body = document.body;
  const html = document.documentElement;

  const themeToggle = document.querySelector("#theme-toggle");
  const themeIcon = document.querySelector("#theme-icon");

  const menuToggle = document.querySelector("#menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");

  const searchInput = document.querySelector("#search-input");
  const productGrid = document.querySelector("#product-grid");
  const filterButtons = document.querySelectorAll("[data-filter]");

  const cartButton = document.querySelector("#cart-button");
  const cartCount = document.querySelector("#cart-count");
  const cartDrawer = document.querySelector("#cart-drawer");
  const cartOverlay = document.querySelector("#cart-overlay");
  const cartClose = document.querySelector("#cart-close");
  const cartItemsContainer = document.querySelector("#cart-items");
  const cartSubtotal = document.querySelector("#cart-subtotal");
  const cartCheckout = document.querySelector("#cart-checkout");

  const progressBar = document.querySelector("#scroll-progress");

  const newsletterForm = document.querySelector("#newsletter-form");
  const newsletterInput = document.querySelector("#newsletter-input");

  /* ==========================================================
     PRODUCT DATA
     ========================================================== */

  const products = [
    {
      id: 1,
      name: "Aether X1 Headphones",
      category: "audio",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
      description:
        "Adaptive noise cancelling, spatial audio and all-day comfort.",
      badge: "Best Seller"
    },

    {
      id: 2,
      name: "Titanium Chronos",
      category: "wearables",
      price: 429,
      image:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900",
      description:
        "A precision titanium smartwatch designed for modern performance.",
      badge: "New"
    },

    {
      id: 3,
      name: "Arc Ultra Laptop",
      category: "computing",
      price: 1499,
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900",
      description:
        "Ultra-thin performance with a stunning high-resolution display.",
      badge: "Editor's Pick"
    },

    {
      id: 4,
      name: "Nova Studio Camera",
      category: "creative",
      price: 899,
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900",
      description:
        "Professional image quality in a compact, beautifully engineered body.",
      badge: "Pro"
    },

    {
      id: 5,
      name: "Pulse Mechanical Keyboard",
      category: "computing",
      price: 179,
      image:
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900",
      description:
        "Precision mechanical switches with a refined aluminum chassis.",
      badge: "Popular"
    },

    {
      id: 6,
      name: "Halo Minimal Speaker",
      category: "audio",
      price: 249,
      image:
        "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=900",
      description:
        "Room-filling sound wrapped in a sculptural minimalist silhouette.",
      badge: "Featured"
    },

    {
      id: 7,
      name: "Orbit Smart Glasses",
      category: "wearables",
      price: 349,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900",
      description:
        "Connected eyewear built for information, communication and style.",
      badge: "New"
    },

    {
      id: 8,
      name: "Flux Creator Monitor",
      category: "creative",
      price: 699,
      image:
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900",
      description:
        "Color-accurate 4K visual workspace created for serious creators.",
      badge: "Creator"
    }
  ];

  /* ==========================================================
     APPLICATION STATE
     ========================================================== */

  let activeFilter = "all";
  let searchTerm = "";

  let cart = JSON.parse(localStorage.getItem("rizwan-cart")) || [];

  /* ==========================================================
     HELPERS
     ========================================================== */

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);
  }

  function saveCart() {
    localStorage.setItem("rizwan-cart", JSON.stringify(cart));
  }

  function getProduct(productId) {
    return products.find((product) => product.id === Number(productId));
  }

  function getCartQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  function getCartSubtotal() {
    return cart.reduce((total, item) => {
      const product = getProduct(item.id);

      if (!product) {
        return total;
      }

      return total + product.price * item.quantity;
    }, 0);
  }

  /* ==========================================================
     PRODUCT RENDERING
     ========================================================== */

  function renderProducts() {
    if (!productGrid) {
      return;
    }

    const filteredProducts = products.filter((product) => {
      const matchesCategory =
        activeFilter === "all" || product.category === activeFilter;

      const searchableText = `
        ${product.name}
        ${product.description}
        ${product.category}
      `.toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm);

      return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">⌕</div>
          <h3>No products found</h3>
          <p>Try another search term or choose a different collection.</p>
        </div>
      `;

      return;
    }

    productGrid.innerHTML = filteredProducts
      .map((product) => {
        return `
          <article class="product-card" data-product-id="${product.id}">
            
            <div class="product-card__image-wrap">
              ${
                product.badge
                  ? `<span class="product-card__badge">${product.badge}</span>`
                  : ""
              }

              <button
                class="wishlist-button"
                type="button"
                aria-label="Add ${product.name} to wishlist"
                data-wishlist="${product.id}"
              >
                ♡
              </button>

              <img
                class="product-card__image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
              />
            </div>

            <div class="product-card__content">
              <p class="product-card__category">
                ${product.category}
              </p>

              <h3 class="product-card__title">
                ${product.name}
              </h3>

              <p class="product-card__description">
                ${product.description}
              </p>

              <div class="product-card__bottom">
                <span class="product-card__price">
                  ${formatCurrency(product.price)}
                </span>

                <button
                  class="product-card__button"
                  type="button"
                  data-add-cart="${product.id}"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    attachProductEvents();
    revealElements();
  }

  function attachProductEvents() {
    const addButtons = document.querySelectorAll("[data-add-cart]");
    const wishlistButtons = document.querySelectorAll("[data-wishlist]");

    addButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number(button.dataset.addCart);

        addToCart(productId);

        button.classList.add("is-added");

        const originalText = button.textContent;
        button.textContent = "Added ✓";

        setTimeout(() => {
          button.classList.remove("is-added");
          button.textContent = originalText;
        }, 1200);
      });
    });

    wishlistButtons.forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.toggle("is-active");

        button.textContent = button.classList.contains("is-active")
          ? "♥"
          : "♡";
      });
    });
  }

  /* ==========================================================
     FILTERS
     ========================================================== */

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        item.classList.remove("is-active");
      });

      button.classList.add("is-active");

      activeFilter = button.dataset.filter;

      renderProducts();
    });
  });

  /* ==========================================================
     SEARCH
     ========================================================== */

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchTerm = event.target.value.trim().toLowerCase();

      renderProducts();
    });
  }

  /* ==========================================================
     CART
     ========================================================== */

  function addToCart(productId) {
    const existingItem = cart.find(
      (item) => item.id === Number(productId)
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: Number(productId),
        quantity: 1
      });
    }

      saveCart();
  renderCart();

  if (window.innerWidth > 768) {
    openCart();
  }

  animateCartButton();
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== Number(productId));

    saveCart();
    renderCart();
  }

  function updateCartQuantity(productId, change) {
    const item = cart.find(
      (cartItem) => cartItem.id === Number(productId)
    );

    if (!item) {
      return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    saveCart();
    renderCart();
  }

  function renderCart() {
    const totalQuantity = getCartQuantity();
    const subtotal = getCartSubtotal();

    if (cartCount) {
      cartCount.textContent = totalQuantity;
    }

    if (cartSubtotal) {
      cartSubtotal.textContent = formatCurrency(subtotal);
    }

    if (!cartItemsContainer) {
      return;
    }

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty__icon">✦</div>
          <h3>Your cart is empty</h3>
          <p>Add something exceptional.</p>
        </div>
      `;

      return;
    }

    cartItemsContainer.innerHTML = cart
      .map((item) => {
        const product = getProduct(item.id);

        if (!product) {
          return "";
        }

        const lineTotal = product.price * item.quantity;

        return `
          <div class="cart-item">
            <img
              class="cart-item__image"
              src="${product.image}"
              alt="${product.name}"
            />

            <div class="cart-item__content">
              <h4>${product.name}</h4>

              <span>
                ${formatCurrency(lineTotal)}
              </span>

              <div class="cart-item__controls">
                <button
                  type="button"
                  data-cart-minus="${product.id}"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>${item.quantity}</span>

                <button
                  type="button"
                  data-cart-plus="${product.id}"
                  aria-label="Increase quantity"
                >
                  +
                </button>

                <button
                  type="button"
                  class="cart-item__remove"
                  data-cart-remove="${product.id}"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    const minusButtons = document.querySelectorAll("[data-cart-minus]");
    const plusButtons = document.querySelectorAll("[data-cart-plus]");
    const removeButtons = document.querySelectorAll("[data-cart-remove]");

    minusButtons.forEach((button) => {
      button.addEventListener("click", () => {
        updateCartQuantity(button.dataset.cartMinus, -1);
      });
    });

    plusButtons.forEach((button) => {
      button.addEventListener("click", () => {
        updateCartQuantity(button.dataset.cartPlus, 1);
      });
    });

    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        removeFromCart(button.dataset.cartRemove);
      });
    });
  }

  /* ==========================================================
     CART DRAWER
     ========================================================== */

  function openCart() {
    if (!cartDrawer) {
      return;
    }

    cartDrawer.classList.add("is-open");

    if (cartOverlay) {
      cartOverlay.classList.add("is-visible");
    }

    body.classList.add("cart-open");
  }

  function closeCart() {
    if (!cartDrawer) {
      return;
    }

    cartDrawer.classList.remove("is-open");

    if (cartOverlay) {
      cartOverlay.classList.remove("is-visible");
    }

    body.classList.remove("cart-open");
  }

  if (cartButton) {
    cartButton.addEventListener("click", openCart);
  }

  if (cartClose) {
    cartClose.addEventListener("click", closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCart();
      closeMobileMenu();
    }
  });

  /* ==========================================================
     CART BUTTON ANIMATION
     ========================================================== */

  function animateCartButton() {
    if (!cartButton) {
      return;
    }

    cartButton.classList.remove("cart-pop");

    void cartButton.offsetWidth;

    cartButton.classList.add("cart-pop");

    setTimeout(() => {
      cartButton.classList.remove("cart-pop");
    }, 450);
  }

  /* ==========================================================
     THEME ENGINE
     ========================================================== */

  function getStoredTheme() {
    return localStorage.getItem("rizwan-theme");
  }

  function setTheme(theme) {
    html.setAttribute("data-theme", theme);

    localStorage.setItem("rizwan-theme", theme);

    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀" : "☾";
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      );
    }
  }

  const storedTheme = getStoredTheme();

  if (storedTheme) {
    setTheme(storedTheme);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    setTheme(prefersDark ? "dark" : "light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme =
        html.getAttribute("data-theme") || "light";

      const newTheme = currentTheme === "dark" ? "light" : "dark";

      setTheme(newTheme);
    });
  }

  /* ==========================================================
     MOBILE MENU
     ========================================================== */

  function openMobileMenu() {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.add("is-open");

    if (menuToggle) {
      menuToggle.classList.add("is-active");
      menuToggle.setAttribute("aria-expanded", "true");
    }

    body.classList.add("menu-open");
  }

  function closeMobileMenu() {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.remove("is-open");

    if (menuToggle) {
      menuToggle.classList.remove("is-active");
      menuToggle.setAttribute("aria-expanded", "false");
    }

    body.classList.remove("menu-open");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu?.classList.contains("is-open");

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  document.querySelectorAll("[data-mobile-link]").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  /* ==========================================================
     SCROLL PROGRESS
     ========================================================== */

  function updateScrollProgress() {
    if (!progressBar) {
      return;
    }

    const scrollTop = window.scrollY;

    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress =
      documentHeight > 0
        ? (scrollTop / documentHeight) * 100
        : 0;

    progressBar.style.width = `${progress}%`;
  }

  window.addEventListener("scroll", updateScrollProgress, {
    passive: true
  });

  updateScrollProgress();

  /* ==========================================================
     HEADER SCROLL STATE
     ========================================================== */

  const header = document.querySelector(".site-header");

  function updateHeader() {
    if (!header) {
      return;
    }

    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  updateHeader();

  /* ==========================================================
     SCROLL REVEAL
     ========================================================== */

  function revealElements() {
    const elements = document.querySelectorAll(
      "[data-reveal]:not(.is-visible)"
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");

          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  revealElements();

  /* ==========================================================
     PARALLAX EFFECT
     ========================================================== */

  const parallaxElements =
    document.querySelectorAll("[data-parallax]");

  if (parallaxElements.length > 0) {
    window.addEventListener(
      "scroll",
      () => {
        const scrollPosition = window.scrollY;

        parallaxElements.forEach((element) => {
          const speed =
            Number(element.dataset.parallax) || 0.08;

          element.style.transform =
            `translate3d(0, ${scrollPosition * speed}px, 0)`;
        });
      },
      {
        passive: true
      }
    );
  }

  /* ==========================================================
     NEWSLETTER
     ========================================================== */

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = newsletterInput?.value.trim();

      if (!email) {
        return;
      }

      if (!email.includes("@")) {
        newsletterInput?.classList.add("is-invalid");

        setTimeout(() => {
          newsletterInput?.classList.remove("is-invalid");
        }, 1200);

        return;
      }

      newsletterForm.innerHTML = `
        <div class="newsletter-success">
          <strong>You're in.</strong>
          <span>Welcome to the RIZWAN list.</span>
        </div>
      `;
    });
  }

  /* ==========================================================
     SMOOTH ANCHOR SCROLLING
     ========================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        const headerHeight = header
          ? header.offsetHeight
          : 0;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      });
    });

  /* ==========================================================
     CURSOR GLOW
     ========================================================== */

  const cursorGlow = document.querySelector("#cursor-glow");

  if (
    cursorGlow &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    window.addEventListener(
      "pointermove",
      (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
      },
      {
        passive: true
      }
    );
  }

  /* ==========================================================
     TILT EFFECT FOR PREMIUM CARDS
     ========================================================== */

  const tiltCards = document.querySelectorAll(
    "[data-tilt]"
  );

  if (
    tiltCards.length > 0 &&
    window.matchMedia("(pointer: fine)").matches
  ) {
    tiltCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();

        const x =
          event.clientX - rect.left;

        const y =
          event.clientY - rect.top;

        const centerX =
          rect.width / 2;

        const centerY =
          rect.height / 2;

        const rotateX =
          ((y - centerY) / centerY) * -3;

        const rotateY =
          ((x - centerX) / centerX) * 3;

        card.style.transform =
          `perspective(1000px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)
           translateY(-8px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ==========================================================
     YEAR
     ========================================================== */

  const currentYear = document.querySelector(
    "#current-year"
  );

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* ==========================================================
     INITIALIZE
     ========================================================== */

  renderProducts();
  renderCart();
});