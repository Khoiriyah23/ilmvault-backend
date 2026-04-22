if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("express-async-errors");

const bookRoutes = require("./routes/book.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://ilmvault.vercel.app",
    process.env.CLIENT_URL
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/public/uploads"));

// ── Routes ──────────────────────────────────────────────
app.use("/api/books", bookRoutes);
app.use("/api/admin", adminRoutes);

// ── Global error handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

// ── Database + Server ───────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Database connected!");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("❌ DB Error:", err.message);
    process.exit(1);
  });