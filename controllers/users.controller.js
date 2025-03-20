const User = require("../models/users.model");

// Ambil Semua Layanan
exports.getAllUsers = async (req, res) => {
  try {
    const response = await User.find();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Layanan Berdasarkan ID
exports.getUserById = async (req, res) => {
  try {
    const response = await User.findById(req.params.id);
    if (!response)
      return res.status(404).json({ message: "pengguna tidak ditemukan." });

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Layanan (Admin Only)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role, address, phone } = req.body;

    const response = await User.findByIdAndUpdate(
      req.params.id,
      { name,email, password, role, address, phone  },
      { new: true }
    );
    if (!response)
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });

    res.json({ message: "Pengguna berhasil diperbarui!", response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hapus Layanan (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    const response = await User.findByIdAndDelete(req.params.id);
    if (!response)
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });

    res.json({ message: "Pengguna berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
