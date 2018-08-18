const mongoose = require('mongoose');


const  { ObjectId } = mongoose.SchemaTypes;

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
  unlikes: Number,
  shared: Number,
  comments: [{
    timeStamp:{ type:Date, default:Date.now },
    user:{ type : ObjectId, ref: 'User' },
    text: String,
    rating: Number,
    likes: Number,
    unlikes: Number,
    shared: Number,
  }],

});

const Article = mongoose.model('Article', articleSchema);
const ArticleMSRV = mongoose.model('ArticleMSRV', articleSchema);


module.exports = Article;
// module.exports = ArticleMSRV;
