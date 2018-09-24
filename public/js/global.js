// GLOBAL JS
// This js is included in all site pages.

// Activate current header button
if (typeof currentPageId !== 'undefined') {
    $(currentPageId).addClass('lb-navbar-active');
}

// Activate current nav dashboard button
if (typeof currentNavDashId !== 'undefined') {
    $(currentNavDashId).addClass('lb-nav-dashboard-active');
}

// Cool scrollbar style
(function ($) {
    $(window).on("load", function () {
        $(".lb-mcsp").mCustomScrollbar({
            theme: "lb-theme",
            scrollInertia: 300
        });
    });
})(jQuery);