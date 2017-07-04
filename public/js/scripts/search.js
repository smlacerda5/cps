$(function() {
  $(window).on('load', function() {
    if (history.state !== null) {
      postAjax(history.state, function() {
        $('.search-form .search-box').val(history.state.keywords);

        $('.tag-cloud-container .tag-cloud-item').removeClass('tag-cloud-item-active');

        $('.tag-cloud-container .tag-cloud-item').each(function(item) {
          if (history.state.tags.indexOf($(this).data('id')) >= 0) {
            $(this).addClass('tag-cloud-item-active');
          }
        })
      });
    }    
  })
  

  window.onpopstate = function(e) {
    if (e.state !== null) {
      postAjax(e.state, function() {
        $('.search-form .search-box').val(e.state.keywords);

        $('.tag-cloud-container .tag-cloud-item').removeClass('tag-cloud-item-active');

        $('.tag-cloud-container .tag-cloud-item').each(function(item) {
          if (e.state.tags.indexOf($(this).data('id')) >= 0) {
            $(this).addClass('tag-cloud-item-active');
          }
        })
      });
    }
  }


  $('.issue-container a').click(function(e) {
    getTagsAndKeywords(function(stateObj) {
      history.pushState(stateObj, null, 'search');
    })
  })


  // filter-by ajax functionality for tags
  $('.tag-cloud-container .tag-cloud-item').click(function(e) {
    e.preventDefault();
    $(this).toggleClass('tag-cloud-item-active');

    e.preventDefault();
    getTagsAndKeywords(null, postAjax);

  });


  // filter-by ajax functionality for search
  $('.search-btn').on('click', function(e) {
    e.preventDefault();
    getTagsAndKeywords(null, postAjax);
  });


  function getTagsAndKeywords(stateObj, cb) {
    if (!stateObj) {
      var $tags = $('.search-form .tag-cloud-item-active');
      var tagItems = [];
      var keywordVals = $('.search-form .search-box').val();

      $tags.map((idx, item) => {
        tagItems.push($(item).data().id);
      });

      stateObj = {
        tags: tagItems, 
        keywords: keywordVals,
      }
    }

    history.pushState(stateObj, null, 'search');

    cb(stateObj);
  }


  function postAjax(stateObj, cb) {
    if (!cb) cb = function() {};

    $.post('/search', stateObj)
      .done(function(data) {
        $('.filter-by-replace-search').replaceWith(data.view);
        cb();
      });
  }
	
})