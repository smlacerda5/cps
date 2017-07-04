var keystone = require('keystone');
var jade = require('jade');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'story';
	locals.filters = {
		locale: req.session.locale || 'en',
		next: req.query.next,
	};
	locals.data = {
		posts: [],
		featured: [],
		locations: [],
		banner: {},
		champion: {},
	};

	// get banner image
	view.on('init', function(next) {
		var p = keystone.list('StoryBanner').model.findOne({locale: locals.filters.locale})

		p.exec(function(err, result) {
			locals.data.banner = result || {};
			next(err);
		})
	})

	// get all published stories
	view.on('init', function (next) {
		var q = keystone.list('Story').paginate({
			page: req.query.page || 1,
			perPage: 12, // be sure ./api/filterName has same value
			maxPages: 10,
			filters: {
				locale: locals.filters.locale,
				state: 'published',
			}
		})
		.populate('location')
		.sort('-publishedDate')

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
		var p = keystone.list('Story').model.find({
			locale: locals.filters.locale, 
			state: 'published',
			$or: [{image: {$exists: true}}, {cloudImage: {$exists: true}}],
		}).limit(4).sort('-publishedDate')

		p.exec(function(err, results) {
			locals.data.featured = results;
			next(err);
		})
	});

	view.on('init', function(next) {
		var p = keystone.list('JusticeChampion').model.findOne({
			locale: locals.filters.locale,
			state: 'published',
		}).sort('-forDate')

		p.exec(function(err, result) {
			locals.data.champion = result;
			next(err);
		})
	})

	// Render the view, but use json if the user clicks on the pagination controls
	// else use template
	if (locals.filters.next) {
		view.render(function(err) {
			if (err) return res.apiError('error', err);

			res.apiResponse({
				view: jade.renderFile('templates/includes/filter-voices-of-reform.jade', {
					data: locals.data,
				})
			});
		});
	} else {
		view.render('voices-of-reform');
	}
};