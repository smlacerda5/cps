var keystone = require('keystone');
var jade = require('jade');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'press';
  locals.filters = {
    locale : req.session.locale || 'en',
		next: req.query.next, 
  };
	locals.data = {
		posts: [],
		featured: [],
	}

  // Load all items
	view.on('init', function (next) {
		var p = keystone.list('News').paginate({
			page: req.query.page || 1,
			perPage: 12,
			maxPages: 15,
			filters: {
				state: 'published',
				locale: locals.filters.locale,
			},
		})
		.sort('-publishedDate')
		.populate('author location')

		p.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// get a few of the most recent posts that contain images to use for header
	view.on('init', function(next) {
		var p = keystone.list('News').model.find({
			locale: locals.filters.locale, 
			state: 'published', 
			$or: [ {image: {$exists: true}}, {cloudImage: {$exists: true}}] 
		}).limit(3).sort('-publishedDate')

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
				view: jade.renderFile('templates/includes/filter-news.jade', {
					data: locals.data,
					filters: locals.filters,
				})
			})
		})
	} else {
		view.render('news');
	}
};