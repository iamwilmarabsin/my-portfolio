/**
 * ============================================================================
 * WILMAR PORTFOLIO - MAIN JAVASCRIPT MODULE
 * Senior Front-End Architecture Standard
 * ============================================================================
 */

// ========================================
// Navigation
// ========================================

/**
 * Sticky Navbar Scroll State Handler
 * Transitions navbar background and typography when scrolling past Hero section threshold.
 */
const navbar = document.getElementById("navbar");
const heroSection = document.getElementById("hero");

function updateNavState() {
    if (!navbar) return;
    const heroTrustBar = document.querySelector(".hero-trust-bar");
    let scrollThreshold = 50;
    if (heroTrustBar) {
        scrollThreshold = heroTrustBar.offsetTop - 68;
    } else if (heroSection) {
        scrollThreshold = heroSection.offsetHeight * 0.4;
    }
    navbar.classList.toggle("scrolled", window.scrollY >= scrollThreshold);
}

window.addEventListener("scroll", updateNavState, { passive: true });
window.addEventListener("resize", updateNavState, { passive: true });

/**
 * Mobile Navigation Drawer & Accessibility Trap
 */
const navToggleBtn = document.getElementById("nav-toggle-btn");
const navBackdrop = document.getElementById("nav-backdrop");
const mobileMenu = document.getElementById("mobile-menu");
let removeNavFocusTrap = null;

function closeMobileMenu() {
    if (!navbar) return;
    navbar.classList.remove("nav-menu-open");
    if (navToggleBtn) {
        navToggleBtn.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
    if (removeNavFocusTrap) {
        removeNavFocusTrap();
        removeNavFocusTrap = null;
    }
}

if (navToggleBtn) {
    navToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = navbar.classList.toggle("nav-menu-open");
        navToggleBtn.setAttribute("aria-expanded", String(isOpen));
        document.body.style.overflow = isOpen ? "hidden" : "";

        if (isOpen && mobileMenu) {
            removeNavFocusTrap = trapFocus(mobileMenu);
        } else if (removeNavFocusTrap) {
            removeNavFocusTrap();
            removeNavFocusTrap = null;
        }
    });
}

if (navBackdrop) {
    navBackdrop.addEventListener("click", closeMobileMenu);
}

// Close mobile menu on Escape key press
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navbar && navbar.classList.contains("nav-menu-open")) {
        closeMobileMenu();
    }
});

// Close mobile menu when clicking outside drawer
document.addEventListener("click", (e) => {
    if (navbar && navbar.classList.contains("nav-menu-open")) {
        if (mobileMenu && !mobileMenu.contains(e.target) && navToggleBtn && !navToggleBtn.contains(e.target)) {
            closeMobileMenu();
        }
    }
});

/**
 * Active Navigation Link Highlight Observer
 * Updates active navigation link state based on current viewport section.
 */
const sections = document.querySelectorAll("section[id]");
const headerNavLinks = document.querySelectorAll(".nav-links a");

if (sections.length > 0 && headerNavLinks.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                headerNavLinks.forEach((link) => {
                    link.style.color = "";
                    if (link.getAttribute("href") === "#" + id) {
                        link.style.color = "var(--white)";
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach((section) => sectionObserver.observe(section));
}


// ========================================
// Hero
// ========================================

/**
 * Hero Section Load & Restoration Controller
 * Ensures clean viewport restoration to top on page refresh.
 */
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);


// ========================================
// Scroll Effects
// ========================================

/**
 * Smooth Scroll Anchor Link Handler
 * Handles offset scrolling for fixed headers when clicking internal anchor links.
 */
const navLinks = document.querySelectorAll(".nav-links a, .footer-links-col a, .btn-secondary-link");
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");

        // Close mobile menu if open
        if (navbar && navbar.classList.contains("nav-menu-open")) {
            closeMobileMenu();
        }

        if (href && href.startsWith("#")) {
            const targetId = href.substring(1);
            const targetEl = document.getElementById(targetId);

            if (targetEl) {
                e.preventDefault();
                requestAnimationFrame(() => {
                    const navHeight = 72;
                    const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: Math.max(0, targetTop),
                        behavior: "smooth"
                    });
                });
            }
        }
    });
});


// ========================================
// Animations
// ========================================

/**
 * Scroll Reveal Animation Controller
 * Triggers entrance transitions for elements with .reveal class as they enter the viewport.
 */
const revealEls = document.querySelectorAll(".reveal");

function triggerReveal() {
    revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100 && rect.bottom > 0) {
            el.classList.add("visible");
        }
    });
}

function revealNow() {
    const els = document.querySelectorAll('.reveal');
    for (let i = 0; i < els.length; i++) {
        els[i].classList.add('visible');
        els[i].style.opacity = '1';
        els[i].style.transform = 'none';
    }
}

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px 50px 0px"
    });

    revealEls.forEach((el) => revealObserver.observe(el));
} else {
    revealEls.forEach((el) => el.classList.add("visible"));
}


// ========================================
// Counters
// ========================================

/**
 * Stat Counter Animation Helpers
 * Available for future animated metric counters.
 */
function animateCounter(element, start, end, duration) {
    if (!element) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerText = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}


// ========================================
// Testimonials Slider
// ========================================

/**
 * Testimonials Infinite Carousel Engine
 * Supports touch swipe events, responsive centered positioning, and automatic looping.
 */
const sliderTrack = document.querySelector(".testimonials-track");
const sliderSlides = Array.from(document.querySelectorAll(".testimonial-slide"));
const prevBtn = document.getElementById("testimonial-prev");
const nextBtn = document.getElementById("testimonial-next");

let sliderIndex = 1; // Start on first actual slide (after cloned slide)
let autoplayTimer = null;
let isMoving = false;

function updateSliderPosition(animate = true) {
    if (!sliderTrack || sliderSlides.length === 0) return;

    if (animate) {
        isMoving = true;
        sliderTrack.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)";
    } else {
        sliderTrack.style.transition = "none";
        isMoving = false;
    }

    const activeSlide = sliderSlides[sliderIndex];
    if (!activeSlide) return;

    const slideWidth = activeSlide.offsetWidth;
    const slideLeft = activeSlide.offsetLeft;
    const viewportWidth = sliderTrack.parentElement ? sliderTrack.parentElement.offsetWidth : window.innerWidth;

    // Center alignment math: viewport center - slide center relative to track
    const translateOffset = (viewportWidth / 2) - slideLeft - (slideWidth / 2);
    sliderTrack.style.transform = `translateX(${translateOffset}px)`;

    // Update active states
    sliderSlides.forEach((slide, idx) => {
        if (idx === sliderIndex) {
            slide.classList.add("active");
        } else {
            slide.classList.remove("active");
        }
    });
}

function handleTransitionEnd(e) {
    if (e && e.target !== sliderTrack) return;
    isMoving = false;
    // Jump seamlessly if cloned slide is reached
    if (sliderIndex === sliderSlides.length - 1) {
        sliderIndex = 1;
        updateSliderPosition(false);
    } else if (sliderIndex === 0) {
        sliderIndex = sliderSlides.length - 2;
        updateSliderPosition(false);
    }
}

function nextSlide() {
    if (isMoving) return;
    if (sliderIndex >= sliderSlides.length - 1) {
        sliderIndex = 1;
        updateSliderPosition(false);
    }
    sliderIndex++;
    updateSliderPosition(true);
}

function prevSlide() {
    if (isMoving) return;
    if (sliderIndex <= 0) {
        sliderIndex = sliderSlides.length - 2;
        updateSliderPosition(false);
    }
    sliderIndex--;
    updateSliderPosition(true);
}

function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
    if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
}

// Carousel Event Listeners
if (sliderTrack) {
    sliderTrack.addEventListener("transitionend", handleTransitionEnd);

    // Touch swipe support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    const viewport = sliderTrack.parentElement;

    if (viewport) {
        viewport.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        viewport.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diffX = touchEndX - touchStartX;
            if (Math.abs(diffX) > 40) {
                if (diffX < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoplay();
        }, { passive: true });
    }
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        prevSlide();
        startAutoplay();
    });
}

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoplay();
    });
}

window.addEventListener("resize", () => {
    updateSliderPosition(false);
});


// ========================================
// FAQ
// ========================================

/**
 * Work Experience Accordion Expansion Logic
 */
function initExperienceAccordion() {
    const accordion = document.getElementById('expAccordion');
    if (!accordion) return;

    const items = Array.from(accordion.querySelectorAll('.exp-item'));

    function openItem(item) {
        item.classList.add('is-open');
        const header = item.querySelector('.exp-header');
        if (header) header.setAttribute('aria-expanded', 'true');
    }

    function closeItem(item) {
        item.classList.remove('is-open');
        const header = item.querySelector('.exp-header');
        if (header) header.setAttribute('aria-expanded', 'false');
    }

    items.forEach((item) => {
        const header = item.querySelector('.exp-header');
        if (header) {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = item.classList.contains('is-open');
                items.forEach(closeItem);
                if (!isOpen) openItem(item);
            });
        }
    });
}


// ========================================
// Forms
// ========================================

/**
 * Shared Form Submission Handler
 */
function submitContactForm(form, onSuccess, onError) {
    const submitBtn = form.querySelector(".form-submit-btn");
    if (!submitBtn) return;

    const originalText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending…";

    const formData = new FormData(form);

    fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
        .then(response => {
            if (response.ok) {
                form.reset();
                onSuccess();
            } else {
                onError();
            }
        })
        .catch(() => onError())
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        });
}

/**
 * Footer Contact Form Setup
 */
const contactForm = document.getElementById("portfolio-contact-form");
if (contactForm) {
    const footerBanner = document.createElement("div");
    footerBanner.className = "form-success-banner";
    footerBanner.setAttribute("role", "alert");
    footerBanner.innerHTML = `
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Message sent! I'll get back to you within one business day.</span>
    `;
    const submitBtn = contactForm.querySelector(".form-submit-btn");
    if (submitBtn) {
        contactForm.insertBefore(footerBanner, submitBtn);
    }

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();
        footerBanner.classList.remove("visible");
        submitContactForm(
            contactForm,
            () => { footerBanner.classList.add("visible"); },
            () => { alert("Oops! There was a problem submitting your form. Please try again."); }
        );
    });
}

/**
 * Pricing CTA Modal Popup Dialog
 */
const pricingModal = document.getElementById("pricing-modal");
const modalContainer = pricingModal ? pricingModal.querySelector(".modal-container") : null;
const modalCloseBtn = pricingModal ? pricingModal.querySelector(".modal-close-btn") : null;
const modalForm = document.getElementById("modal-contact-form");
const modalHiringSelect = document.getElementById("modal-hiring-type");
const modalHiringBadge = pricingModal ? pricingModal.querySelector(".modal-hiring-badge") : null;

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openModal(hiringType) {
    if (!pricingModal) return;

    if (modalHiringSelect && hiringType) {
        modalHiringSelect.value = hiringType;
    }

    if (modalHiringBadge && hiringType) {
        modalHiringBadge.textContent = hiringType;
    }

    const modalSuccess = pricingModal.querySelector(".modal-success");
    const modalFormWrap = pricingModal.querySelector(".modal-form-body");
    if (modalSuccess) modalSuccess.classList.remove("visible");
    if (modalFormWrap) modalFormWrap.style.display = "";

    pricingModal.classList.add("active");
    pricingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    if (modalContainer) {
        setTimeout(() => {
            const firstFocusable = modalContainer.querySelectorAll(FOCUSABLE)[0];
            if (firstFocusable) firstFocusable.focus();
        }, 50);
    }
}

function closeModal() {
    if (!pricingModal) return;
    pricingModal.classList.remove("active");
    pricingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

// Open modal from pricing triggers
document.querySelectorAll("[data-hiring-trigger]").forEach(btn => {
    btn.addEventListener("click", function () {
        openModal(this.getAttribute("data-hiring-trigger"));
    });
});

if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
}

if (pricingModal) {
    pricingModal.addEventListener("click", function (e) {
        if (e.target === pricingModal) closeModal();
    });
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && pricingModal && pricingModal.classList.contains("active")) {
        closeModal();
    }
});

const modalSuccessClose = pricingModal ? pricingModal.querySelector(".modal-success-close") : null;
if (modalSuccessClose) {
    modalSuccessClose.addEventListener("click", closeModal);
}

if (modalContainer) {
    modalContainer.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") return;
        const focusable = Array.from(modalContainer.querySelectorAll(FOCUSABLE));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
}

if (modalForm) {
    modalForm.addEventListener("submit", function (e) {
        e.preventDefault();
        submitContactForm(
            modalForm,
            () => {
                const modalFormBody = pricingModal.querySelector(".modal-form-body");
                const successPanel = pricingModal.querySelector(".modal-success");
                if (modalFormBody) modalFormBody.style.display = "none";
                if (successPanel) successPanel.classList.add("visible");
            },
            () => { alert("Oops! There was a problem submitting your form. Please try again."); }
        );
    });
}


// ========================================
// Utilities
// ========================================

/**
 * Focus Trap Utility for Accessibility
 */
function trapFocus(container) {
    const focusables = container.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (!focusables.length) return () => { };
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    function handleKey(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    }

    container.addEventListener('keydown', handleKey);
    return () => container.removeEventListener('keydown', handleKey);
}


// ========================================
// Initialization
// ========================================

/**
 * Main Application Initializer
 */
function initApp() {
    updateNavState();
    triggerReveal();
    initExperienceAccordion();

    requestAnimationFrame(() => {
        updateSliderPosition(false);
    });
    startAutoplay();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        revealNow();
        initApp();
    });
} else {
    revealNow();
    initApp();
}

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    triggerReveal();
    updateSliderPosition(false);
});
