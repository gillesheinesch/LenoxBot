$("document").ready(function () {
    document.getElementById('features').addEventListener('click', () => {
        scrollTo('features');
    });
});

function scrollTo(id) {
    $('html, body').animate({
        'scrollTop': $("#" + id).offset().top
    }, 1000, 'swing');
}