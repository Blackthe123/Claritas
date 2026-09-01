/* ============================================================
   js/blog-filter.js — Blog directory tag filtering & URL sync
   ============================================================ */

'use strict';

(function () {
    const filterBar = document.getElementById('filterBar');
    const cards = Array.from(document.querySelectorAll('.blog-card'));
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
            const tags = card.dataset.tags.split(' ');
            const show = filter === 'all' || tags.includes(filter);
            card.classList.toggle('is-hidden', !show);
            if (show) visibleCount++;
        });

        if (emptyState) emptyState.classList.toggle('visible', visibleCount === 0);

        // Reflect filter in URL for shareable links, without page reload
        try {
            const url = new URL(window.location);
            if (filter === 'all') url.searchParams.delete('tag');
            else url.searchParams.set('tag', filter);
            history.replaceState(null, '', url);
        } catch (err) {
            // Silently ignore in file:// environments
        }
    });

    // Apply filter from URL on page load (e.g. blogs.html?tag=mathematics)
    (function initFilterFromURL() {
        try {
            const tag = new URL(window.location).searchParams.get('tag');
            if (!tag) return;
            const btn = filterBar.querySelector(`[data-filter="${tag}"]`);
            if (btn) btn.click();
        } catch (err) {
            // Silently ignore
        }
    })();
})();
