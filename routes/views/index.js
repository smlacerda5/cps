var keystone = require('keystone');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;

  // SET LOCALS
  locals.section = 'index';
  locals.filters = {
    locale : req.session.locale || 'en',
  };
  locals.data = {
    infographics: [],
    stories: [],
    press: [],
    states: [],
    partners: [],
    header: {},
    video: {},
  };

	// get header information
	view.on('init', function(next) {
		var p = keystone.list('HomeHeader').model.findOne({state: 'published', locale: locals.filters.locale})

		p.exec(function (err, result) {
			locals.data.header = result || {};
			next(err);
		});
	});

  // page video
	view.on('init', function(next) {
		var p = keystone.list('Video').model.findOne({
      locale: locals.filters.locale,
      location: 'home-location-1',
    })

		p.exec(function (err, result) {
			locals.data.video = result || {};
			next(err);
		});
	});

  // load infographics
	view.on('init', function (next) {
    var q = keystone.list('Infographic').model.find({locale: locals.filters.locale, state: 'published'})
      .sort('-publishedDate');

		q.exec(function (err, results) {
			locals.data.infographics = results;
			next(err);
		});
	});

  // load stories
  view.on('init', function(next) {
    var p = keystone.list('Story').model.find({locale: locals.filters.locale, state: 'published'})
      .limit(2)
      .populate('tags')
      .sort('-publishedDate');

    p.exec(function(err, results) {
      locals.data.stories = results;
      next(err);
    })
  });

  // load presses
  view.on('init', function(next) {
    var s = keystone.list('Press').model.find({locale: locals.filters.locale, state: 'published'})
      .limit(3)
      .sort('-publishedDate')

    s.exec(function(err, results) {
      locals.data.press = results;
      next(err); 
    })
  });

  view.on('init', function(next) {
    var p = keystone.list('News').model.find({locale: locals.filters.locale, state: 'published'})
      .limit(3)
      .sort('-publishedDate')

    p.exec(function(err, results) {
      if (results.length > 0) {
        locals.data.press = locals.data.press.concat(results);

        locals.data.press.sort(function(a, b) {
          return b.publishedDate - a.publishedDate;
        })
      }
      next(err);
    });
  })

  // load statework for map
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

  // get partner images
  view.on('init', function(next) {
    var p = keystone.list('Partner').model.find({}).limit(8)

    p.exec(function(err, results) {
      locals.data.partners = results;
      next(err);
    })
  })

  view.render('index');
};
