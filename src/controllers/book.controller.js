const Book = require("../models/book.model");
const path = require("path");
const fs   = require("fs");           // ← was missing before (bug fix)

// GET /api/books
const getAllBooks = async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json({ success: true, data: books });
};

// GET /api/books/:id
const getBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ success: false, message: "Resource not found." });
  res.json({ success: true, data: book });
};

// POST /api/books  (admin only)
const createBook = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "A file is required." });
  }

  const book = await Book.create({
    title:         req.body.title,
    srcName:       req.body.srcName,
    description:   req.body.description,
    datePublished: req.body.datePublished,
    dateUpdated:   req.body.dateUpdated,
    numberOfPages: req.body.numberOfPages,
    imageUrl:      req.body.imageUrl,
    subjects:      req.body.subjects,
    file:          req.file.filename,   // multer gives us this
    admin:         req.adminId
  });

  res.status(201).json({ success: true, data: book });
};

// PUT /api/books/:id  (admin only) ← BUG FIXED: was calling Book.create instead of findByIdAndUpdate
const updateBook = async (req, res) => {
  const updateData = {
    title:         req.body.title,
    srcName:       req.body.srcName,
    description:   req.body.description,
    datePublished: req.body.datePublished,
    dateUpdated:   req.body.dateUpdated,
    numberOfPages: req.body.numberOfPages,
    imageUrl:      req.body.imageUrl,
    subjects:      req.body.subjects,
  };

  // Only update file if a new one was uploaded
  if (req.file) {
    updateData.file = req.file.filename;
  }

  const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!book) return res.status(404).json({ success: false, message: "Resource not found." });

  res.json({ success: true, data: book });
};

// DELETE /api/books/:id  (admin only)
const deleteBook = async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ success: false, message: "Resource not found." });

  res.json({ success: true, message: "Resource deleted." });
};

// GET /api/books/:id/download  ← BUG FIXED: was missing fs import + wrong param name
const downloadBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book || !book.file) {
    return res.status(404).json({ success: false, message: "File not found." });
  }

  const filePath = path.join(__dirname, "../public/uploads/", book.file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File missing on server." });
  }

  res.download(filePath, book.file);  // triggers browser download
};

module.exports = { getAllBooks, getBook, createBook, updateBook, deleteBook, downloadBook };