var keystone = require('keystone');
var Types = keystone.Field.Types;

var SearchResults = new keystone.List('SearchResults', {
    map : { name : '_id', unique: true },
    autokey : { path : 'slug', from : '_id', unique : true },
    defaultSort: '-createdAt',
    defaultColumns: 'title, locale, state|15%, categories|15%, author|15%, createdAt|15%',
    hidden: true,
    index: true,
});

SearchResults.add({
    refId: {type: String, hidden: true, unique: true },
    url: { type: String, hidden: true, unique: true },
    title : {type : String, required : true, initial: true, index: true },
    state : {type : Types.Select, options : 'draft, published, archived', default : 'published', index : true},
    publishedDate : {type : Types.Datetime, index : true, dependsOn : {state : 'published'}, default: Date.now },
    locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true},
    location: { type: Types.Relationship, ref: 'Location', many: false },
    author : {type : Types.Relationship, ref : 'User', index : true},
    categories : {type : Types.Relationship, ref : 'SearchResultsCategory', many : true, },
    tags: { type: Types.Relationship, ref: 'Tag', many: true },
    source: {type: String, },
    sourceLink: {type: Types.Url, label: 'Link to Source', },
    brief: { type: String, height: 100 },
    extended: { type: String, wysiwyg: true, height: 300 }
});

// plugin that returns a no html excerpt
var excerptPlugin = require('./plugins/excerpt');
SearchResults.schema.plugin(excerptPlugin);

SearchResults.schema.virtual('sourceLinkUrl').get(function() {
    if (/.*:\/\//.test(this.sourceLink)) {
        return this.sourceLink;
    } else {
        return 'http://' + this.sourceLink;
    }
});

SearchResults.register();