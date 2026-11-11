/* ============================================================
   js/home.js — Homepage-specific JavaScript
   - Metrics counter animation
   - Philosophy S-curve SVG arrow
   - Subject category cards expand/collapse
   - 3D Testimonials carousel
   ============================================================ */

'use strict';

/* ---- Metrics counter animation (supports decimals + suffix) ---- */
function animateCounters() {
    document.querySelectorAll('.metric-number').forEach(counter => {
        if (counter.classList.contains('counted')) return;
        if (counter.getBoundingClientRect().top >= window.innerHeight - 80) return;

        const target = parseFloat(counter.getAttribute('data-target'));
        const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 1800;
        const start = performance.now();
        const fmt = v => v.toFixed(decimals) + suffix;

        counter.classList.add('counted');

        const tick = now => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart: fast climb, slow finish
            counter.textContent = fmt(target * eased);
            if (t < 1) requestAnimationFrame(tick);
            else {
                counter.textContent = fmt(target);
                counter.classList.add('landed');
            }
        };
        requestAnimationFrame(tick);
    });
}

/* ---- Philosophy S-curve SVG arrow ---- */
function initPhilosophyArrow() {
    const philosophyFlow = document.getElementById('philosophyFlow');
    const arrowPath = document.getElementById('philosophyArrowPath');
    const arrowHead = document.querySelector('.philosophy-arrow-head');

    if (!philosophyFlow || !arrowPath) return;

    function updateArrowPath() {
        const stages = philosophyFlow.querySelectorAll('.philosophy-stage');
        if (stages.length < 3) return;

        const circles = Array.from(stages).map(stage => {
            const circle = stage.querySelector('.stage-circle');
            if (!circle) return null;
            const rect = circle.getBoundingClientRect();
            const flowRect = philosophyFlow.getBoundingClientRect();
            return {
                x: rect.left - flowRect.left + rect.width / 2,
                y: rect.top - flowRect.top + rect.height / 2
            };
        }).filter(pos => pos !== null);

        if (circles.length < 3) return;

        const [p1, p2, p3] = circles;
        const cp1x = p1.x + (p2.x - p1.x) * 0.5;
        const cp1y = p1.y;
        const cp2x = p2.x - (p2.x - p1.x) * 0.3;
        const cp2y = p2.y;
        const cp3x = p2.x + (p3.x - p2.x) * 0.3;
        const cp3y = p2.y;
        const cp4x = p3.x - (p3.x - p2.x) * 0.5;
        const cp4y = p3.y;

        const pathData = `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y} C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${p3.x} ${p3.y}`;
        arrowPath.setAttribute('d', pathData);
        const pathLength = arrowPath.getTotalLength();
        arrowPath.style.strokeDasharray = pathLength;
    }

    function animateArrowOnScroll() {
        const philosophySection = document.getElementById('philosophy');
        if (!philosophySection) return;

        const rect = philosophySection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionHeight = rect.height;
        const startPoint = windowHeight * 0.8;
        const endPoint = windowHeight * 0.2;
        let progress = 0;

        if (window.innerWidth <= 768) {
            // Timeline mode: the line's tip tracks a point 60% down the screen
            const circles = philosophyFlow.querySelectorAll('.stage-circle');
            const first = circles[0].getBoundingClientRect();
            const last = circles[circles.length - 1].getBoundingClientRect();
            const y0 = first.top + first.height / 2;
            const y1 = last.top + last.height / 2;
            progress = Math.min(Math.max((windowHeight * 0.6 - y0) / (y1 - y0), 0), 1);
        } else if (rect.top < startPoint && rect.bottom > endPoint) {
            const scrollRange = sectionHeight + startPoint - endPoint;
            const scrolled = startPoint - rect.top;
            progress = Math.min(Math.max(scrolled / scrollRange, 0), 1);
        } else if (rect.bottom <= endPoint) {
            progress = 1;
        }

        const pathLength = arrowPath.getTotalLength();
        arrowPath.style.strokeDashoffset = pathLength * (1 - progress);

        if (arrowHead) {
            arrowHead.classList.toggle('visible', progress > 0.95);
        }
    }

    updateArrowPath();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateArrowPath();
            animateArrowOnScroll();
        }, 100);
    });

    // Stages slide in as they reveal and fonts can shift layout, so keep the path in sync while scrolling
    window.addEventListener('scroll', () => {
        updateArrowPath();
        animateArrowOnScroll();
    }, { passive: true });
    if ('ResizeObserver' in window) {
        new ResizeObserver(() => { updateArrowPath(); animateArrowOnScroll(); }).observe(philosophyFlow);
    }
    animateArrowOnScroll();
}

/* ---- Subject category expand / collapse ---- */
function toggleCategory() {
    event.stopPropagation();
    const card = event.currentTarget.closest('.subject-category-card');
    document.querySelectorAll('.subject-category-card').forEach(other => {
        if (other !== card) other.classList.remove('expanded');
    });
    card.classList.toggle('expanded');
}

/* ---- 3D Testimonials Carousel ---- */
(function () {
    const reviews = [
        {
            name: "Ganesha",
            subject: "Legal Studies",
            stars: 5,
            quote: "Ned's teachings have further enhanced my comprehension for legal studies, improving my ability to have better knowledge input and output."
        },
        {
            name: "Arjun",
            subject: "Math Ext 2",
            stars: 5,
            quote: "Tarun's been a great tutor he explained concepts very simply."
        },
        {
            name: "Elijah",
            subject: "Year 12 Physics",
            stars: 5,
            quote: "Ayush was super helpful and explained questions and concepts clearly and thoroughly."
        },
        {
            name: "Vedant",
            subject: "English Advanced",
            stars: 5,
            quote: "Ayush goes beyond basic teaching by ensuring I have a solid grasp of my English fundamentals, while also explaining more complex concepts in a clear and compelling way."
        },
        {
            name: "Abu",
            subject: "Physics",
            stars: 5,
            quote: "Currently I am able to learn a lot from our lessons. It's very beneficial. And Ayush's teaching style is easy to understand."
        },
        {
            name: "Leon",
            subject: "English Advanced",
            stars: 5,
            quote: "I really enjoy getting tutored by Ned. He makes English less confusing and complicated. English used to be my worst subject, now it's my favourite thanks to Ned."
        },
    ];

    function initTestimonialsCarousel() {
        const stage = document.getElementById('testimonialsStage');
        const dotsEl = document.getElementById('testimonialsDots');
        if (!stage || !dotsEl) return;

        const n = reviews.length;
        let current = 0;
        let autoTimer;

        function starHTML(count) {
            return Array(count).fill('<span>&#9733;</span>').join('');
        }

        function getPos(i) {
            const diff = (i - current + n) % n;
            if (diff === 0) return 'pos-center';
            if (diff === 1) return 'pos-right';
            if (diff === n - 1) return 'pos-left';
            return diff <= Math.floor(n / 2) ? 'pos-hidden-right' : 'pos-hidden-left';
        }

        const cards = reviews.map((r, i) => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
                <div class="testimonial-stars">${starHTML(r.stars)}</div>
                <span class="testimonial-quote-mark">&ldquo;</span>
                <p class="testimonial-quote">${r.quote}</p>
                <div class="testimonial-divider"></div>
                <div class="testimonial-meta">
                    <span class="testimonial-name">${r.name}</span>
                    <span class="testimonial-subject-tag">${r.subject}</span>
                </div>
            `;
            card.addEventListener('click', () => {
                const diff = (i - current + n) % n;
                if (diff === 1) goTo(current + 1);
                if (diff === n - 1) goTo(current - 1);
            });
            stage.appendChild(card);
            return card;
        });

        const dots = reviews.map((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'testimonials-dot';
            dot.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(dot);
            return dot;
        });

        function goTo(idx) {
            current = ((idx % n) + n) % n;
            cards.forEach((c, i) => { c.className = 'testimonial-card ' + getPos(i); });
            dots.forEach((d, i) => { d.className = 'testimonials-dot' + (i === current ? ' active' : ''); });
        }

        function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
        function stopAuto() { clearInterval(autoTimer); }

        const prevBtn = document.getElementById('testimonialsPrev');
        const nextBtn = document.getElementById('testimonialsNext');
        if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

        stage.addEventListener('mouseenter', stopAuto);
        stage.addEventListener('mouseleave', startAuto);

        // Swipe support for touch screens
        let touchX = null, touchY = null;
        stage.addEventListener('touchstart', e => {
            touchX = e.touches[0].clientX;
            touchY = e.touches[0].clientY;
            stopAuto();
        }, { passive: true });
        stage.addEventListener('touchend', e => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            const dy = e.changedTouches[0].clientY - touchY;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) goTo(current + (dx < 0 ? 1 : -1));
            touchX = null;
            startAuto();
        }, { passive: true });

        // On small screens cards are absolutely positioned, so size the stage to the tallest card
        function syncHeight() {
            if (window.innerWidth > 768) { stage.style.height = ''; return; }
            const tallest = Math.max(...cards.map(c => c.offsetHeight));
            stage.style.height = tallest + 'px';
        }
        window.addEventListener('resize', syncHeight);

        goTo(0);
        syncHeight();
        startAuto();
    }

    window.addEventListener('load', initTestimonialsCarousel);
})();

/* ---- Bind scroll listeners on load ---- */
window.addEventListener('scroll', () => {
    animateCounters();
});

window.addEventListener('load', () => {
    animateCounters();
    initPhilosophyArrow();
});
