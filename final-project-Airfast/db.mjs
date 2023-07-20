import mongoose from 'mongoose';
// is the environment variable, NODE_ENV, set to PRODUCTION? 
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import url from 'url';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
let dbconf, adminKey;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
    const fn = path.join(__dirname, 'config.json');
    const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
    adminKey = conf.adminKey;
} else {
 // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb://localhost/final'; 
}
mongoose.connect(dbconf).catch(error => console.log(error));

const User = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    phoneNumber: Number,
    dateOfBirth: Date,
    personalFlight: Array
});


const Staff = new mongoose.Schema({
    email: String,
    name: String,
    password: String,
    phoneNumber: Number,
    dateOfBirth: Date
});


const Flight = new mongoose.Schema({
    airlineName: String,
    flightNumber: String,
    departCity: String,
    departureAirport: String,
    departureTime: Date,
    arrivalCity: String,
    arrivalAirport: String,
    arrivalTime: Date,
    price: Number
});


mongoose.model('Flight', Flight);
mongoose.model('User', User);
mongoose.model('Staff', Staff);


export const createUser = async (newUser, callback) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        newUser.save(callback);
    } catch (err) {
        console.error(err);
    }
  };
  
export const getUserByUsername = (username, callback) => {
    const query = { name: username };
    User.findOne(query, callback);
};

export const comparePassword = async (candidatePassword, hash, callback) => {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, hash);
        callback(null, isMatch);
    } catch (err) {
        console.error(err);
    }
};

export {adminKey};