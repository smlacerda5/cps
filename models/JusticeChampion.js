var keystone = require('keystone');
var Types = keystone.Field.Types;

var JusticeChampion = new keystone.List('JusticeChampion', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, locale, state|15%, categories|15%, author|15%, createdAt|15%',
	track: true,
	label: "Champions"
});

JusticeChampion.add({
	name: { type: String, required: true },
	jobTitle: { type: String },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	locale: { type: Types.Select, options: ['en', 'es'], default: 'en', required: true },
	forDate: { type: Types.Date },
	sex: { type: Types.Select, options: ['male', 'female']},
	tags: { type: Types.Relationship, ref: 'Tag', many: true },
	cloudImage: { label: "Cloud PNG Image Without Background", type: Types.CloudinaryImage, note: "Width should be at least 600px."},
	image : {
		label: 'Local PNG Image Without Background',
		type : Types.LocalFile,
		note: "Width should be at least 600px.",
		dest : 'public/images/justice-champions/',
		prefix : '/images/justice-champions/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return 'img src="' + item.prefix + item.filename + '"';
		}
	},
	cloudImageBg: { label: "Cloud Image With A Background", type: Types.CloudinaryImage, note: "Width should be at least 600px."},
	imageBg : {
		label: 'Local Image With A Background',
		type : Types.LocalFile,
		note: "Width should be at least 600px.",
		dest : 'public/images/justice-champions/',
		prefix : '/images/justice-champions/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return 'img src="' + item.prefix + item.filename + '"';
		}
	},
	content: {
		overview:		{ label: 'Header Overview', type: Types.Html, wysiwyg: true, height: 300, note: 'Div tags will be used to separate content.' },
		quote: { label: 'Quote', type: Types.Html, wysiwyg: true, height: 300 },
		extended: { type: Types.Html, wysiwyg: true, height: 300 },
	},
});

JusticeChampion.relationship({ path: 'name', ref: 'JusticeChampionNews', refPath: 'champion' });

// image urls
var imageUrls = require('./plugins/image-url');
var options = {path: '/images/justice-champions/'};

JusticeChampion.schema.plugin(imageUrls, options);


// urls to handle images with bg's that go in thumbnails
JusticeChampion.schema.virtual('small_url_bg').get(function() {
	if(this.cloudImageBg.url) {
		return this._.cloudImageBg.fit(800, 700);
	} else if (this.imageBg && this.imageBg.filename) {
		return options.path + this.imageBg.filename;
	} else {
		return null;
	}
})

JusticeChampion.schema.virtual('thumbnail_url_bg').get(function() {
	if(this.cloudImageBg.url) {
		return this._.cloudImageBg.fit(500, 500);
	} else if (this.imageBg && this.imageBg.filename) {
		return options.path + this.imageBg.filename;
	} else {
		return null;
	}
});

JusticeChampion.schema.pre('save', function(next) {
	// surround wsysiwyg content with a div class for styling purposes
	if (this.content.extended && this.content.extended.length > 0) {
		var front = this.content.extended.slice(0, 50);
			
		if (front.indexOf('extended') === -1) {
			this.content.extended = '<div class="extended-content">' + this.content.extended + '</div>';
		}
	}

	if (this.content.brief && this.content.brief.length > 0) {
		var ptag = this.content.brief.slice(0, 50);
		if (ptag.indexOf('<p>') === -1) {
			this.content.brief = '<p>' + this.content.brief.slice(0, 301) + '</p>';
		} else {
			this.content.brief = this.content.brief.slice(0, 301);
		}
	}

	if (this.overview && this.overview.length > 0) {
		this.overview = this.overview.slice(0, 301);
	}
  next();
});

// plugin that returns a no html excerpt
var excerptPlugin = require('./plugins/excerpt');
JusticeChampion.schema.plugin(excerptPlugin);

JusticeChampion.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

JusticeChampion.schema.virtual('type').get(function() {
	return 'justice-champions';
});

JusticeChampion.schema.virtual('url').get(function() {
    return '/justice-champions/' + this.slug;
})

JusticeChampion.register();
