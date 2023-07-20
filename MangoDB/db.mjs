import mongoose from 'mongoose';

// OPTIONAL: modify the connection code below if
// using mongodb authentication
// const mongooseOpts = {
//   useNewUrlParser: true,  
//   useUnifiedTopology: true
// };


mongoose.connect('mongodb://localhost/hw05').catch(error => console.log(error));

// TODO: create schema and register models

const Review = new mongoose.Schema({
  courseNumber: String,
  courseName: String,
  semester: String,
  year: Number,
  professor: String,
  review: String
});

mongoose.model('Review', Review);

