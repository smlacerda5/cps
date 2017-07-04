var keystone = require('keystone');
var Types = keystone.Field.Types;

var Location = new keystone.List('Location', {
	autokey: { from: 'name', path: 'key', unique: true },
	defaultColumns: 'name, abbreviation, createdAt',
	track: true,
});

Location.add({
	name: { type: String, required: true , unique: true },
  abbreviation: { type: String, required: true, initial: true }
});

Location.relationship({ path: 'name', ref: 'Blog', refPath: 'location' });
Location.relationship({ path: 'name', ref: 'Press', refPath: 'location' });
Location.relationship({ path: 'name', ref: 'Story', refPath: 'location' });
Location.relationship({ path: 'name', ref: 'Research', refPath: 'location' });
Location.relationship({ path: 'name', ref: 'StateWork', refPath: 'location' })

Location.register();
