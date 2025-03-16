const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Format: Bearer <token>
    if (!token) return res.status(401).json({ message: "Akses ditolak, token tidak ditemukan." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); // Simpan user info di request
    if (!req.user) return res.status(401).json({ message: "User tidak ditemukan." });

    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid." });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Akses ditolak, tidak memiliki izin." });
  }
  next();
};

module.exports = { authenticate, authorize };
