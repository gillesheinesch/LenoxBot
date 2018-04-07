// JavaScript source code
// Eventregistration
$("document").ready(function () {
    document.getElementById('toFeatures').addEventListener('click', () => {
        scrollTo('features');
    });

    document.getElementById('toTop').addEventListener('click', () => {
        scrollTo('header');
    });
});

function scrollTo(id) {
    $('html, body').animate({
        'scrollTop': $("#" + id).offset().top
    }, 1000, 'swing');
}
