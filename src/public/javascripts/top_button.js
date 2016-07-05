window.addEventListener("load", init, false);

function init() {
    $('.ui.sticky').sticky({
        context: '.page-content',
        offset: 350,
        //bottomOffset:500
    });
    $('.sticky .button').on('click', scrollTo);
}

function scrollTo(event) {
    var id = $(this).attr('href').replace('#', '');
    var $element = $('#'+id);
    var position = $element.offset().top;

    $element.addClass('active');
    $('html body').animate({
        scrollTop: position
    }, 500);
    location.hash = '#' + id;

    event.stopImmediatePropagation();
    event.preventDefault();
}