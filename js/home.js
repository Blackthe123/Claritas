/* ============================================================
   js/home.js — Homepage-specific JavaScript
   - Metrics counter animation
   - Philosophy S-curve SVG arrow
   - Subject category cards expand/collapse
   - 3D Testimonials carousel
   ============================================================ */

'use strict';

/* ---- Metrics counter animation ---- */
function animateCounters() {
    document.querySelectorAll('.metric-number').forEach(counter => {
        if (counter.classList.contains('counted')) return;
        if (counter.getBoundingClientRect().top >= window.innerHeight - 150) return;

        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        counter.classList.add('counted');

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
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

        if (rect.top < startPoint && rect.bottom > endPoint) {
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

    window.addEventListener('scroll', animateArrowOnScroll);
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
            name: "Leon",
            subject: "Physics, Math Advanced",
            stars: 5,
            quote: "I enjoy learning math and physics with Ayush as he gives an in-depth explanation backed up with real world examples. This makes tutoring with Ayush extremely helpful to understand complex concepts."
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

        goTo(0);
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
