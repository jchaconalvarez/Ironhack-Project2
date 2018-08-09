const mongoose = require('mongoose');

const  ObjectId  = mongoose.SchemaTypes.ObjectId;

const userSchema = new mongoose.Schema({
  userId: {  // TODO: tenemos dos ID
    type: ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: String,
  country: [{
    type: String,
    enum: [
      'ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 'de', 'eg', 'fr',
      'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp', 'kr', 'lt', 'lv', 'ma', 'mx', 'my',
      'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th',
      'tr', 'tw', 'ua', 'us', 've', 'za', 'es',
    ],
    default: 'es',
  }],
  languages: [{
    type: String,
    enum: [
      'ar', 'de', 'en', 'es', 'fr', 'he', 'it',
      'nl', 'no', 'pt', 'ru', 'se', 'ud', 'zh',
    ],
    default: 'en',
  }],
  articles: [{ type : ObjectId, ref: 'Article' }],
  following: [String], // TODO : [{ type : ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
