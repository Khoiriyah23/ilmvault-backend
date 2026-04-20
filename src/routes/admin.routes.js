const express  = require("express");
const router   = express.Router();
const adminAuth = require("../middleware/auth.middleware");
const { signup, login, profile, logout } = require("../controllers/admin.controller");

router.post("/signup",  signup);
router.post("/login",   login);
router.get("/profile",  adminAuth, profile);
router.post("/logout",  adminAuth, logout);

module.exports = router;