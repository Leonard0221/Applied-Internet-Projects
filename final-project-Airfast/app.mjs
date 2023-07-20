import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import sanitize from 'mongo-sanitize';
import bcrypt from 'bcryptjs';
import './db.mjs';
const app = express();
import url from 'url';
import session from 'express-session';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));

const Flight = mongoose.model('Flight');
const User = mongoose.model('User');
const Staff = mongoose.model('Staff');

const sessionOptions = { 
	secret: 'secrets of targaryen', 
	saveUninitialized: false, 
	resave: false 
};
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


const isAuthenticated = (req, res, next) => {
	// console.log('isAuthenticated?');
	if (req.session.user) {
		// User is authenticated, continue to next handler
		next();
	} else {
		// User is not authenticated, redirect to login page
		res.redirect('/login');
	}
};
  
const isAuthenticatedStaff = (req, res, next) => {
	if (req.session.user) {
		if (req.session.user.type === 'staff') {	
			next();
		} else {
			res.redirect('/login-staff');
		}
	}
};
app.get('/', (req, res) => {
	let isStaff = false;
	let isUser = false;
	if (req.session.user) {
		isStaff = req.session.user.type === 'staff' ? true : false;
		isUser = req.session.user.type === 'user' ? true : false;
	}
	const filter = {};
	if (req.query.departCity) {
		filter.departCity = req.query.departCity;
	}
	if (req.query.departureTime) {
		const departureDate = new Date(req.query.departureTime).toISOString().slice(0, 10);
		filter.departureTime = { $gte: new Date(departureDate) };
	}
	if (req.query.arrivalCity) {
		filter.arrivalCity = req.query.arrivalCity;
	}
	if (req.query.arrivalTime) {
		const arrivalDate = new Date(req.query.arrivalTime).toISOString().slice(0, 10);
		filter.arrivalTime = { $lte: new Date(arrivalDate + "T23:59:59.999Z") };
	}

	Flight.find(filter)
		.then(flightData => {
			res.render('index', { flight: flightData, name: req.session.name, user: req.session.user, isStaff, isUser });
		})
	.catch(err => res.status(500).send(err));	
});

app.post('/', isAuthenticated, async (req, res) => {
    let selectedFlightNumbers = req.body.flightIds || [];
	const name = req.session.user.name;
	const user = await User.findOne({name});
    // console.log(selectedFlightNumbers);
	// console.log(user.personalFlight);
    try {
        const existingFlightNumbers = new Set(user.personalFlight);
		if (user.personalFlight === undefined){
			user.personalFlight = selectedFlightNumbers;
			// console.log(user.personalFlight);
		} else {
			if (typeof(selectedFlightNumbers) === 'string'){
				selectedFlightNumbers = Array(selectedFlightNumbers);
			}
			const newFlightNumbers = selectedFlightNumbers.filter(
				(flightNumber) => !existingFlightNumbers.has(flightNumber)
			);
			user.personalFlight.push(...newFlightNumbers);
		}
		// console.log(user.personalFlight);
        await user.save();
		// console.log(user);
        res.redirect('/');
    } catch (err) {
        console.error("Error:", err);
        res.sendStatus(500);
    }
});


// app.get('/myFlight', isAuthenticated, async (req, res) => {
// 	const name = req.session.user.name;
// 	const user = await User.findOne({name});
// 	try {
// 		// console.log(user.personalFlight);

// 		const personalFlight = user.personalFlight || [];

// 		const flightData = await Flight.find({ flightNumber: { $in: personalFlight } });
// 		// console.log(flightData);
// 		res.render('myFlight', { flight: flightData });
// 	} catch (err) {
// 		console.error("Error:", err);
// 		res.sendStatus(500);
// 	}
// });

app.get('/myFlight', isAuthenticated, async (req, res) => {
	const name = req.session.user.name;
	const user = await User.findOne({name});
  
	try {
		const personalFlight = user.personalFlight || [];
		const flightData = await Flight.find({ flightNumber: { $in: personalFlight } }).lean();
	
		const validFlightData = (await Promise.all(
			flightData.map(({ flightNumber }) => Flight.findOne({ flightNumber }).lean())
		)).filter((foundFlight) => foundFlight !== null);
		res.render('myFlight', { flight: validFlightData });
		} catch (err) {
			console.error("Error:", err);
			res.sendStatus(500);
		}
});




app.post('/signup', function(req, res) {

	if (req.body.submit === 'signup-user') {
		res.redirect('/signup-user');
	} else if (req.body.submit === 'signup-staff') {
		res.redirect('/signup-staff');
	} else {
		res.render('signup');
	}
});
  
app.get('/signup', function(req, res) {
	res.render('signup');
});
app.get('/signup-user', (req, res) => {
	res.render('signup-user');
});
app.get('/signup-staff', (req, res) => {
	res.render('signup-staff');
});

app.post('/signup-user', async (req, res) => {
	const name = sanitize(req.body.name);
	const password = sanitize(req.body.password);
	const email = sanitize(req.body.email);
	const phoneNumber = sanitize(req.body.phoneNumber);
	const dateOfBirth = sanitize(req.body.dateOfBirth);
	req.body.personalFlight = new Array;
	try {
		const checkExist = await User.findOne({name});
		if (checkExist) {
			res.render('signup-user', {message: 'User exists.'});
			return;
		}
		const checkExist1 = await User.findOne({email});
		if (checkExist1) {
			res.render('signup-user', {message: 'Email exists.'});
			return;
		}
		const checkExist2 = await User.findOne({phoneNumber});
		if (checkExist2) {
			res.render('signup-user', {message: 'Phone number exists.'});
			return;
		}
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);
		const User1 = new User({
			name,
			email,
			password: hash,
			phoneNumber,
			dateOfBirth,
			personalFlight: req.body.personalFlight
		});
		await User1.save();
		req.session.user = {
			userId: User1._id,
			name: User1.name,
			type: 'user',
		};
		res.redirect('/');
		} catch (err) {
		if(err instanceof mongoose.Error.ValidationError) {
			res.render('signup-user', {message: err.message});
		} else {
			throw err;
		}
	}
});

app.post('/signup-staff', async (req, res) => {
	const name = sanitize(req.body.name);
	const password = sanitize(req.body.password);
	const email = sanitize(req.body.email);
	const phoneNumber = sanitize(req.body.phoneNumber);
	const dateOfBirth = sanitize(req.body.dateOfBirth);
	try {
		const checkExist = await Staff.findOne({name});
		if (checkExist) {
			res.render('signup-staff', {message: 'Staff exists.'});
			return;
		}
		const checkExist1 = await Staff.findOne({email});
		if (checkExist1) {
			res.render('signup-staff', {message: 'Email exists.'});
			return;
		}
		const checkExist2 = await Staff.findOne({phoneNumber});
		if (checkExist2) {
			res.render('signup-staff', {message: 'Phone number exists.'});
			return;
		}
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(password, salt);
		const Staff1 = new Staff({
			name,
			email,
			password: hash,
			phoneNumber,
			dateOfBirth
		});
		await Staff1.save();
		req.session.user = {
			userId: Staff1._id,
			name: Staff1.name,
			type: 'staff',
		};
		res.redirect('/');
		} catch (err) {
		if(err instanceof mongoose.Error.ValidationError) {
			res.render('signup-staff', {message: err.message});
		} else {
			throw err;
		}
	}
});

app.post('/login', function(req, res) {

	if (req.body.submit === 'login-user') {
		res.redirect('/login-user');
	} else if (req.body.submit === 'login-staff') {
		res.redirect('/login-staff');
	} else {
		res.render('login');
	}
});
  
app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/login-user', (req, res) => {
    res.render('login-user');
});

app.post('/login-user', async (req, res) => {
  const name = sanitize(req.body.name);
  const password = sanitize(req.body.password);
  try {
		const user = await User.findOne({name});
		if (!user) {
			res.render('login-user', { message: 'Cannot find the user.' });
			return;
		}
		const matching = await bcrypt.compare(password, user.password);
		if (matching === false) {
			res.render('login-user', { message: 'Username and password do NOT match.' });
			return;
		}
		req.session.user = {
			userId: user._id,
			name: user.name,
			type: 'user',
		};
		res.redirect(req.session.redirectPath || '/');
  } catch (err) {
		if(err instanceof mongoose.Error.ValidationError) {
			res.render('login-user', {message: err.message});
		} else {
			throw err;
		}
  }
});
app.get('/login-staff', (req, res) => {
    res.render('login-staff');
});

app.post('/login-staff', async (req, res) => {
	const name = sanitize(req.body.name);
	const password = sanitize(req.body.password);
	try {
		const staff = await Staff.findOne({name});
		if (!staff) {
			res.render('login-staff', { message: 'Cannot find the staff.' });
			return;
		}
		const matching = await bcrypt.compare(password, staff.password);
		if (matching === false) {
			res.render('login-staff', { message: 'Staffname and password do NOT match.' });
			return;
		}
		req.session.user = {
			userId: staff._id,
			name: staff.name,
			type: 'staff',
		};
		// console.log(req.session.user);
		res.redirect(req.session.redirectPath || '/');
	} catch (err) {
		if(err instanceof mongoose.Error.ValidationError) {
			res.render('login-staff', {message: err.message});
		} else {
			throw err;
		}
	}
});
app.post('/flight', function(req, res) {

	if (req.body.submit === 'addFlight') {
		res.redirect('/addFlight');
	} else if (req.body.submit === 'modFlight') {
		res.redirect('/modFlight');
	} else {
		res.render('flight');
	}
});
  
app.get('/flight', function(req, res) {
	res.render('flight');
});

app.get('/modFlight', isAuthenticatedStaff, isAuthenticated, async (req, res) => {
	let isStaff = false;
	let isUser = false;
	if (req.session.user) {
		isStaff = req.session.user.type === 'staff' ? true : false;
		isUser = req.session.user.type === 'user' ? true : false;
	}
	const filter1 = {};
	if (req.query.departCity) {
		filter1.departCity = req.query.departCity;
	}
	if (req.query.departureTime) {
		const departureDate = new Date(req.query.departureTime).toISOString().slice(0, 10);
		filter1.departureTime = { $gte: new Date(departureDate) };
	}
	if (req.query.arrivalCity) {
		filter1.arrivalCity = req.query.arrivalCity;
	}
	if (req.query.arrivalTime) {
		const arrivalDate = new Date(req.query.arrivalTime).toISOString().slice(0, 10);
		filter1.arrivalTime = { $lte: new Date(arrivalDate + "T23:59:59.999Z") };
	}

	Flight.find(filter1)
		.then(flightData => {
			res.render('modFlight', { flight: flightData, name: req.session.name, user: req.session.user, isStaff, isUser });
		})
	.catch(err => res.status(500).send(err));

});

app.post('/modFlight', isAuthenticatedStaff, isAuthenticated, async (req, res) => {
    try {
		const selectedFlightNumbers = req.body.flightIds;
		await Flight.deleteOne({ flightNumber: selectedFlightNumbers }); 
        res.redirect('/modFlight');
    } catch (err) {
        console.error("Error:", err);
        res.sendStatus(500);
    }
});

app.get('/addFlight', isAuthenticatedStaff, isAuthenticated, async (req, res) => {
	let isStaff = false;
	let isUser = false;
	if (req.session.user) {
		isStaff = req.session.user.type === 'staff' ? true : false;
		isUser = req.session.user.type === 'user' ? true : false;
	}
	res.render('addFlight', { user: req.session.user, isStaff, isUser });
});

app.post('/addFlight', isAuthenticatedStaff, isAuthenticated, async (req, res) => {
	const { airlineName, flightNumber, departCity, departureAirport, departureTime,
		arrivalCity,
		arrivalAirport,
		arrivalTime,
		price
	} = req.body;
	const existingAirline = await Flight.findOne({ flightNumber, departureTime });
	if (existingAirline) {
		return res.render('/addFlight', { message: 'Flight exists!' });
	}
	// Create new airline
	const newFlight = new Flight({
		airlineName: sanitize(airlineName),
		flightNumber: sanitize(flightNumber),
		departCity: sanitize(departCity),
		departureAirport: sanitize(departureAirport),
		departureTime: sanitize(departureTime),
		arrivalCity: sanitize(arrivalCity),
		arrivalAirport: sanitize(arrivalAirport),
		arrivalTime: sanitize(arrivalTime),
		price: sanitize(price)
	});
	try {
		await newFlight.save();
		res.redirect('/');
	} catch (err) {
		console.log(err); // log the error
		if (err instanceof mongoose.Error.ValidationError) {
			res.render('addFlight', { message: err.message });
		} else {
			throw err;
		}
	}
});


app.get('/logout', async (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err);
		}
		res.redirect('/');
	});
});

app.listen(process.env.PORT || 26314);


// db.flights.insert({ airlineName: "Spirit", 
// flightNumber: "SP123", 
// departCity: "New York",
// departureAirport: "JFK", 
// departureTime: new Date("2023-04-01T14:30"), 
// arrivalCity: "Los Angeles", 
// arrivalAirport: "AWS", 
// arrivalTime: new Date("2023-04-01T19:30"), 
// price: 200
// });

// db.flights.insert({ airlineName: "Blue Jet", 
// flightNumber: "BJ234", 
// departCity: "Boston",
// departureAirport: "LGN", 
// departureTime: new Date("2023-04-01T14:30"), 
// arrivalCity: "Austin", 
// arrivalAirport: "Tex", 
// arrivalTime: new Date("2023-04-01T19:30"), 
// price: 300
// });
