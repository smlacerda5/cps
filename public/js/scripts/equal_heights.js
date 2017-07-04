// equal heights plugin
$.fn.equalHeights = function() {
  $(this).each(function() {
    var currHeight = 0, max = 0;

    var $eqHeights = $(this).find('.equal-height');
    
    $eqHeights.each(function() {
      $(this).height('');
    })

    $eqHeights.each(function() {
      var currHeight = $(this).height();

      if (currHeight > max)
        max = currHeight;
    })

    $eqHeights.height(max);
  })
}


$(function() {
  // equal heights for each block using .equal-height
  // makes sure event doesn't get queued up by firing only every x seconds
  var alreadyCalled = false

  function equalHeights() {
    if (!alreadyCalled) {
      $('.block-row').equalHeights();
      
      alreadyCalled = true;

      setTimeout(function() {
        alreadyCalled = false;
      }, 500)
    }
  }

  // run equalHeights on the following events
  $(window).on('load', equalHeights);
  $(window).on('resize', equalHeights);

});
