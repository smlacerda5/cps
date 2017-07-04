var keystone = require('keystone');
var mongoose = require('mongoose');
var fs = require('fs');

if (process.env.NODE_ENV === "production") {
  var graph = require('fbgraph');
}

var Promise = require('bluebird');

var request = Promise.promisify(require('request'));

function fbTokenRefresh() {
  return new Promise(function(fulfill,reject) {

    var fb_options = {
      method: 'get',
      url: 'https://graph.facebook.com/oauth/access_token',
      qs: {
        grant_type:    'client_credentials',
        client_id:     process.env.FB_CLIENT_ID,
        client_secret: process.env.FB_CLIENT_SECRET
      }
    }

    request(fb_options).then(function(data) {
      var token = data.body.split('=')[1]
      process.env.FB_TOKEN = token
      return fulfill(token);
    }).
    catch(function(error) {
      return reject(error);
    })

  })
}

function fbGraphData() {
  // returns a promise of graph dta
  // posts/?fields=
  var params = { 
    fields: "description,story,permalink_url,message,picture,shares,likes.summary(true),created_time,name",
    limit: 10
  }

  return new Promise(function(fulfill, reject) {
    graph.setAccessToken(process.env.FB_TOKEN)

    graph.get('1534039280204156/posts/', params, function(err, res) {
      if(err) return reject(err);
      return fulfill(res);
    })
  })
}

function fakeData() {
  return new Promise(function(fulfill, reject) {
    fs.readFile('./routes/sample_feed_data.json', 'utf8', function(err, data) {
      if(err) reject(err);

      var json = JSON.parse(data);
      fulfill(json);
    });
  })
}


exports = module.exports = function (req, res) {

  if(process.env.NODE_ENV == 'development') {
    console.log('FAKEFAKEFAKE')

    fakeData().then(function(data) {
      res.json(data);
    }).catch(function(err) { throw err; })

  } else {

    if(!process.env.FB_TOKEN) {

      fbTokenRefresh().then(function(token) {
        return fbGraphData()
      }).then(function(data) {
        res.json(data);
      }).catch(function(error) {
        throw error;
        res.json({error: 'SOMETHING WENT WRONG'})
      })

    } else {
      fbGraphData().then(function(data) {
        res.json(data);

      }).catch(function(error) {
        throw error;
      })
    }
  }
}



