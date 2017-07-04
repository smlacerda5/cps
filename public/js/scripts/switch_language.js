$(function() {
	// switches languages between english/spanish
  $('.language-switch a').on('click', function(e) {
    e.preventDefault();

    $.get(e.currentTarget.href)
      .done(function(data) {
        window.location.reload();
      })
  })
})