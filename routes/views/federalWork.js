var keystone = require('keystone');
var jade = require('jade');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'state-work';
  locals.filters = {
    locale : req.session.locale || 'en',
		next: req.query.next, 
  };
	locals.data = {
		posts: [],
		allies: [],
		header: {},
	}

	// get header information
	view.on('init', function(next) {
		var p = keystone.list('FederalWorkHeader').model.findOne({state: 'published', locale: locals.filters.locale})

		p.exec(function (err, result) {
			locals.data.header = result || {};
			next(err);
		});
	});

  // Load all items
	view.on('init', function (next) {
		var p = keystone.list('FederalWork').paginate({
			page: req.query.page || 1,
			perPage: 5,
			maxPages: 15,
			filters: {
				state: 'published',
				locale: locals.filters.locale,
			},
		})
		.sort('-publishedDate')
		.populate('author tags')

		p.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// get allies info
	view.on('init', function(next) {
		var p = keystone.list('Ally').model.find({}).limit(8);

    p.exec(function(err, results) {
      locals.data.allies = results;
      next(err);
    })
	})

	// Render the view, but use json if the user clicks on the pagination controls
	// else use template
	if (locals.filters.next) {
		view.render(function(err) {
			if (err) return res.apiError('error', err);

			res.apiResponse({
				view: jade.renderFile('templates/includes/filter-federal-work.jade', {
					data: locals.data,
					filters: locals.filters,
				})
			})
		})
	} else {
		view.render('federal-work');
	}
};