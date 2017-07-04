var keystone = require('keystone');
var Types = keystone.Field.Types;

var ResearchCategory = new keystone.List('ResearchCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	defaultColumns: 'name, locale, createdAt',
	track: true,
	label: "Categories"
});

ResearchCategory.add({
	name: { type: String, required: true },
	locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true, initial: true},
});

ResearchCategory.relationship({ path: 'name', ref: 'Research', refPath: 'categories' });

ResearchCategory.schema.virtual('category.url').get(function() {
    return '/research/category/' + this.key; 
});

ResearchCategory.register();