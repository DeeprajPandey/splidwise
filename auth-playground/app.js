const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');

// initialize the passport google strategy
const passportSetup = require('./authConfig/passport-setup');

app = express();

// set view engine
app.set('view engine', 'ejs');

app.use(cookieSession({
	maxAge: 24 * 60 * 60 * 1000, // 1 day
	secret: "thisismysecretplsdonttrytoknowthisoryouwillbekilledbyidf"
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// sub-routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', (req, res) => {
	res.render("index");
});

// run the server
const port = 3000;
app.listen(port, () => {
	console.log(`now listening for requests on port ${port}`);
});