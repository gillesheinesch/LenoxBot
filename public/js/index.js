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

// Animation stats
$('.lb-count').each(function () {
    $(this).prop('Counter',0).animate({
        Counter: $(this).text()
    }, {
        duration: 2500,
        easing: 'swing',
        step: function (now) {
            $(this).text(Math.ceil(now));
        }
    });
});