import mongoose from 'mongoose';
import slug from 'mongoose-slug-updater';

console.log('Waiting for connection to database...');
try {
  await mongoose.connect('mongodb://localhost/hw06', {useNewUrlParser: true});
  console.log('Successfully connected to database.');
} catch (err) {
  console.log('ERROR: ', err);
}

mongoose.plugin(slug);

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true, minLength: 3, maxLength: 20},
  password: {type: String, required: true, minLength: 8},
  email: {type: String, required: true},
});

// const CommentSchema = new mongoose.Schema({
//   text: {type: String, required: true},
//   user: [{type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],
// });

const ArticleSchema = new mongoose.Schema({
  title: {type: String, required: true},
  url: {type: String},
  description: {type: String, required: false},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  slug: {type: String, slug: 'title', unique: true}
}, {timestamps: true});


mongoose.model('User', UserSchema);
mongoose.model('Article', ArticleSchema);