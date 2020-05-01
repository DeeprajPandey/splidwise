const router = require('express').Router();

const authCheck = (req, res, next) => {
	if (!req.user) {
		res.status(401);
		return res.send('unauthorized access');
	}
	else {
		return next();
	}
};

router.get('/', authCheck, (req, res) => {
	res.render('profile', {username: req.user.displayName});
});

module.exports = router;