'use strict';

var router = require('express').Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GoogleSecrets = require('../../secret_keys').GoogleSecrets;

var User = require('../api/users/user.model');

router.get('/', passport.authenticate('google', {
	scope: 'email'
}));

router.get('/callback', passport.authenticate('google', {
	successRedirect: '/stories',
	failureRedirect: '/signup'
}));

passport.use(new GoogleStrategy(GoogleSecrets, function (token, refreshToken, profile, done) { 
	User.findOne({'google.id': profile.id }, function (err, user) {
		if (err) done(err);
		else if (user) done(null, user);
		else {
			var email = profile.emails[0].value;
			User.create({
				email: email,
				photo: profile.photos[0].value,
				name: profile.displayName,
				google: {
					id: profile.id,
					name: profile.displayName,
					email: email,
					token: token
				}
			}, done);
		}
	});
}));

module.exports = router;