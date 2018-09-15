const mongoose = require('mongoose');
const UserSchema = require('mongoose').model('User').schema;

const { ObjectId } = mongoose.SchemaTypes;

const articleSchema = new mongoose.Schema({
  source: { id:String, name: { type:String, default: '' } },
  author: { type:String, default: '' },
  language: {
    type: String,
    enum: [
      'en', 'es', 'de', 'fr', 'it', 'pt',
    ],
    default: ['en'],
  },
  title: { type:String, default: '' },
  description: { type:String, default: '' },
  url: { type:String, default: '' },
  urlToImage: { type:String, default: '' },
  publishedAt: { type:Date, default: Date.now },
  articles: { type:Number, default: 0 },
  favorites: { type:Number, default: 0 },
  dislikes: { type:Number, default: 0 },
  shared: { type:Number, default: 0 },
  postedBy: UserSchema,
  comments: [{ type: ObjectId, ref: 'Comment' }],
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
