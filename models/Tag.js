var keystone = require('keystone');
var Types = keystone.Field.Types;


var Tag = new keystone.List('Tag', {
	autokey: { from: 'name', path: 'slug', unique: true },
	defaultColumns: 'name, locale, createdAt',
	track: true,
});

Tag.add({
	name: { type: String, required: true },
	locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true, initial: true},
});

Tag.relationship({ path: 'blogs', ref: 'Blog', refPath: 'tags' });
Tag.relationship({ path: 'events', ref: 'Event', refPath: 'tags' });
Tag.relationship({ path: 'federalWork', ref: 'FederalWork', refPath: 'tags' });
Tag.relationship({ path: 'issues', ref: 'Issue', refPath: 'tags' });
Tag.relationship({ path: 'news', ref: 'News', refPath: 'tags' });
Tag.relationship({ path: 'press', ref: 'Press', refPath: 'tags' });
Tag.relationship({ path: 'research', ref: 'Research', refPath: 'tags' });
Tag.relationship({ path: 'stateWork', ref: 'StateWork', refPath: 'tags' });
Tag.relationship({ path: 'stories', ref: 'Story', refPath: 'tags' });

Tag.schema.virtual('url').get(function() {
    return '/tags?id=' + this._id;
});

Tag.register();
