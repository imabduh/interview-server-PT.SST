const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Cek apakah user sudah terdaftar
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "Email sudah terdaftar." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
    });
    await user.save();

    res.status(201).json({ message: "Pendaftaran berhasil!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email atau password salah." });

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Email atau password salah." });

    // Buat token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};
