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
		fedPosts: [],
		states: [],
		allies: [],
		locations: [],
		header: {},
	}

	// get header information
	view.on('init', function(next) {
		var p = keystone.list('ReformInActionHeader').model.findOne({state: 'published', locale: locals.filters.locale})

		p.exec(function (err, result) {
			locals.data.header = result || {};
			next(err);
		});
	});

  // Load 2 latest state works
	view.on('init', function (next) {
		var p = keystone.list('StateWork').model.find({state: 'published', locale: locals.filters.locale})
		.limit(2)
		.sort('-publishedDate')
		.populate('author location tags')

		p.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// Load 2 latest federal works
	view.on('init', function (next) {
		var p = keystone.list('FederalWork').model.find({state: 'published',locale: locals.filters.locale})
		.limit(2)
		.sort('-publishedDate')
		.populate('author location tags')

		p.exec(function (err, results) {
			locals.data.fedPosts = results;
			next(err);
		});
	});

	// load state info for map
	view.on('init', function(next) {
    var p = keystone.list('StateWork').model.find({locale: locals.filters.locale, state: 'published', onMap: true }).populate('location');

    p.exec(function(err, results) {
			// sort the results by location name
			results.sort(function(a, b) {
				if (a.location.name < b.location.name) {
					return -1;
				} else if (a.location.name > b.location.name) {
					return 1;
				} else {
					return 0;
				}
			})
			
      locals.data.states = results;
      next(err);
    })
  })

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

	view.render('reform-in-action');
};