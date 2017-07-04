var keystone = require('keystone');
var jade = require('jade');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'take-action';
	locals.filters = {
		locale: req.session.locale || 'en',
    category: req.params.category,
		next: req.query.next,
	};
	locals.data = {
		posts: [],
		categories: [],
		path: req._parsedUrl.pathname, 
	};

  // get all categories in this locale
	view.on('init', function(next) {
		var q = keystone.list('TakeActionCategory').model.find({locale: locals.filters.locale}).sort('name');

		q.exec(function(err, results) {
			locals.data.categories = results;
			next(err);
		})
	})

  // save current category to filter
  view.on('init', function(next) {
    var s = keystone.list('TakeActionCategory').model.findOne({key: locals.filters.category})

    s.exec(function(err, results) {
      locals.filters.category = results._id;
      next(err);
    })
  })

  // get all content from category filter
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
    .populate('categories')
    .where('categories').in([locals.filters.category])

		p.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
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
