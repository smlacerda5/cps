var keystone = require('keystone');
var Types = keystone.Field.Types;

var JusticeChampionNews = new keystone.List('JusticeChampionNews', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	defaultSort: '-createdAt',
	defaultColumns: 'title, locale, state|15%, categories|15%, author|15%, createdAt|15%',
	track: true,
	label: "News"
});

JusticeChampionNews.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	locale: { type: Types.Select, options: ['en', 'es'], default: 'en', required: true },
	champion: { type: Types.Relationship, ref: 'JusticeChampion', many: false },
	publishedDate: { type: Types.Datetime, index: true, dependsOn: { state: 'published' }, default: Date.now },
	author: { type: Types.Relationship, ref: 'User' },
	source: { type: String, required: true, initial: true },
	sourceLink: { type: Types.Url, required: true, initial: true, label: "URL for Event", note: "Format is http://something.com/location/of/event" },
});

JusticeChampionNews.schema.virtual('type').get(function() {
	return 'justice-champions';
});

JusticeChampionNews.register();
