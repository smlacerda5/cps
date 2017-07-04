/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone 				= require('keystone');

// ======================================== //
// ========= INTERNATIONALIZATION ========= //
// ======================================== //
// var i18n 						= require('i18n');

var middleware 			= require('./middleware');
var importRoutes 		= keystone.importer(__dirname);



// ======================================== //
// ============= i18n SUPPORT ============= //
// ======================================== //
// keystone.pre('routes', i18n.init);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};


// Setup Route Bindings
exports = module.exports = function (app) {
	// disable notification that this site uses Express, security issue
	app.disable("x-powered-by"); 


	// Views
	app.get('/', routes.views.index);
	

	app.get('/reform-in-action', keystone.middleware.api, routes.views.reformInAction);
	app.get('/reform-in-action/state-work', keystone.middleware.api, routes.views.stateWork);
	app.get('/reform-in-action/state-work/post/:title', keystone.middleware.api, routes.views.stateWorkSingle);
	app.get('/reform-in-action/state-work/filter-by/:location', keystone.middleware.api, routes.api.stateWorkFilter);
	app.get('/reform-in-action/federal-work', keystone.middleware.api, routes.views.federalWork);
	app.get('/reform-in-action/federal-work/post/:title', keystone.middleware.api, routes.views.federalWorkSingle);


	app.get('/issues/', routes.views.issues);
	app.get('/issues/:issue', routes.views.issue);


	app.get('/voices-of-reform', keystone.middleware.api, routes.views.stories);
	app.get('/voices-of-reform/:story', routes.views.story);
	app.get('/voices-of-reform/filter-by/:location', keystone.middleware.api, routes.api.storyFilter);


	app.get('/media', keystone.middleware.api, routes.views.media);
	app.get('/media/press-release', keystone.middleware.api, routes.views.press);
	app.get('/media/press-release/:press', routes.views.pressSingle);
	app.get('/media/press-release/category/:category', keystone.middleware.api, routes.views.pressCategories);
	app.get('/media/press-release/filter-by/:location', keystone.middleware.api, routes.api.pressFilter);
	app.get('/media/news', keystone.middleware.api, routes.views.news);
	app.get('/media/news/post/:article', routes.views.newsSingle);


	app.get('/research', keystone.middleware.api, routes.views.research);
	app.get('/research/category/:category', keystone.middleware.api, routes.views.researchCategories);
	app.get('/research/filter-by/:location', keystone.middleware.api, routes.api.researchFilter);


	app.get('/blog', keystone.middleware.api, routes.views.blog);
	app.get('/blog/:post', routes.views.blogSingle);
	app.get('/blog/filter-by/:location', keystone.middleware.api, routes.api.blogFilter);


	app.get('/about', routes.views.about);


	app.get('/take-action', keystone.middleware.api, routes.views.takeAction);
	app.get('/take-action/category/:category', keystone.middleware.api, routes.views.takeActionCategories);
	app.get('/take-action/cps-events', keystone.middleware.api, routes.views.cpsEvents);
	app.get('/take-action/cps-events/:event', routes.views.cpsEventsSingle);
	app.get('/take-action/partner-events', keystone.middleware.api, routes.views.partnerEvents);
	app.get('/take-action/partner-events/:event', routes.views.partnerEventsSingle);


	app.get('/justice-champions', routes.views.justiceChampions);
	app.get('/justice-champions/:champion', routes.views.justiceChampionsSingle);


	// tag routes
	app.get('/tags', keystone.middleware.api, routes.views.tagPosts);


	// search routes
	app.get('/search', keystone.middleware.api, routes.views.searchForm);
	app.post('/search', keystone.middleware.api, routes.views.searchResults);


// CRON TASKS ==================
	app.all('/contact', routes.views.contact);

	app.all('/privacy', routes.views.privacy);

	app.get('/lang', routes.views.switchLanguages);

	// Mailchimp integration
	app.all('/newsletter-signup', routes.views.newsletterSignup);

	// Twitter Feed query
	app.all('/social/feed/twitter', routes.views.socialFeedTwitter);


	// get the window width, so that I can set for image sizes
	app.all('/window-width', keystone.middleware.api)

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
