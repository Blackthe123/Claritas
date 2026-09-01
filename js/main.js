/* ============================================================
   js/main.js — Shared utilities used across all pages
   - Mobile nav toggle
   - Smooth scroll for anchor links
   - Scroll-reveal observer
   ============================================================ */

'use strict';

/* ---- Mobile menu toggle ---- */
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

/* ---- Close menu when clicking outside the nav ---- */
document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav');
    const menu = document.getElementById('nav-menu');
    if (nav && menu && !nav.contains(e.target)) {
        menu.classList.remove('active');
    }
});

/* ---- Scroll-reveal animation ---- */
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const windowHeight = window.innerHeight;

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 100;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('visible');
            element.classList.add('revealed');
        }
    });
}

/* ---- Initialize event listeners after DOM loads ---- */
document.addEventListener('DOMContentLoaded', () => {
    // Attach smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            const menu = document.getElementById('nav-menu');
            if (menu) menu.classList.remove('active');
        });
    });

    // Run reveal on initial load
    revealOnScroll();
});

window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('resize', revealOnScroll, { passive: true });
window.addEventListener('load', revealOnScroll);
