'use strict';

var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');

function isThereNotAUser(req, res, next) {
	if (!req.user) next();
	else res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
}

function isThereAUser(req, res, next) {
	if (req.user) next();
	else res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
}

router.post('/login', isThereNotAUser, function (req, res, next) {
	User.findOne(req.body).exec()
	.then(function (user) {
		if (!user) throw HttpError(401);
		req.login(user, function () {
			res.json(user);
		});
	})
	.then(null, next);
});

router.post('/signup', isThereNotAUser, function (req, res, next) {
	if (!req.user) {
	req.body.isAdmin = false;
	User.create(req.body)
	.then(function (user) {
		req.login(user, function () {
			res.status(201).json(user);
		});
	})
	.then(null, next);
	} 
});

router.get('/me', function (req, res, next) {
	res.json(req.user);
});

router.delete('/me', isThereAUser, function (req, res, next) {
	req.logout();
	res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;