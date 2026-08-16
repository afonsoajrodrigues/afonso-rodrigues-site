// Investigations index — category tabs + search box, both scoped to
// [data-investigations-list]. Pure client-side filtering over the static
// cards already in the DOM (no fetch, no i18n — matches the rest of the site's
// "two static HTML versions" approach: EN and PT pages load this same script
// and just carry their own localized data-search strings).
(function () {
  document.querySelectorAll('[data-investigations-list]').forEach(function (list) {
    var section = list.closest('section') || document;
    var tabs = section.querySelectorAll('[data-filter-tab]');
    var search = section.querySelector('[data-investigations-search]');
    var cards = list.querySelectorAll('[data-category]');
    var noResults = section.querySelector('[data-no-results]');
    var activeTab = 'all';

    function apply() {
      var q = (search && search.value || '').trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var inTab = activeTab === 'all' || card.dataset.category === activeTab;
        var haystack = (card.dataset.search || '') + ' ' + card.textContent;
        var inSearch = !q || haystack.toLowerCase().indexOf(q) !== -1;
        var show = inTab && inSearch;
        card.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });
      if (noResults) noResults.hidden = visible !== 0;
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        activeTab = tab.dataset.filterTab;
        apply();
      });
    });

    if (search) search.addEventListener('input', apply);

    apply();
  });
})();
