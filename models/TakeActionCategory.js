var keystone = require('keystone');
var Types = keystone.Field.Types;

var TakeActionCategory = new keystone.List('TakeActionCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	defaultColumns: 'name, locale, createdAt',
	track: true,
	label: "Categories"
});

TakeActionCategory.add({
	name: { type: String, required: true },
	locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true, initial: true},
});

TakeActionCategory.relationship({ path: 'name', ref: 'TakeAction', refPath: 'categories' });

TakeActionCategory.schema.virtual('category.url').get(function() {
    return '/take-action/category/' + this.key; 
});


TakeActionCategory.register();