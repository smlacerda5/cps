var keystone = require('keystone');
var Types = keystone.Field.Types;

var StoryCategory = new keystone.List('StoryCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	defaultColumns: 'name, locale, createdAt',
	track: true,
	label: "Categories"
});

StoryCategory.add({
	name: { type: String, required: true },
	locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true, initial: true},
});

StoryCategory.relationship({ path: 'name', ref: 'Story', refPath: 'categories' });

StoryCategory.register();
