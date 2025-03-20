const { default: mongoose } = require("mongoose");
const Service = require("../models/services.model");

// Tambah Layanan (Admin Only)
exports.createService = async (req, res) => {
  try {
    const { name, description, price, providerId } = req.body;
    const service = new Service({ name, description, price, providerId });
    await service.save();

    res.status(201).json({ message: "Layanan berhasil ditambahkan!", service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Semua Layanan
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "providerId",
          foreignField: "_id",
          as: "userProvider",
        },
      },
    ]);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Layanan Berdasarkan ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "providerId",
          foreignField: "_id",
          as: "userProvider",
        },
      },
    ]);
    if (!service[0])
      return res.status(404).json({ message: "Layanan tidak ditemukan." });

    res.json(service[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Update Layanan (Admin Only)
exports.updateService = async (req, res) => {
  try {
    const { name, description, price, providerId } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, price, providerId },
      { new: true }
    );
    if (!service)
      return res.status(404).json({ message: "Layanan tidak ditemukan." });

    res.json({ message: "Layanan berhasil diperbarui!", service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hapus Layanan (Admin Only)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Layanan tidak ditemukan." });

    res.json({ message: "Layanan berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
