// Next Flow AI - Interactive Logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Next Flow AI initialized');

    // Smooth Scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Reveal animations on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });

    // ── Infinite Loop Carousel ──────────────────────────────────────
    const carousel = document.querySelector('.testimonials-carousel');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');

    if (!carousel || !prevBtn || !nextBtn) return;

    // 1. Clone all original cards and append them (creates the illusion of infinity)
    const originalCards = Array.from(carousel.children);
    const CARD_WIDTH = 340;
    const CARD_GAP = 24;
    const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

    // Clone twice: one set before and one set after
    originalCards.forEach(card => {
        carousel.appendChild(card.cloneNode(true));
        carousel.insertBefore(card.cloneNode(true), carousel.firstChild);
    });

    const totalOriginal = originalCards.length;
    const cloneSetWidth = totalOriginal * SCROLL_STEP;

    // 2. Start scrolled to the "real" set (middle)
    carousel.scrollLeft = cloneSetWidth;

    // 3. Scroll step function
    function scrollCarousel(direction) {
        carousel.scrollBy({ left: direction * SCROLL_STEP, behavior: 'smooth' });
    }

    // 4. After each scroll, silently warp back to the middle clone
    let isWarping = false;
    carousel.addEventListener('scroll', () => {
        if (isWarping) return;

        const maxScroll = carousel.scrollWidth - carousel.clientWidth;

        // Warped to start clone → jump to real end
        if (carousel.scrollLeft <= 0) {
            isWarping = true;
            carousel.scrollLeft = cloneSetWidth;
            isWarping = false;
        }
        // Warped past real end → jump to real start
        else if (carousel.scrollLeft >= maxScroll - 2) {
            isWarping = true;
            carousel.scrollLeft = cloneSetWidth;
            isWarping = false;
        }
    });

    nextBtn.addEventListener('click', () => scrollCarousel(1));
    prevBtn.addEventListener('click', () => scrollCarousel(-1));

    // 5. Auto-advance every 4 seconds
    let autoplay = setInterval(() => scrollCarousel(1), 4000);

    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
    carousel.addEventListener('mouseleave', () => {
        autoplay = setInterval(() => scrollCarousel(1), 4000);
    });

    // ── Services Carousel ──────────────────────────────────────────
    const srvCarousel = document.querySelector('.services-carousel');
    const srvPrevBtn = document.querySelector('.srv-prev');
    const srvNextBtn = document.querySelector('.srv-next');

    if (srvCarousel && srvPrevBtn && srvNextBtn) {
        const scrollAmount = 430; // Card width + gap

        srvNextBtn.addEventListener('click', () => {
            srvCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        srvPrevBtn.addEventListener('click', () => {
            srvCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Optional: Auto-play services
        let srvAutoplay = setInterval(() => {
            if (srvCarousel.scrollLeft + srvCarousel.clientWidth >= srvCarousel.scrollWidth - 10) {
                srvCarousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                srvCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }, 5000);

        srvCarousel.addEventListener('mouseenter', () => clearInterval(srvAutoplay));
        srvCarousel.addEventListener('mouseleave', () => {
            srvAutoplay = setInterval(() => {
                if (srvCarousel.scrollLeft + srvCarousel.clientWidth >= srvCarousel.scrollWidth - 10) {
                    srvCarousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    srvCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }, 5000);
        });
    }

    // ── FAQ Accordion ─────────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all open items
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // If it wasn't open, open it now
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
