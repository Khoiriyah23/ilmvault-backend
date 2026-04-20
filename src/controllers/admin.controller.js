const Admin = require("../models/admin.model");
const Book  = require("../models/book.model");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");

// POST /api/admin/signup
const signup = async (req, res) => {
  const { fName, lName, email, password } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: "Admin with this email already exists." });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const admin  = await Admin.create({ firstName: fName, lastName: lName, email, password: hashed });

  res.status(201).json({ success: true, message: "Account created. Please log in." });
};

// POST /api/admin/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const admin = await Admin.findOne({ email });
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  // Sign JWT and set as HTTP-only cookie
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge:   7 * 24 * 60 * 60 * 1000,  // 7 days
    sameSite: "lax",
  });

  res.json({
    success: true,
    admin: { id: admin._id, firstName: admin.firstName, lastName: admin.lastName, email: admin.email }
  });
};

// GET /api/admin/profile
const profile = async (req, res) => {
  const admin = await Admin.findById(req.adminId).select("-password");
  const books = await Book.find({ admin: req.adminId });

  res.json({ success: true, admin, books });
};

// POST /api/admin/logout
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully." });
};

module.exports = { signup, login, profile, logout };