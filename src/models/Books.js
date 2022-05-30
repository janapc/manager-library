const mongoose = require("mongoose");

const BooksSchema = new mongoose.Schema({
  title: String,
  description: String,
  borrow: Boolean,
});

module.exports = mongoose.model("Books", BooksSchema);
