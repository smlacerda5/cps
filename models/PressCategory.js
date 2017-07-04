var keystone = require('keystone');
var Types = keystone.Field.Types;

var PressCategory = new keystone.List('PressCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	defaultColumns: 'name, locale, createdAt',
	track: true,
	label: "Categories"
});

PressCategory.add({
	name: { type: String, required: true },
	locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true, initial: true},
});

PressCategory.relationship({ path: 'name', ref: 'Press', refPath: 'categories' });

PressCategory.schema.virtual('category.url').get(function() {
    return '/media/press-release/category/' + this.key; 
})

PressCategory.register();