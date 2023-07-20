import express from 'express';
import mongoose from 'mongoose';
import './db.mjs';
const Review = mongoose.model('Review');
const app = express();
import session from 'express-session';
// const temp = new Array;

// set up express static
import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

// configure templating to hbs
app.set('view engine', 'hbs');

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

const sessionOptions = { 
	secret: 'secrets of targaryen', 
	saveUninitialized: false, 
	resave: false 
};

app.use(session(sessionOptions));

app.get('/', (req, res) => {
  const filter = {};
  if (req.query.year) {
    filter.year = req.query.year;
  }
  if (req.query.professor) {
    filter.professor = req.query.professor;
  }
  if (req.query.semester && req.query.semester !== "All") {
    filter.semester = req.query.semester;
  }
  Review.find(filter)
    .then(reviewData => {
      // console.log(reviewData);
      res.render('review', { Review: reviewData });
    })
    .catch(err => res.status(500).send(err));
  
});

app.get('/reviews/add', (req, res) => {
  res.render('add');
});

app.post('/reviews/add', (req, res) => {
  new Review({
    courseNumber: req.body.courseNumber,
    courseName: req.body.courseName,
    semester: req.body.semester,
    year: req.body.year,
    professor: req.body.professor,
    review: req.body.review
  }).save().then(
    res.redirect('/')
);
});



// app.get('/reviews/mine', (req, res) => {
//   //
// });


app.listen(process.env.PORT || 3000);
console.log("On port 3000");


// db.reviews.insert({ courseNumber: "CSCI-UA.0480", courseName: "AIT", semester: "Spring", year: 2018, professor: "Versoza", review: "The answer is always undefined" });
// db.reviews.insert({ courseNumber: "CSCI-UA.0002", courseName: "Intro To Computer Programming", semester: "Fall", year: 2018, professor: "Foobarbaz", review: "OMG you have to take this course" });