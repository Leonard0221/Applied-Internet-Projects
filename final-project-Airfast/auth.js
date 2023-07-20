// These are the code snippets copied from app.mjs, for the sake of the grading purposes, not used in app.mjs.
// This part can not be run.
// The code is inspired by: https://www.youtube.com/watch?v=F-sFp_AvHc8&t=8474s
// this part is not supposed to be eslint-checked.
import passport from 'passport';
import passportLocal from 'passport-local';

const userField = {
	name: "userName",
	password: "123456"
};
const verifyCallback = (username, password, done) => {
	User.findOne({ name: username })
	.then((user) => {
		if (!user) { return done(null, false, { message: 'Incorrect username.' }); }
		// Compare passwords using bcrypt
		console.log(password);
		console.log(user.password);
		const result1 = bcrypt.compare(password, user.password);
		if (result1) {
			// Authentication succeeded
			return done(null, user);
		} else {
			// Authentication failed
			return done(null, false, { message: 'Incorrect password.' });
		}
	})
	.catch((err) => {
		done(err);
	});
};
const LocalStrategy = passportLocal.Strategy;

const strategy = new LocalStrategy(userField, verifyCallback);

passport.use(strategy);

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
  

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((userId, done) => {
	User.findById(userId)
	.then((user) =>	{
		done(null, user);
	})
	.catch(err => {
		done(err);
	});
});


app.use((req, res, next) => {
	res.locals.user = req.session.user;
	next();
});