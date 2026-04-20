const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;   // available in all protected routes
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired session." });
  }
};

module.exports = adminAuth;