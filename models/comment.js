const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;

const commentSchema = new mongoose.Schema({
  timeStamp: { type: Date, default: Date.now },
  article: { type: ObjectId, ref: 'Article' },
  user: { type: ObjectId, ref: 'User' },
  text: String,
  rating: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  shared: { type: Number, default: 0 },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
