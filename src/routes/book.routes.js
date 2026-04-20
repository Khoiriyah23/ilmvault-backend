const express   = require("express");
const router    = express.Router();
const multer    = require("multer");
const path      = require("path");
const adminAuth = require("../middleware/auth.middleware");
const { getAllBooks, getBook, createBook, updateBook, deleteBook, downloadBook } =
  require("../controllers/book.controller");

// Multer config — stores files in /public/uploads with timestamp name
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../public/uploads")),
  filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get("/",          getAllBooks);
router.get("/:id",       getBook);
router.get("/:id/download", downloadBook);
router.post("/",         adminAuth, upload.single("file"), createBook);
router.put("/:id",       adminAuth, upload.single("file"), updateBook);
router.delete("/:id",    adminAuth, deleteBook);

module.exports = router;