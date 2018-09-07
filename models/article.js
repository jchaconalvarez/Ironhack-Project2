const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;

const articleSchema = new mongoose.Schema({
  // idArticle: { type: ObjectId, index: true, required: true, auto: true, },
  source: {
    id: String,
    name: String,
  },
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: { type:Date, default: Date.now },
  starred: Number,
  likes: Number,
  dislikes: Number,
  shared: Number,
  comments: [{
    timeStamp: { type:Date, default:Date.now },
    user: { type : ObjectId, ref: 'User' },
    text: String,
    rating: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    shared: { type: Number, default: 0 },
  }],
});

const Article = mongoose.model('Article', articleSchema);
const ArticleMSRV = mongoose.model('ArticleMSRV', articleSchema);


module.exports = Article;
// module.exports = ArticleMSRV;
