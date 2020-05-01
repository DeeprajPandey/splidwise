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
		console.info("### Adding new user", emailID, name);
		let userInfo = await registerNewUser(emailID, name);
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

async function registerNewUser(emailID, name) {
	let registerUserArg = {
		username: emailID,
		info: {
			name: name,
			p_hash: "hello"
		}
	};
	let walletResp = await fabric.registerUser(registerUserArg);
	
	let networkObj = await fabric.connectAsUser(emailID);
	if ("error" in networkObj) {
        // can happen if there are issues with CA setup
        throw Error("Couldn't connect to network.");
    }

    let contractResponse = await fabric.invoke('addUser', [emailID, JSON.stringify(registerUserArg.info)], false, networkObj);
    if ("error" in contractResponse) {
    	throw Error("Fabric txn failed.");
    }

    return contractResponse;
}











