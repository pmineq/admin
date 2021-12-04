$(document).ready(function(){

	$('.depth .nav-title').on('click', function(){
		$(this).parents('li').toggleClass('active');
	})

	// 상단 버튼

	$(window).scroll(function(){
		var scrT = $(window).scrollTop(); 
    var winH = $(window).height(); 
    var docH = $(document).height();

    if (winH < docH) {
    	if(scrT >= 300) {
    		$('.sticky-top').fadeIn();
    	} else {
    		$('.sticky-top').fadeOut();
    	}
    } else {
    	$('.sticky-top').hide();
    }
	});

	$('.sticky-top').on('click', function(){
		$('html, body').animate({scrollTop: 0}, 400);
		return false;
	});


	$('.open-popup').on('click', function(){
		$(this).next('.popup-wrap').fadeIn();
	});

	$('.popup-close').on('click', function(){
		$(this).parents('.popup-wrap').fadeOut();
	})

	$('.input-datepicker').datepicker();




	$('.guide, .guide-wrap').on('mouseover', function(){
		$('.guide-wrap').stop().fadeIn();
	});

	$('.guide, .guide-wrap').on('mouseleave', function(){
		$('.guide-wrap').stop().fadeOut();
	});

})