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
            mouseWheel: {
                scrollAmount: 250 //in pixels
            }
        });
    });
})(jQuery);

// Enable tooltips
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

// Animation stats
$('.lb-count').each(function () {
    $(this).prop('Counter', 0).animate({
        Counter: $(this).text()
    }, {
            duration: 2500,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
});

// Toggle menus (sidebars)
$('#toggle-menu').click(function () {
    $('.menu').slideToggle();
});

// Show menus if window is >= 992px
$(window).resize(function () {
    if (parseInt($(window).width()) >= 992) {
        if (!$('.menu').is(':visible')) {
            $('.menu').slideDown();
        }
    }
});
