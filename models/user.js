const mongoose = require('mongoose');

const  { ObjectId }  = mongoose.SchemaTypes;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    // unique: true,
  },
  password: String,
  countries: {
    type: [String],
    enum: [
      'ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de', 'eg', 'fr',
      'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my',
      'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th',
      'tr', 'tw', 'ua', 'us', 've', 'za',
    ],
    default: ['us'],
  },
  languages: {
    type: [String],
    enum: [
      'en', 'es', 'de', 'fr', 'it', 'pt',
    ],
    default: ['en'],
  },
  articles: [{ type : ObjectId, ref: 'Article' }],
  favorites: [{ type: ObjectId, ref: 'Article' }],
  likes: [{ type: ObjectId, ref: 'Article' }],
  dislikes: [{ type: ObjectId, ref: 'Article' }],
  comments: [{ type: ObjectId, ref: 'Comment' }],
  following: [{ type: ObjectId, ref: 'User' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
