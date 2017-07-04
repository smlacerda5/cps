var keystone = require('keystone');
var Types = keystone.Field.Types;

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true,
	defaultColumns: 'name, email, phone, enquiryType, createdAt',
	track: true,
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	enquiryType: { type: String },
	publication: { type: String },
	subject: { type: String },
	message: { type: Types.Html, required: true },
});

Enquiry.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function () {
	if (this.wasNew && process.env.NODE_ENV != 'development') {
    this.sendNotificationEmail(function(data) {
      console.log(data);
    })
  }
})

Enquiry.schema.methods.sendNotificationEmail = function (callback) {
  // where do we configure our email SMTP server? (e.g Mandrill)
  // we will want to use mail.tlmworks.org to test in dev
	if (typeof callback !== 'function') {
		callback = function () {};
	}
	var enquiry = this;
	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);

		if (this.enquiryType === "press") {
			new keystone.Email({
				templateName: 'enquiry-notification',
			}).send({
				to: 'press@coalitionforpublicsafety.org',
				from: {
					name: 'The Coalition for Public Safety',
					email: 'cps-site@coalitionforpublicsafety.org'
				},
				subject: 'New Press Enquiry for The Coalition for Public Safety',
				enquiry: enquiry,
			}, callback);
		} else {
			new keystone.Email({
				templateName: 'enquiry-notification',
			}).send({
				to: 'coalitioninfo@coalitionforpublicsafety.org',
				from: {
					name: 'The Coalition for Public Safety',
					email: 'cps-site@coalitionforpublicsafety.org'
				},
				subject: 'New General Enquiry for The Coalition for Public Safety',
				enquiry: enquiry,
			}, callback);
		}
	});
};

Enquiry.defaultSort = '-createdAt';
Enquiry.register();
