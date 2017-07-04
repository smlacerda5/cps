var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'about';
	locals.filters = {
		locale: req.session.locale || 'en',
	};
	locals.data = {
		team: [],
		partners: [],
		header: {},
	};

	// get header information
	view.on('init', function(next) {
		var p = keystone.list('AboutHeader').model.findOne({state: 'published', locale: locals.filters.locale})

		p.exec(function (err, result) {
			locals.data.header = result || {};
			next(err);
		});
	});

	view.on('init', function (next) {
		var q = keystone.list('TeamMember').model.find({locale: locals.filters.locale});

		q.exec(function (err, results) {
			locals.data.team = results;
			next(err);
		});
	});

	// get partner images
	view.on('init', function(next) {
    var p = keystone.list('Partner').model.find({}).limit(8)

    p.exec(function(err, results) {
      locals.data.partners = results;
      next(err);
    })
  })

	// Render the view
	view.render('about');
};