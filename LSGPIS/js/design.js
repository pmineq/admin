$(document).ready(function(){

  //menu버튼 - lnb close
  $('.header-menu').on('click', function(){
    if($('.lnb').hasClass('lnb-close')){
      $('.lnb').removeClass('lnb-close');
    } else {
      $('.lnb').addClass('lnb-close');
    }
    
  });

  //lnb menu - submenu open
  $('.lnb-title').on('click', function(){
    if($(this).parents('li').hasClass('open')){
      $(this).parents('li').removeClass('open');
      $(this).next().stop().slideUp();
    } else {
      $(this).parents('li').addClass('open');
      $(this).next().stop().slideDown();
    }
	});

});