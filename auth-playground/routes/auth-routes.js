const router = require('express').Router();
const passport = require('passport');

const googleAuthenticateOptions = {
	scope: ['profile', 'email']
}

const alreadyLoggedin = (req, res, next) => {
	if (req.user) {
		return res.redirect('/profile');
	}
	else {
		next();
	}
};

router.get('/google', alreadyLoggedin, passport.authenticate('google-login', googleAuthenticateOptions));

router.get('/google/redirect', passport.authenticate('google-login'), (req, res) => {
	// res.redirect("/profile");
	res.send({hi: "hi"});
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});


module.exports = router;