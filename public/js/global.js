// GLOBAL JS
// This js is included in all site pages.

// Activate current header button
if (typeof currentPageId !== 'undefined') {
    $(currentPageId).addClass('lb-navbar-active');
}

// Activate donate button
if (typeof DonateId !== 'undefined') {
    $(DonateId).addClass('lb-donate-heart');
    $(DonateId).html('<i class="mdi mdi-heart"></i>');
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
            scrollInertia: 300, //in ms
            mouseWheel:{
                scrollAmount: 250 //in pixels
            }
        });
    });
})(jQuery);

// Tooltips enabled
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })