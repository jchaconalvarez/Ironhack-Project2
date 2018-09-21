const mongoose = require('mongoose');
const UserSchema = require('mongoose').model('User').schema;
const ArticleSchema = require('mongoose').model('Article').schema;

const commentSchema = new mongoose.Schema({
  timeStamp: { type: Date, default: Date.now },
  article: ArticleSchema,
  postedBy: UserSchema,
  text: String,
  rating: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  shared: { type: Number, default: 0 },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
