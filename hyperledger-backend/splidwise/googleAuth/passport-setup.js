const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

let fabric = require('../services/fabric.js');

// passport serialize and de-serialize methods
passport.serializeUser((userInfo, done) => {
	done(null, userInfo);
});

passport.deserializeUser((userInfo, done) => {
    done(null, userInfo);
});

const strategyConfigOptions = {
	clientID: '696207118325-lhitvdvpfveadmaaosq8mds3ltlj2ufi.apps.googleusercontent.com',
	clientSecret: 'eHeN7sOVpf-t6DtBORcOt_tt',
	callbackURL: '/auth/google/redirect'
};

const verifyCallback = async (accessToken, refreshToken, profile, done) => {

	let emailID = "user3@ashoka.edu" || profile._json.email;

	let isUserExists = await userExistsAlready(emailID);

	if (isUserExists) {
		let userInfo = await fetchUserFromWorldState(emailID);
		let user = {
			email: emailID,
			picture: profile._json.picture
		};
		done(null, user);
	}
};

passport.use('google-login', new GoogleStrategy(strategyConfigOptions, verifyCallback));

async function userExistsAlready(emailID) {
	let networkObj = await fabric.connectAsUser(emailID);
	if ("error" in networkObj) {
	    return false;
	}
	return true;
}

async function fetchUserFromWorldState(emailID) {
	let networkObj = await fabric.connectAsUser(emailID);
	const contractResponse = await fabric.invoke('getUserData', [emailID, "hello"], true, networkObj);

	if ("error" in contractResponse) {
	    throw Error(contractResponse.error);
	}

	return contractResponse;
}











