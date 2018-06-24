$("document").ready(function () {
    document.getElementById('learnmore-button').addEventListener('click', () => {
        scrollTo('features-list');
    });
});

function scrollTo(id) {
    $('html, body').animate({
        'scrollTop': $("#" + id).offset().top
    }, 1000, 'swing');
}
