var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.filters = {
		locale: req.session.locale || 'en',
	}

	locals.section = 'privacy';

	view.render('privacy');
};
