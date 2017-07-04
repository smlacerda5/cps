var keystone = require('keystone');
var Types = keystone.Field.Types;

var Research = new keystone.List('Research', {
    map : { name : 'title' },
    autokey : { path : 'slug', from : 'title', unique : true },
    defaultSort: '-createdAt',
    defaultColumns: 'title, locale, state|15%, categories|15%, author|15%, createdAt|15%',
    track: true,
});

Research.add({
    title : {type : String, required : true },
    state : {type : Types.Select, options : 'draft, published, archived', default : 'draft', index : true},
    publishedDate : {type : Types.Datetime, index : true, dependsOn : {state : 'published'}, default: Date.now },
    locale: {type: Types.Select, options: ['en', 'es'], default: 'en', required: true},
    location: { type: Types.Relationship, ref: 'Location', many: false },
    author : {type : Types.Relationship, ref : 'User', index : true},
    categories : {type : Types.Relationship, ref : 'ResearchCategory', many : true, },
    tags: { type: Types.Relationship, ref: 'Tag', many: true },
    source: {type: String, note: 'Provide the name of the Source here'},
    sourceLink: {type: Types.Url, label: 'Link to Source', note: "Format should be http://linkHere.com", dependsOn: {source: true} },
    content : {
        brief: { type: Types.Textarea, height: 100,},
        extended: { type: Types.Html, wysiwyg: true, height: 300}
    },
});

if (process.env.NODE_ENV === "production") {
    var ogs = require('open-graph-scraper');
    Research.add({
        ogImage: {type: Types.Url, label: 'OpenGraph Image', 
        note: 'Leave blank. This will be automatically scraped from the Source URL upon saving.', 
        dependsOn: {source: true} },
    })
}

Research.schema.virtual('content.full').get(function () {
    return this.content.extended || this.content.brief;
});

Research.schema.virtual('url').get(function() {
    return '/research/' + this.slug;
});

Research.schema.pre('save', function(next) {
	// surround wsysiwyg content with a div class for styling purposes
	if (this.content.extended && this.content.extended.length > 0) {
        var front = this.content.extended.slice(0, 50);
        
        if (front.indexOf('extended') === -1) {
            this.content.extended = '<div class="extended-content">' + this.content.extended + '</div>';
        }
	}
    next();
});

Research.schema.pre('save', function (next) {
  // note you need to set 'this' to a locally scoped var
  // or you will lose reference to it inside subsequent functions (like ogs below)
  if(process.env.NODE_ENV == 'production') {
    var that = this;
    if(that.sourceLink && !that.ogImage) {
      ogs({url: this.sourceLink, timeout: 4000 }, function(err, results) {
        if(err) { console.log(err); next(); }
        that.ogImage = results.data.ogImage.url;
        next();
      });
    } else { next(); }
  } else { next(); }
});

Research.schema.virtual('type').get(function() {
	return 'research';
});

Research.register();
