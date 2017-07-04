var keystone = require('keystone');
var jade = require('jade');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'research';
	locals.filters = {
		locale: req.session.locale || 'en',
		next: req.query.next,
	};
	locals.data = {
		posts: [],
		categories: [],
		locations: [],
		header: {},
	};

	// get header information
	view.on('init', function(next) {
		var p = keystone.list('ResearchHeader').model.findOne({state: 'published', locale: locals.filters.locale})

		p.exec(function (err, result) {
			locals.data.header = result || {};
			next(err);
		});
	});

	// get all categories in this locale 
	view.on('init', function(next) {
		var q = keystone.list('ResearchCategory').model.find({locale: locals.filters.locale}).sort('name');

		q.exec(function(err, results) {
			locals.data.categories = results;
			next(err);
		})
	})

	// get all posts in this locale
	view.on('init', function (next) {
		var p = keystone.list('Research').paginate({
			page: req.query.page || 1,
			perPage: 12, // be sure ./api/filterName has same value
			maxPages: 10,
			filters: {
				state: 'published',
				locale: locals.filters.locale,
			},
		})
		.sort('-publishedDate')
		.populate('author categories location');

		p.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// get all locations
	view.on('init', function(next) {
		var p = keystone.list('Location').model.find({})
			.sort('name')

		p.exec(function(err, locations) {
			locals.data.locations = locations;
			next(err);
		})
	})

	// Render the view, but use json if the user clicks on the pagination controls
	// else use template
	if (locals.filters.next) {
		view.render(function(err) {
			if (err) return res.apiError('error', err);

			res.apiResponse({
				view: jade.renderFile('templates/includes/filter-research.jade', {
					data: locals.data,
				})
			});
		});
	} else {
		view.render('research');
	}
};
