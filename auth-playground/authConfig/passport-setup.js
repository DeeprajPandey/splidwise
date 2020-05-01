const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport serialize and de-serialize methods
passport.serializeUser((userProfile, done) => {
	done(null, userProfile);
});

passport.deserializeUser((userProfile, done) => {
    done(null, userProfile);
});

const strategyConfigOptions = {
	clientID: '696207118325-lhitvdvpfveadmaaosq8mds3ltlj2ufi.apps.googleusercontent.com',
	clientSecret: 'E1kaWPw7ECsfnrO2c-XYbgwW',
	callbackURL: '/auth/google/redirect'
};

const verifyCallback = (accessToken, refreshToken, profile, done) => {
	// console.log(profile);

	// either this is a returning user or a new user - make a call to the world state
		// getUserData - error is user not exists
	// if error:
		// call registerUser

	// information about the logged in user
	// this info is made available to all the routes (i.e. the application)
	done(null, profile);
};

passport.use('google-login', new GoogleStrategy(strategyConfigOptions, verifyCallback));