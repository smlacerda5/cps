var keystone = require('keystone');
var Types = keystone.Field.Types;

var TakeAction = new keystone.List('TakeAction', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, locale, state|15%, categories|15%, author|15%, createdAt|15%',
	track: true,
	label: 'Actions',
});

TakeAction.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true},
	publishedDate: { type: Types.Datetime, index: true, dependsOn: { state: 'published' }, default: Date.now },
	author: { type: Types.Relationship, ref: 'User' },
	categories: { type: Types.Relationship, ref: 'TakeActionCategory', many: true },
	content: {
		extended: { type: Types.Html, wysiwyg: true, height: 300}
	},
});

TakeAction.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

TakeAction.schema.pre('save', function(next) {
	// surround wsysiwyg content with a div class for styling purposes
	if (this.content.extended && this.content.extended.length > 0) {
			var front = this.content.extended.slice(0, 50);
			
			if (front.indexOf('extended') === -1) {
					this.content.extended = '<div class="extended-content">' + this.content.extended + '</div>';
			}
	}
  next();
});

TakeAction.schema.virtual('url').get(function() {
	return '/take-action/' + this.slug;
})

TakeAction.register();
