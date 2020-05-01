const router = require('express').Router();
const passport = require('passport');
const queryString = require('query-string');

const googleAuthenticateOptions = {
	scope: ['profile', 'email']
}

router.get('/google', passport.authenticate('google-login', googleAuthenticateOptions));

router.get('/google/redirect', passport.authenticate('google-login'), (req, res) => {
	// on successfull login, redirect to: /#/app?u=email&url=pictureURL
	let urlParams = {
		u: req.user.email,
		url: req.user.picture
	};
	let stringifiedParams = queryString.stringify(urlParams);
	res.redirect(`/app?${stringifiedParams}`);
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;