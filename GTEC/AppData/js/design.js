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


	$('.header-alarm').on('click', function(){
		$('#popup_alarm').fadeToggle();
	});

	$('.header-user').on('click', function(){
		$('.user-popup').fadeToggle();
	});



	$('.guide, .guide-wrap').on('mouseover', function(){
		$('.guide-wrap').stop().fadeIn();
	});

	$('.guide, .guide-wrap').on('mouseleave', function(){
		$('.guide-wrap').stop().fadeOut();
	});


	$('.nav-close').on('click', function(){
		if($('.nav-wrap').hasClass('close')){
			$('.nav-wrap, .nav-close').removeClass('close');
		} else {
			$('.nav-wrap, .nav-close').addClass('close');
		}
	});

	$('.btn-nav').on('click', function(){
		if($('.nav-wrap').hasClass('close')){
			$('.nav-wrap, .nav-close').removeClass('close');
		} else {
			$('.nav-wrap, .nav-close').addClass('close');
		}
	});

	responsive();

	if($('body').hasClass('dark')){
		$('#ck_dark').prop("checked", true);
	} else {
		$('#ck_dark').prop("checked", false);
	}

});

$(window).on('resize', function(){
	responsive();
})

function responsive(){
	var windowW = $(window).width();
	if(windowW < 769){
		$('.nav-wrap, .nav-close').addClass('close');
	} else {
		$('.nav-wrap, .nav-close').removeClass('close');
	}
}



