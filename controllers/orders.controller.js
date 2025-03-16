const Order = require("../models/orders.model");
const Service = require("../models/services.model");
const User = require("../models/users.model");
const { v4: uuidv4 } = require("uuid");

// Buat Pemesanan (Admin Only)
exports.createOrder = async (req, res) => {
  try {
    const { customerName, serviceId, appointmentDate, providerId } = req.body;

    // Cek apakah layanan ada
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: "Layanan tidak ditemukan." });

    // Cek apakah penyedia layanan ada
    const provider = await User.findById(providerId);
    if (!provider || provider.role !== "provider") {
      return res.status(400).json({ message: "Penyedia layanan tidak valid." });
    }

    const order = new Order({
      orderNumber: uuidv4(),
      customerName,
      service: serviceId,
      provider: providerId,
      appointmentDate,
      statusHistory: [{ status: "Menunggu Konfirmasi", note: "Pemesanan dibuat" }]
    });

    await order.save();
    res.status(201).json({ message: "Pemesanan berhasil dibuat!", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Semua Pemesanan (Admin Only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("service provider", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Pemesanan Berdasarkan ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("service provider", "name email");
    if (!order) return res.status(404).json({ message: "Pemesanan tidak ditemukan." });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Status Pemesanan (Admin & Provider)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Pemesanan tidak ditemukan." });

    // Hanya admin atau provider yang ditugaskan bisa mengubah status
    if (req.user.role !== "admin" && req.user._id.toString() !== order.provider.toString()) {
      return res.status(403).json({ message: "Tidak memiliki izin." });
    }

    order.status = status;
    order.statusHistory.push({ status, note });
    await order.save();

    res.json({ message: "Status pemesanan diperbarui!", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hapus Pemesanan (Admin Only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Pemesanan tidak ditemukan." });

    res.json({ message: "Pemesanan berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
