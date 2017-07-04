var keystone = require('keystone');
// var jade = require('jade');

exports = module.exports = function (req, res) {
	req.session.locale = req.query.locale;

	res.status(200).send({msg: "Switch successful!"});
};
