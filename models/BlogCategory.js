var keystone = require('keystone');
var Types = keystone.Field.Types;


var BlogCategory = new keystone.List('BlogCategory', {
	autokey: { from: 'name', path: 'slug', unique: true },
	defaultColumns: 'name, locale, createdAt',
	track: true,
	label: "Categories"
});

BlogCategory.add({
	name: { type: String, required: true },
	locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true, initial: true},
});

BlogCategory.relationship({ path: 'name', ref: 'Blog', refPath: 'categories' });

BlogCategory.register();
