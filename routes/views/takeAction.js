var keystone = require('keystone');
var jade = require('jade');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'take-action';
	locals.filters = {
		post: req.params.post,
		locale: req.session.locale || 'en',
		next: req.query.next,
	};
	locals.data = {
		posts: [],
		categories: [],
		cpsEvents: [],
		partnerEvents: [],
		header: {},
	};

	// get header information
	view.on('init', function(next) {
		var p = keystone.list('TakeActionHeader').model.findOne({state: 'published', locale: locals.filters.locale})

		p.exec(function (err, result) {
			locals.data.header = result || {};
			next(err);
		});
	});

	// get all categories in this locale 
	view.on('init', function(next) {
		var q = keystone.list('TakeActionCategory').model.find({locale: locals.filters.locale}).sort('name');

		q.exec(function(err, results) {
			locals.data.categories = results;
			next(err);
		})
	})

	// get all posts in this locale
	view.on('init', function (next) {
		var p = keystone.list('TakeAction').paginate({
			page: req.query.page || 1,
			perPage: 15,
			maxPages: 10,
			filters: {
				state: 'published',
				locale: locals.filters.locale,
			},
		})
		.sort('-publishedDate')
		.populate('author categories');

		p.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// get last 2 cps events
	view.on('init', function(next) {
		var q = keystone.list('Event').model
			.find({locale: locals.filters.locale})
			.sort('eventDate publishedDate')
			.limit(2);

		q.exec(function(err, results) {
			locals.data.cpsEvents = results;
			next(err);
		})
	});

	// get last 2 partner events
	view.on('init', function(next) {
		var q = keystone.list('PartnerEvent').model
			.find({locale: locals.filters.locale})
			.sort('eventDate publishedDate')
			.limit(2);

		q.exec(function(err, results) {
			locals.data.partnerEvents = results;
			next(err);
		})
	});

	// Render the view, but use json if the user clicks on the pagination controls
	// else use template
	if (locals.filters.next) {
		view.render(function(err) {
			if (err) return res.apiError('error', err);

			res.apiResponse({
				view: jade.renderFile('templates/includes/filter-take-action.jade', {
					data: locals.data,
				})
			});
		});
	} else {
		view.render('take-action');
	}

};
