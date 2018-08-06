var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true, index: true },
  parent: { type: String }
});

Category = mongoose.model('categories', CategorySchema);

module.exports = Category;
