// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone 	= require('keystone');

// // ======================================== //
// // ========= INTERNATIONALIZATION ========= //
// // ======================================== //
// CUSTOM MODULE
// var i18n 		= require('./i18n');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'The Coalition for Public Safety',
	'brand': 'The Coalition for Public Safety',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',

	'emails': 'templates/emails',

	// THIS IS EXTRA FUNCTIONALITY FOR
	// THE ADMIN TOOLBAR
	'wysiwyg override toolbar': false,
	'wysiwyg menubar': true,
	'wysiwyg skin': 'lightgray',
	'wysiwyg images': true,
	'wysiwyg cloudinary images' : true,
	'wysiwyg additional buttons': 'searchreplace visualchars,'
	+ ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
	+ ' emoticons media, preview print',
	'wysiwyg additional plugins': 'example, table, advlist, anchor,'
	+ ' autolink, autosave, charmap, contextmenu, '
	+ ' directionality, emoticons, hr, media, pagebreak,'
	+ ' preview, print, searchreplace, textcolor,'
	+ ' visualblocks, visualchars, wordcount, colorpicker',


	'auto update': true,
	'session': true,
	'session store': 'mongo',
	'auth': true,
	'user model': 'User',
	'cookie-secret' : 'the_coalition'
});

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});


// Load your project's Routes
keystone.set('routes', require('./routes'));

// keystone.set('i18n');

// forces cloudinary images to be served over https
keystone.set('cloudinary secure', true);


// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.
keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Load your project's email test routes
keystone.set('email tests', require('./routes/emails'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	// SET UP FOR ADMIN NAV
	// <tab_name> : <model_name>
	// <tab_name> CAN BE ANYTHING
	// <model_name> SHOULD BE EXACT NAME
	// OF MODEL/LIST OR A PLURAL LOWERCASE
	// VERSION
	"About":						['TeamMember'],
	"Blogs":			   		['Blog', 'BlogCategory'],
	"Enquiries":	 	 		'enquiries',
	"Events": 					['Event', 'PartnerEvent'],		
	"Galleries":				['Ally', 'Partner'],
	"Get Involved/Take Action":			['TakeAction', 'TakeActionCategory'],
	"Headers":					['AboutHeader', 'BlogHeader', 'EnquiryHeader', 'FederalWorkHeader', 'TakeActionHeader', 'HomeHeader', 'IssueHeader', 'JusticeChampionHeader', 'PressHeader', 'ReformInActionHeader', 'ResearchHeader', 'StateWorkHeader', 'TagHeader'],
	"Infographics": 		'Infographic', 
	"Justice Champions": ['JusticeChampion', 'JusticeChampionNews'],
	"Key Issues": 			['Issue'],
	"Media/Press":			['Press', 'PressCategory', 'News'],
	"Reform In Action":	['StateWork', 'FederalWork'],
	"Research":					['Research', 'ResearchCategory'],
	"Social Media": 		'SocialMedia',
	"Tags": 						['Tag'],
	"Voices of Reform/Stories":	['Story', 'StoryCategory', 'StoryBanner'],
	other:							['Location', 'Upload', 'User', 'Video'],
});

// Start Keystone to connect to your database and initialise the web server
keystone.start();


// ======================================== //
// ================ CRON  ================= //
// ======================================== //
require('./cron/search').start();
require('./cron/remove-overdue-events').start();