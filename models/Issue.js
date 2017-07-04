var keystone = require('keystone');
var Types = keystone.Field.Types;

var Issue = new keystone.List('Issue', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, locale, state|15%, categories|15%, author|15%, createdAt|15%',
	track: true,
});

Issue.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	locale: { type: Types.Select, options: ['en', 'es'], default: 'en', required: true },
	publishedDate: { type: Types.Datetime, index: true, dependsOn: { state: 'published' }, default: Date.now },
	author: { type: Types.Relationship, ref: 'User' },
	tags: { type: Types.Relationship, ref: 'Tag', many: true },
	cloudImage: { label: "Cloud Image", type: Types.CloudinaryImage, note: "Width should be at least 1800px."},
	image : {
		type : Types.LocalFile,
		note: "Width should be at least 1800px.",
		dest : 'public/images/key-issues/',
		prefix : '/images/key-issues/',
		filename : function (item, file) {
			return file.originalname;
		},
		format : function (item, file) {
			return 'img src="' + item.prefix + item.filename + '"';
		}
	},
	stat1:				{ label: 'Stat 1', type: String },
	stat1Label: 	{ label: 'Stat 1 Label', type: String, dependsOn: 'stat1' },
	stat2:				{ label: 'Stat 2', type: String, dependsOn: 'stat1'},
	stat2Label: 	{ label: 'Stat 2 Label', type: String, dependsOn: 'stat2'},
	stat3:				{ label: 'Stat 3', type: String, dependsOn: 'stat2'},
	stat3Label: 	{ label: 'Stat 3 Label', type: String, dependsOn: 'stat3'},
	overview: 		{ label: 'Stat Overview', type: Types.Textarea, height: 300, note: "300 character limit." },
	content: {
		brief: 		{ type: Types.Textarea, height: 100},
		extended: { type: Types.Html, wysiwyg: true, height: 300 },
	},
});

// image urls
var imageUrls = require('./plugins/image-url');
Issue.schema.plugin(imageUrls, {path: '/images/key-issues/'});

Issue.schema.pre('save', function(next) {
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
Issue.schema.plugin(excerptPlugin);

Issue.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Issue.schema.virtual('type').get(function() {
	return 'key-issue';
});

Issue.schema.virtual('url').get(function() {
    return '/issues/' + this.slug;
})

Issue.register();
