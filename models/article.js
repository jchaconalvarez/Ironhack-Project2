const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;

const articleSchema = new mongoose.Schema({
  // idArticle: { type: ObjectId, index: true, required: true, auto: true, },
  source: { id: String, name: String },
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
  comments: [{ type: ObjectId, ref: 'Comment' }],
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
