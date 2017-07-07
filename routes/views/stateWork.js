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
		locations: [],
		header: {},
	}

		// get header information
	view.on('init', function(next) {
		var p = keystone.list('StateWorkHeader').model.findOne({state: 'published', locale: locals.filters.locale})

		p.exec(function (err, result) {
			locals.data.header = result || {};
			next(err);
		});
	});

  // Load all items
	view.on('init', function (next) {
		var p = keystone.list('StateWork').paginate({
			page: req.query.page || 1,
			perPage: 100, // be sure ./api/filterName has same value
			maxPages: 15,
			filters: {
				state: 'published',
				locale: locals.filters.locale,
			},
		})
		.sort('-publishedDate')
		.populate('author location tags')

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
				view: jade.renderFile('templates/includes/filter-state-work.jade', {
					data: locals.data,
					filters: locals.filters,
				})
			})
		})
	} else {
		view.render('state-work');
	}
};