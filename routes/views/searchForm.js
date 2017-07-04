var keystone = require('keystone');
var jade = require('jade');
var ObjectId = require('mongodb').ObjectID;

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'search';

	locals.filters = {
		locale: req.session.locale || 'en',
		turnOffLocale: true,
	};

	locals.data = {
		tags: [],
	};

	view.on('init', function(next) {
		var p = keystone.list('Tag').model.find({locale: locals.filters.locale}).sort('name')

		p.exec(function(err, results) {
			locals.data.tags = results || [];
			next(err);
		})
	})

	view.render('search-form');
};
