(function (window, document) {
    'use strict';

    var analytics = window.hnbianAnalytics;
    if (!analytics) return;

    var sentSearchTerms = Object.create(null);
    var sentDepths = Object.create(null);
    var readCompleteSent = false;
    var visibleSeconds = 0;
    var lastProgress = 0;
    var article = null;
    var ticking = false;

    function articleParameters() {
        if (!article) return {};
        return {
            article_path: article.getAttribute('data-article-path') || window.location.pathname,
            article_title: article.getAttribute('data-article-title') || document.title,
            article_category: article.getAttribute('data-article-category') || ''
        };
    }

    function mergeParameters(parameters) {
        var result = articleParameters();
        Object.keys(parameters || {}).forEach(function (key) {
            result[key] = parameters[key];
        });
        return result;
    }

    function isSensitiveSearchTerm(term) {
        var emailPattern = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/;
        var phonePattern = /(?:^|\D)\+?\d[\d\s-]{6,}\d(?:\D|$)/;
        return emailPattern.test(term) || phonePattern.test(term);
    }

    analytics.trackSearch = function (term, resultCount) {
        var normalized = String(term || '').trim().replace(/\s+/g, ' ').slice(0, 80);
        var searchKey = normalized.toLowerCase();
        if (normalized.length < 2 || isSensitiveSearchTerm(normalized) || sentSearchTerms[searchKey]) return;
        sentSearchTerms[searchKey] = true;
        analytics.track('view_search_results', mergeParameters({
            search_term: normalized,
            result_count: Number(resultCount) || 0
        }));
    };

    function codeLanguage(codeElement) {
        var classes = codeElement && codeElement.className ? String(codeElement.className) : '';
        var parentClasses = codeElement && codeElement.parentElement
            ? String(codeElement.parentElement.className || '')
            : '';
        var match = (classes + ' ' + parentClasses).match(/(?:language-|lang-)([\w+-]+)/i);
        return match ? match[1].toLowerCase() : 'unknown';
    }

    function codeLengthBucket(length) {
        if (length < 100) return 'under_100';
        if (length < 500) return '100_499';
        if (length < 2000) return '500_1999';
        return '2000_plus';
    }

    analytics.trackCodeCopy = function (codeElement, codeLength) {
        analytics.track('code_copy', mergeParameters({
            code_language: codeLanguage(codeElement),
            code_length_bucket: codeLengthBucket(Number(codeLength) || 0)
        }));
    };

    function articleProgress() {
        if (!article) return 0;
        var rect = article.getBoundingClientRect();
        var articleTop = rect.top + window.pageYOffset;
        var articleHeight = Math.max(article.offsetHeight, 1);
        var viewportBottom = window.pageYOffset + window.innerHeight;
        return Math.max(0, Math.min(100, ((viewportBottom - articleTop) / articleHeight) * 100));
    }

    function evaluateReadingProgress() {
        ticking = false;
        if (!article) return;

        lastProgress = articleProgress();
        var thresholds = analytics.config.scrollThresholds || [25, 50, 75, 90];
        thresholds.forEach(function (threshold) {
            var numericThreshold = Number(threshold);
            if (lastProgress >= numericThreshold && !sentDepths[numericThreshold]) {
                sentDepths[numericThreshold] = true;
                analytics.track('article_scroll', mergeParameters({
                    percent_scrolled: numericThreshold
                }));
            }
        });

        var minimumSeconds = Number(analytics.config.readCompleteSeconds) || 30;
        if (!readCompleteSent && lastProgress >= 90 && visibleSeconds >= minimumSeconds) {
            readCompleteSent = true;
            analytics.track('article_read_complete', mergeParameters({
                engaged_time_seconds: visibleSeconds
            }));
        }
    }

    function scheduleReadingEvaluation() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(evaluateReadingProgress);
        }
    }

    function initializeArticleTracking() {
        article = document.getElementById('articleContent');
        if (!article) return;

        window.addEventListener('scroll', scheduleReadingEvaluation, { passive: true });
        window.addEventListener('resize', scheduleReadingEvaluation);
        window.setInterval(function () {
            if (document.visibilityState === 'visible') {
                visibleSeconds += 1;
            }
            scheduleReadingEvaluation();
        }, 1000);
        scheduleReadingEvaluation();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeArticleTracking);
    } else {
        initializeArticleTracking();
    }
}(window, document));
