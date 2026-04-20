const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title:         { type: String, required: true },
  srcName:       { type: String, required: true },
  description:   { type: String, required: true },
  datePublished: { type: String, required: true },
  dateUpdated:   { type: String, required: true },
  numberOfPages: { type: Number },
  imageUrl:      { type: String, required: true },
  file:          { type: String },
  subjects:      { type: String, required: true },
  admin:         { type: mongoose.Schema.Types.ObjectId, ref: "Admin" }
}, { timestamps: true });

module.exports = mongoose.model("Book", BookSchema);