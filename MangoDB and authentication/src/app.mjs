import express from 'express';
import mongoose from 'mongoose';
import sanitize from 'mongo-sanitize';
import './db.mjs';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import path from 'path';
import url from 'url';
import {startAuthenticatedSession, endAuthenticatedSession} from './auth.mjs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

const Article = mongoose.model('Article');
const User = mongoose.model('User');

const authRequired = (req, res, next) => {
  if(!req.session.user) {
    req.session.redirectPath = req.path;
    res.redirect('/login'); 
  } else {
    next();
  }
};

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.get('/', async (req, res) => {
  const articles = await Article.find({}).sort('-createdAt').exec();
  res.render('index', {user: req.session.user, home: true, articles: articles});
});

app.get('/article/add', authRequired, (req, res) => {
  res.render('article-add');
});

app.post('/article/add', authRequired, async (req, res) => {
  const article = new Article({
    title: sanitize(req.body.title), 
    url: sanitize(req.body.url), 
    description: sanitize(req.body.description),
    user: req.session.user._id
  });

  try {
    await article.save();
    res.redirect('/'); 
  } catch (err) {
    if(err instanceof mongoose.Error.ValidationError) {
      res.render('article-add', {message: err.message});
    } else {
      throw err;
    }
  }
});

// TODO: add a route handler for /article/some-article-title  
// use populate to get associated user

app.get('/article/:slug', async (req, res) => {
  try {
    const findArticle = await Article.findOne({ slug: req.params.slug }).populate('user').exec();
    if (!findArticle) {
      return res.render('error', { message: 'Article is not found.' });
    }
    res.render('article-detail', { user: req.session.user, article: findArticle });
  } catch (err) {
    res.render('error', { message: err });
  }
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const username = sanitize(req.body.username);
  const password = sanitize(req.body.password);
  const email = sanitize(req.body.email);

  try {
    // TODO: finish implementation
    const checkExist = await User.findOne({username});
    if (checkExist) {
      res.render('register', {message: 'User exists.'});
      return;
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const User1 = new User({
      username,
      email,
      password: hash,
    });
    await User1.save();
    await startAuthenticatedSession(req, User1);
    res.redirect('/');
  } catch (err) {
    if(err instanceof mongoose.Error.ValidationError) {
      res.render('register', {message: err.message});
    } else {
      throw err;
    }
  }
});
        
app.post('/logout', async (req, res) => {
  await endAuthenticatedSession(req);
  res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
  const username = sanitize(req.body.username);
  const password = sanitize(req.body.password);
  try {
    // TODO: finish implementation
    const user = await User.findOne({username});
    if (!user) {
      res.render('login', { message: 'Cannot find the user.' });
      return;
    }
    const matching = await bcrypt.compare(password, user.password);
    if (matching === false) {
      res.render('login', { message: 'Username and password do NOT match.' });
      return;
    }
    await startAuthenticatedSession(req, user);
    console.log(req.session);
    console.log(req.session.redirectPath);
    res.redirect(req.session.redirectPath || '/');
  } catch (err) {
    if(err instanceof mongoose.Error.ValidationError) {
      res.render('login', {message: err.message});
    } else {
      throw err;
    }
  }
});

app.get('/restricted', authRequired, (req, res) => {
  let message = '<span class="error">this page is not 4 u (plz <a href="login">login</a> first)</span>';
  if(req.session.user) {
      message = '<span class="success">you are logged in, so you can see secret stuff</span>';
      res.render('restricted', {message: message});
  } else {
      res.redirect('login'); 
  } 
});

app.listen(3000);
