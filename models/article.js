const mongoose = require('mongoose');


const  ObjectId  = mongoose.SchemaTypes.ObjectId;

const articleSchema = new mongoose.Schema({
  // idArticle: {
  //   type: ObjectId,
  //   index: true,
  //   required: true,
  //   auto: true,
  // },
  source: {
    id: String,
    name: String,
  },
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: Date,
  starred: Number,
  shared: Number,
  comment: [{
    // id: {
    //   type: ObjectId,
    //   index: true,
    //   required: true,
    //   auto: true,
    // },
    user:{ type : ObjectId, ref: 'User' },
    text: String,
    rating: Number,
    likes: Number,
  }],

});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
