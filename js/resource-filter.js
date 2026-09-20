/* ============================================================
   js/resource-filter.js — Resource directory tag filtering & URL sync
   ============================================================ */

'use strict';

(function () {
    const filterBar = document.getElementById('resourceFilterBar');
    const cards = Array.from(document.querySelectorAll('.resource-card'));
    const emptyState = document.getElementById('emptyState');

    if (!filterBar) return;

    filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-pill');
        if (!btn) return;

        filterBar.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let visibleCount = 0;

        cards.forEach(card => {
            const tags = (card.dataset.tags || '').split(' ');
            const show = filter === 'all' || tags.includes(filter);
            card.classList.toggle('is-hidden', !show);
            if (show) visibleCount++;
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', visibleCount === 0);
        }

        // Reflect filter in URL for shareable links, without page reload
        try {
            const url = new URL(window.location);
            if (filter === 'all') url.searchParams.delete('category');
            else url.searchParams.set('category', filter);
            history.replaceState(null, '', url);
        } catch (err) {
            // Silently ignore in file:// environments
        }
    });

    // Apply filter from URL on page load (e.g. resources.html?category=software-engineering)
    (function initFilterFromURL() {
        try {
            const category = new URL(window.location).searchParams.get('category');
            if (!category) return;
            const btn = filterBar.querySelector(`[data-filter="${category}"]`);
            if (btn) btn.click();
        } catch (err) {
            // Silently ignore
        }
    })();
})();
