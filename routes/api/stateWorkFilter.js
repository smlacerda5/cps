var keystone = require('keystone');
var jade = require('jade');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports = module.exports = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
  locals.data = {
    posts: [],
    path: req._parsedUrl.pathname, 
  }
	locals.filters = {
		location: ObjectId(req.query.id) || null,
		locale: req.session.locale || 'en',
	};

  var paginationQuery =  {
    page: req.query.page || 1,
    perPage: 100, // be sure ./views/filterName has same value
    maxPages: 10,
    filters: {
      state: 'published',
      locale: locals.filters.locale,
    },
  }

  var paginationQuery1 =  {
    page: req.query.page || 1,
    perPage: 100, // be sure ./views/filterName has same value
    maxPages: 10,
    filters: {
      state: 'published',
      locale: locals.filters.locale,
    },
  }


  if (req.query.id) {
    // load posts by location
 		view.on('init', function(next) {
      var p = keystone.list('StateWork').paginate(paginationQuery1)
      .where('location').in([locals.filters.location])
      .sort('-publishedDate')
      .populate('author categories location')

      p.exec(function(err, results) {
        locals.data.posts = results;
        next(err)
      })
    })
  } else {
    // load all posts
 		view.on('init', function(next) {
      var p = keystone.list('StateWork').paginate(paginationQuery)
      .sort('-publishedDate')
      .populate('author categories location')

      p.exec(function(err, results) {
        locals.data.posts = results;
        next(err)
      })
     })
  }

  view.render(function(err) {
    if (err) return res.apiError('error', err);

    res.apiResponse({
      view: jade.renderFile('templates/includes/filter-state-work.jade', {
        data: locals.data,
				filters: locals.filters,
      })
    });
  });
};
