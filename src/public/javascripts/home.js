window.addEventListener("load", init, false);

function init() {
	$('.r-preview .card .image').dimmer({
		on: 'hover'
	});
	$('.ui.sticky').sticky({
		context: '.page-content',
		offset: 100
	});
	$('.sticky .button').on('click', scrollTo);
}

function scrollTo(event) {
	var	id = $(this).attr('href').replace('#', '');
	var	$element = $('#'+id);
	var	position = $element.offset().top;

	$element.addClass('active');
	$('html body').animate({
		scrollTop: position
	}, 500);
	location.hash = '#' + id;

	event.stopImmediatePropagation();
	event.preventDefault();
}