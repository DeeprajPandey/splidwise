const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

let fabric = require('../services/fabric.js');
let keys = require('./keys.js');

// passport serialize and de-serialize methods
passport.serializeUser((userInfo, done) => {
	done(null, userInfo);
});

passport.deserializeUser((userInfo, done) => {
	done(null, userInfo);
});

const strategyConfigOptions = {
	clientID: keys.google.clientID,
	clientSecret: keys.google.clientSecret,
	callbackURL: '/auth/google/login/redirect'
};

const verifyCallback = async (accessToken, refreshToken, profile, done) => {
	let emailID = profile._json.email;
	let name = profile._json.name;

	let isUserExists = await userExistsAlready(emailID);

	if (isUserExists) {
		console.info("### Logging in user", emailID, name);
		let userInfo = await fetchUserFromWorldState(emailID);
		let user = {
			email: emailID,
			picture: profile._json.picture
		};
		done(null, user);
	} else { // new user!
		console.info("Unregistered user");
		done(null, false, {
			reason: "unregistered"
		});
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







