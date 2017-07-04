var keystone = require('keystone');
var jade = require('jade');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'press';
	locals.filters = {
		locale: req.session.locale || 'en',
    category: req.params.category,
		next: req.query.next,
	};
	locals.data = {
		posts: [],
		categories: [],
		locations: [],
		path: req._parsedUrl.pathname, 
	};

  // get all categories in this locale
	view.on('init', function(next) {
		var q = keystone.list('PressCategory').model.find({locale: locals.filters.locale}).sort('name');

		q.exec(function(err, results) {
			locals.data.categories = results;
			next(err);
		})
	})

  // save current category to filter
  view.on('init', function(next) {
    var s = keystone.list('PressCategory').model.findOne({key: locals.filters.category})

    s.exec(function(err, results) {
      locals.filters.category = results;
      next(err);
    })
  })

  // get all content from category filter
	view.on('init', function (next) {
		var p = keystone.list('Press').paginate({
			page: req.query.page || 1,
			perPage: 12,
			maxPages: 10,
			filters: {
				state: 'published',
				locale: locals.filters.locale,
			},
		})
		.sort('-publishedDate')
    .populate('categories')
    .where('categories').in([locals.filters.category._id])

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
				view: jade.renderFile('templates/includes/filter-press.jade', {
					data: locals.data,
				})
			});
		});
	} else {
		view.render('press');
	}
};
