var keystone = require('keystone');
var mongoose = require('mongoose');
var fs = require('fs');
var Twit = require('twit');

var T = new Twit({
    consumer_key:         process.env.TWIT_KEY,
    consumer_secret:      process.env.TWIT_SECRET,
    app_only_auth:        true,
    timeout_ms:           60*1000,  
})

var Promise = require('bluebird');

exports = module.exports = function (req, res) {
  if(process.env.NODE_ENV == 'production') {
    TwitStatusData().then(function(data) {
      res.json({data: data})
    })
  } else {
    fakeData().then(function(data) {
      res.json({data: data})
    })
  }
}
///1.1/statuses/user_timeline.json?count=200&exclude_replies=true&include_rts=true&screen_name=publicsafety

function TwitStatusData() {
  var query_fields = {
    screen_name: 'publicsafety',
    count:  10,
    exclude_replies: true,
    include_rts: true,
  }

  return new Promise(function(fulfill, reject) {

    T.get('statuses/user_timeline', query_fields, function(err, data, response) {
      if(err) return reject(err);
      return fulfill(data)
    })
  }).catch(function(err) { throw (err) })
}

function fakeData() {
  return new Promise(function(fulfill, reject) {
    fs.readFile('./routes/sample_twitter_feed_data.json', 'utf8', function(err, data) {
      if(err) reject(err);
      fulfill(JSON.parse(data));
    });
  })
}




