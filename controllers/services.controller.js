const Service = require("../models/services.model");

// Tambah Layanan (Admin Only)
exports.createService = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const service = new Service({ name, description, price });
    await service.save();

    res.status(201).json({ message: "Layanan berhasil ditambahkan!", service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Semua Layanan
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Layanan Berdasarkan ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Layanan tidak ditemukan." });

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Layanan (Admin Only)
exports.updateService = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const service = await Service.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true });
    if (!service) return res.status(404).json({ message: "Layanan tidak ditemukan." });

    res.json({ message: "Layanan berhasil diperbarui!", service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hapus Layanan (Admin Only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Layanan tidak ditemukan." });

    res.json({ message: "Layanan berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
