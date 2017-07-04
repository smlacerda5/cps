$(function() {

  // NAV TO FIXED ON SCROLL @ TOP
  var alreadyCalled = false;
  $(document).scroll(function(){
    if (!alreadyCalled) {
      var $nav_div        = $('div.subnav');
      var $header_height  = $('.plain-header, .default-header').innerHeight();
      var $header_width   = $('.plain-header, .default-header').innerWidth();
      var scroll          = $(window).scrollTop();
      
      if ($header_width > 767) {
        if ( scroll > $header_height ) {
          $nav_div.addClass('fix_nav');
        } else {
          $nav_div.removeClass('fix_nav');
        }
      } else {
        if ( scroll > $header_height  ) {
          $nav_div.addClass('fix_nav');
        } else {
          $nav_div.removeClass('fix_nav');
        }
      }
    }
    alreadyCalled = true;

    setTimeout(function() {
      alreadyCalled = false;
    }, 100)
  });

  
});
