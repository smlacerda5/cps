$(function() {
  // filter-by ajax functionality
  $('.filter-by .dropdown-menu a').on('click', function(e) {
    e.preventDefault();
    $('.filter-by .dropdown-toggle').html($(this).text() + '<span class="fa fa-icon-caret-down"></span>');

    // reset the categories to All
    $('.categories-section .categories .selected').removeClass('selected');
    $('.categories-section .categories li:first-child a').addClass('selected');

    var id = e.currentTarget.dataset.id;

    history.pushState(location.href, null, location.pathname);

    $.get(e.currentTarget.href, {id: id})
      .done(function(data) {
        $('.filter-by-replace').replaceWith(data.view);
        $(window).trigger('resize'); // trigger resize so equal-height fires
      })
  })

  // categories ajax functionality
  $('.categories-section .category-hook a').on('click', function(e) {
    e.preventDefault();

    // reset the filter-by button to All States
    $('button.dropdown-toggle').html($('.dropdown-menu a:first-child').text() + '<span class="fa fa-icon-caret-down"></span>');

    var id = e.currentTarget.dataset.id;

    $('.categories-section .selected').removeClass('selected');
    $(this).addClass('selected');

    $.get(e.currentTarget.href, {id: id, next: true})
      .done(function(data) {
        $('.filter-by-replace').replaceWith(data.view);
        $(window).trigger('resize'); // trigger resize so equal-height fires
      })
  })

  // pagination ajax functionality with pushState
  $(document).on('click', '.paginate-ajax a', function(e){
    e.preventDefault();

    var href = e.currentTarget.href;

    history.pushState({href: href}, null, e.currentTarget.search);

    getAjax(href).done(renderView).then(triggerResize);
  });



  // handle refresh of page, using pushState object
  $(window).on('load', function() {
    if (history.state !== null) {
      getAjax(history.state.href).done(renderView).then(triggerResize);
    } 
  })

  // handle pushstate so that back button works correctly on pagination
  window.onpopstate = function(e) {
    if (e.state !== null) {
      getAjax(e.state.href).done(renderView).then(triggerResize); 
    } else {
      getAjax(location.href).done(renderView).then(triggerResize); 
    }
  }



  // sends ajax request to server
  function getAjax(href) {
    return $.get(href, {next: true});
  }

  // renders view
  function renderView(data) {
    var $closestReplace = $('.filter-by-replace');
    var $page = $('.page');

    var topReplaceOffset = $closestReplace.offset().top;
    var topPageOffset = $page.offset().top;

    // added this so that it scrolls to the right place on the page
    // I didn't like the way it was showing the bottom of the header
    if (Math.abs(topPageOffset - topReplaceOffset) > 500) {
      $('html, body').scrollTop($closestReplace.offset().top - 300);
    } else {
      $('html, body').scrollTop($page.offset().top - 100);
    }

    $closestReplace.replaceWith(data.view);
    return true;
  }

  // trigger resize so equal-height fires
  function triggerResize() {
    equalHeights(); 
    return true;
  }


  // Have to call equalHeights here because 
  var alreadyCalled = false

  function equalHeights() {
    $('.block-row').equalHeights();
  }


}) // end $(function(){})