window.addEventListener("load", init, false);

function init() {
	// init dimmer effect
	$('.r-preview .card .image').dimmer({ on: 'hover' });
	$('.category .card .image').dimmer({ on: 'hover' });

	// init sticky side menu
	$('.ui.sticky').sticky({
		context: '.page-content',
		offset: 100
	});

	// init side menu click event
	$('.sticky .button').on('click', scrollTo);
}


/**
 * scrollTo() scrolls the whole page to an anchor.
 * the anchor must have the same id with the button's href
 */
function scrollTo(event) {
	var	id = $(this).attr('href').replace('#', '');
	var	$element = $('#' + id);
	var	position = $element.offset().top;

	$element.addClass('active');
	$('html body').animate({
		scrollTop: position
	}, 500);
	location.hash = '#' + id;

	// prevent default actions
	event.stopImmediatePropagation();
	event.preventDefault();
}