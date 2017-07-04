var cron 					= require('node-cron');
var async					= require('async');
var keystone 			= require('keystone');

function removeOverdueEvents() {
	// removes events that are passed due
	var now = new Date();

	async.waterfall([
		function(callback) {
			keystone.list('Event').model.remove({eventDate: {$lt: now}}, function(err) {
				if (err) callback(err);
				callback(null);
			})
		},
		function(callback) {
			keystone.list('PartnerEvent').model.remove({eventDate: {$lt: now}}, function(err) {
				if (err) callback(err);
				callback(null);
			})
		},
	],
		function(err, results) {
			if (err) {
				console.log(err);
			} 
		}
	)
}

var task = cron.schedule('0 0 23 * * *', removeOverdueEvents, false);

exports = module.exports = task;
