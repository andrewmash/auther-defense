'use strict';

var router = require('express').Router(),
	_ = require('lodash');

var HttpError = require('../../utils/HttpError');
var User = require('./user.model');

router.param('id', function (req, res, next, id) {
	User.findById(id).exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		req.requestedUser = user;
		next();
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	// if (req.user) {
		User.find({}).exec()
		.then(function (users) {
			res.json(users);
		})
		.then(null, next);
	// } else res.redirect('http://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

router.post('/', function (req, res, next) {
	if (!req.user) {
		User.create(req.body)
		.then(function (user) {
			res.status(201).json(user);
		})
		.then(null, next);
	} else res.redirect('http://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

router.get('/:id', function (req, res, next) {
	if (req.user) {
		req.requestedUser.getStories()
		.then(function (stories) {
			var obj = req.requestedUser.toObject();
			obj.stories = stories;
			res.json(obj);
		})
		.then(null, next);
	} else res.redirect('http://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

router.put('/:id', function (req, res, next) {
	if (req.user.isAdmin || req.user._id === req.requestedUser._id) {
		_.extend(req.requestedUser, req.body);
		req.requestedUser.save()
		.then(function (user) {
			res.json(user);
		})
		.then(null, next);
	} else res.redirect('http://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

router.delete('/:id', function (req, res, next) {
	if (req.user.isAdmin || req.user._id === req.requestedUser._id) {
		req.requestedUser.remove()
		.then(function () {
			res.status(204).end();
		})
		.then(null, next);
	} else res.redirect('http://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

module.exports = router;