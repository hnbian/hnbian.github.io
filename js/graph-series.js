(function () {
    'use strict';

    function initGraphSeriesDrawer() {
        var trigger = document.getElementById('graph-series-trigger');
        var drawer = document.getElementById('graph-series-drawer');
        var backdrop = document.getElementById('graph-series-backdrop');
        var closeButton = drawer ? drawer.querySelector('.graph-series-close') : null;

        if (!trigger || !drawer || !backdrop || !closeButton) return;

        var isOpen = false;
        var previousOverflow = '';
        var previousPaddingRight = '';

        function getFocusableElements() {
            return Array.prototype.slice.call(
                drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
            ).filter(function (element) {
                return element.offsetWidth > 0 || element.offsetHeight > 0;
            });
        }

        function lockPageScroll() {
            var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            previousOverflow = document.body.style.overflow;
            previousPaddingRight = document.body.style.paddingRight;
            document.body.style.overflow = 'hidden';
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = scrollbarWidth + 'px';
            }
            document.body.classList.add('graph-series-open');
        }

        function unlockPageScroll() {
            document.body.style.overflow = previousOverflow;
            document.body.style.paddingRight = previousPaddingRight;
            document.body.classList.remove('graph-series-open');
        }

        function openDrawer() {
            if (isOpen) return;
            isOpen = true;
            trigger.setAttribute('aria-expanded', 'true');
            drawer.setAttribute('aria-hidden', 'false');
            drawer.classList.add('is-open');
            backdrop.classList.add('is-visible');
            lockPageScroll();

            window.requestAnimationFrame(function () {
                closeButton.focus();
            });
        }

        function closeDrawer(restoreFocus) {
            if (!isOpen) return;
            isOpen = false;
            trigger.setAttribute('aria-expanded', 'false');
            drawer.setAttribute('aria-hidden', 'true');
            drawer.classList.remove('is-open');
            backdrop.classList.remove('is-visible');
            unlockPageScroll();

            if (restoreFocus !== false) trigger.focus();
        }

        function trapFocus(event) {
            if (!isOpen) return;

            if (event.key === 'Escape') {
                event.preventDefault();
                closeDrawer(true);
                return;
            }

            if (event.key !== 'Tab') return;

            var focusable = getFocusableElements();
            if (!focusable.length) {
                event.preventDefault();
                drawer.focus();
                return;
            }

            var first = focusable[0];
            var last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            } else if (!drawer.contains(document.activeElement)) {
                event.preventDefault();
                first.focus();
            }
        }

        trigger.addEventListener('click', openDrawer);
        closeButton.addEventListener('click', function () {
            closeDrawer(true);
        });
        backdrop.addEventListener('click', function () {
            closeDrawer(true);
        });
        document.addEventListener('keydown', trapFocus);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGraphSeriesDrawer, { once: true });
    } else {
        initGraphSeriesDrawer();
    }
})();
