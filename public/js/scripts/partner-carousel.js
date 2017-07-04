$(function() {

	$('#partner-carousel').carousel({
		interval: 6000,
	});
	
  // handle the about page partners section. Selecting a partner should 
  // change the partner quote shown below
  $('.partners-about a').on('click', function(e) {
    var id = e.currentTarget.dataset.id;

    // stop the carousel so it does not rotate while I'm changing slides
    $('#partner-carousel').carousel({
      interval: false,
    });

    // make all items inactive
    $('#partner-carousel .item').removeClass('active');
    // make chosen item active
    $('#partner-carousel #' + id).addClass('active');

    // restart the carousel so that the rotation begins at the beginning
    // everytime
    $('#partner-carousel').carousel({
      interval: 6000,
    });

  })

})