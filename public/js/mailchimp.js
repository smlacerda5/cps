// this is client side mailchimp logic
// send an Ajax request to a route that then uses the api wrapper module

$(function () {

  // TODO gracefully handle a 500 response from the server
  // Sometimes Mailchimp returns an error (e.g. User already signed up)
  function mailchimpSignup(data, callback) {
    // You will need to fake a successful response from Mailchimp here

    $.post('/newsletter-signup', {email: data.email, zip: data.zip, firstName: data.firstName, lastName: data.lastName})
      .done(function(data) {
        console.log(data)
        callback(false, data);
      })
      .error(function(err){
        $('.form-submit-message').text(err.statusText).attr('class', 'text-danger');
      })

  }

  function mailchimpSetup(selector) {
    var form = $(selector);

    form.on('submit', function(e) {
      e.preventDefault();

      var pattern = /^\d{5}$/;
      var email = form.find('.mailchimp-email').val() || form.find('.email').val()
      var firstName = form.find('.mailchimp-first-name').val() || form.find('.first-name').val();
      var lastName = form.find('.mailchimp-last-name').val() || form.find('.last-name').val();
      var zip = form.find('.mailchimp-zip').val() || form.find('.zip').val()
      var $msgArea = $(selector + ' .form-submit-message'); 

      // clear the message area each time the submit button is clicked
      $msgArea.text('');

      if (!pattern.test(zip)) {
        $msgArea.text('Please use numbers and dashes only for zip code.').attr('class', 'text-danger')
        return;
      }
      mailchimpSignup({email: email, zip: zip, firstName: firstName, lastName: lastName}, function(err) {
        if(err) { 
          $msgArea.text(err).attr('class', 'text-danger');
        } else {
          $msgArea.text('Signup successful');
          form.find('input').hide();

          // TODO something animated and elegant here
          // saying 'Thank you' or something
        }
      })
    });
  }

  if($('#join-us-form').length > 0) {
    mailchimpSetup('#join-us-form');
  };

  if($('#newsletter-form').length > 0) {
    mailchimpSetup('#newsletter-form');
  };
});
