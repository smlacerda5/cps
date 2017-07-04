$(function () {

  // console.log('getting social media feed');
  var slideCount = 0;
  
  $.ajax({
    type : 'GET',
    url : 'social/feed/twitter',
    dataType : 'json',
    success: function(content) {
      // console.log('HERE IS THE TWITTER FEED');
      console.log(content);

      var $feed1 = $('#feed-1-slider');
      
      // select first six posts
      var firstSixPosts = content.data.slice(0, 6);
      var htmlString = '';

      firstSixPosts.forEach(function(obj){
        // use feedBoxMaker to create facebook feed panel box
        htmlString += feedBoxMaker(obj);
      });

      // append panel box to feed container
      $feed1.append(htmlString);
    },
    error: function(err) {
      console.log(err);
    }
  });
  


  // Creates a panel box with facebook post
  // this is called in the ajax request above
  function feedBoxMaker(obj){
    var width  = 575,
      height = 400,
      left   = ($(window).width() - width) / 2,
      top    = ($(window).height() - height) / 2;

    var htmlString = '';
        htmlString += '<div class="feed-1-container social-card tweet-' + slideCount + ' col-lg-4 col-md-4 col-sm-12">';
          htmlString += '<a href="https://twitter.com/publicsafety/status/' + obj.id_str + '" target="_blank" class="retweet">';
            htmlString += '<div class="feed title">';
              htmlString += '<h5>@' + obj.user.screen_name + '</h5>';
            htmlString += '</div>';
            htmlString += '<div class="feed-blurb">';
              htmlString += '<p>' + obj.text.slice(0, 140) + ' ...</p>';
            htmlString += '</div>';
            htmlString += '<div class="media-date-container">';
              htmlString += '<div class="feed-media">';
                htmlString += '<span class="fa fa-icon-twitter"></span>';
                htmlString += '<a onClick="window.open(\'https://twitter.com/intent/retweet?tweet_id=' + obj.id_str + '\', \'retweet\', \'resizable=yes, height=' + height + ', width=' + width + ', screenY=' + top + ', screenX=' + left + '\'); return false;" target="_blank">';
                  htmlString += '<span class="fa fa-icon-retweet">';
                    htmlString += '<span class="retweet-count">' + obj.retweet_count + '</span>';
                  htmlString += '</span>';
                htmlString += '</a>';
                htmlString += '<span> @' + obj.user.screen_name + '</span>';
              htmlString += '</div>';
              htmlString += '<div class="feed-date pull-right">';
                htmlString += '<span>' + formatDate(obj.created_at) + '</span>';
              htmlString += '</div>';
            htmlString += '</div>';
          htmlString += '</a>';
        htmlString += '</div>';
        
    // increase slideCount for class on next card
    slideCount++;
    return htmlString;
  };

  function formatDate(dateString){
    var date = new Date(dateString).toString().split(' ');
    return (date[1] + ' ' + date[2] + ', ' + date[3]); 
  };


});
