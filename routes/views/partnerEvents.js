var keystone = require('keystone');
var jade = require('jade');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'take-action';
	locals.filters = {
		locale: req.session.locale || 'en',
		next: req.query.next,
	};
	locals.data = {
		posts: [],
		featured: [],
		locations: [],
	};

	// get all published posts
	view.on('init', function (next) {
		var q = keystone.list('PartnerEvent').paginate({
			page: req.query.page || 1,
			perPage: 12,
			maxPages: 10,
			filters: {
				locale: locals.filters.locale,
				state: 'published',
			}
		})
		.populate('location')
		.sort('eventDate publishedDate')

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	})

	// get all locations
	view.on('init', function(next) {
		var p = keystone.list('Location').model.find({})
			.sort('name')

		p.exec(function(err, locations) {
			locals.data.locations = locations;
			next(err);
		})
	})

	// get a few of the most recent posts that contain images to use for header
	view.on('init', function(next) {
		var p = keystone.list('PartnerEvent').model.find({
			locale: locals.filters.locale, 
			state: 'published',
			$or: [{'image.size': {$gt: 0}}, {cloudImage: {$exists: true}}],
		})
			.limit(2)
			.sort('eventDate publishedDate')

		p.exec(function(err, results) {
			locals.data.featured = results;
			next(err);
		})
	});

	// Render the view, but use json if the user clicks on the pagination controls
	// else use template
	if (locals.filters.next) {
		view.render(function(err) {
			if (err) return res.apiError('error', err);

			res.apiResponse({
				view: jade.renderFile('templates/includes/filter-partner-events.jade', {
					data: locals.data,
				})
			});
		});
	} else {
		view.render('partner-events');
	}
};