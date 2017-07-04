var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {
     // these form submissions should be handled with Ajax. 
     // No need to re-render the whole form

	var view = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	locals.formType = req.query.form || 'general';
	locals.subject = req.query.subject || null;

	locals.data = {
		header: {}
	};

	locals.filters = {
		locale: req.session.locale || 'en',
	}

	// get header image
	view.on('init', function(next) {
		var p = keystone.list('EnquiryHeader').model.findOne({locale: locals.filters.locale})

		p.exec(function(err, result) {
			locals.data.header = result || {};
			next(err);
		})
	});


	// On POST requests, add the Enquiry item to the database
	view.on('post', function (next) {
		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, enquiryType, publication, subject, message',
			errorMessage: 'There was a problem submitting your enquiry',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
				next(err);
			} else {
				locals.enquirySubmitted = true;
				newEnquiry.save(function(err) {
					console.log('SAVING ENQUIRY TRIGGERING EMAIL DELIVERY');
					next(err);
				})
			}
		})
	});

	view.render('contact');
};
