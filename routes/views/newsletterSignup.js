var keystone = require('keystone');
var mailchimp_key = process.env.MAILCHIMP_KEY;
var mailchimp_list_id = process.env.MAILCHIMP_LIST_ID;

if (process.env.NODE_ENV === "production") {
  var Mailchimp = require('mailchimp-api-v3')
  var mailchimp = new Mailchimp(mailchimp_key);
}

exports = module.exports = function (req, res) {

  // var view = new keystone.View(req, res);
  console.log(req.body);
  var data = req.body;

  mailchimp.post('lists/' + mailchimp_list_id + '/members', {
    email_address: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    status: 'subscribed',
    merge_fields: {
      ZIP: data.zip,
    }
  }).
  then(function(results) {
    console.log(results);
    res.status(200).send();
  }).
  catch(function(error) {
    res.status(500).send();
    console.log(error);
  })
}
