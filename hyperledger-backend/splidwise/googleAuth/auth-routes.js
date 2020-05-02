const router = require('express').Router();
const passport = require('passport');
const queryString = require('query-string');

const googleAuthenticateOptions = {
	scope: ['profile', 'email']
}

router.get('/google/login', passport.authenticate('google-login', googleAuthenticateOptions));
router.get('/google/register', passport.authenticate('google-register', googleAuthenticateOptions));

router.get('/google/login/redirect', (req, res, next) => {

	let loginHandler = passport.authenticate('google-login', function(err, user, info) {
	    if (err) {
	    	return next(err);
	    }

	    if (!user) { // happens when the user is a new (unregistered) user
	    	res.status(400);
	    	return res.redirect(`/?r=${info.reason}`);
	    }

	    req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}

			// on successfull login, redirect to: /#/app?u=email&url=pictureURL
			let urlParams = {
				u: user.email,
				url: user.picture
			};
			let stringifiedParams = queryString.stringify(urlParams);
			return res.redirect(`/app?${stringifiedParams}`);
	    });
	});

	loginHandler(req, res, next);
});

router.get('/google/register/redirect', (req, res, next) => {

	let registerHandler = passport.authenticate('google-register', function(err, user, info) {
	    if (err) {
	    	return next(err);
	    }

	    if (!user) { // happens when the user is an already registered user
	    	res.status(400);
	    	return res.redirect(`/?r=${info.reason}`);
	    }

	    req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}

			// on successfull login, redirect to: /#/app?u=email&url=pictureURL
			let urlParams = {
				u: user.email,
				url: user.picture
			};
			let stringifiedParams = queryString.stringify(urlParams);
			return res.redirect(`/app?${stringifiedParams}`);
	    });
	});

	registerHandler(req, res, next);
});


router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;