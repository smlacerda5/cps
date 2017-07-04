var keystone    = require('keystone');
var Types       = keystone.Field.Types;

var SocialMedia = new keystone.List('SocialMedia', {
    map : { name : 'title' },
    autokey : { path : 'slug', from : 'title', unique : true },
    defaultColumns:  'client_id|15%, client_secret|15%, base_url, grant_uri, token',
    track: true,
});

SocialMedia.add({
  title :         { type : String, required : true, },
  service :       { type : Types.Select,
                    options: ['Facebook', 'Twitter'],
                    initial : false
                  },
  account :       { type : String },
  client_id :     { type : String },
  client_secret : { type : String },
  token :         { type : String },
  feed_uri :      { type : String },
  base_url :      { type : Types.Url },
  grant_uri :     { type : String },
});

// Social.schema.methods.request_token = function() {
//   console.warn('THE SERVICE : ' + this.service);
//   requester.getToken(this.service);
// };

SocialMedia.register();