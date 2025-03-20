const Order = require("../models/orders.model");
const Service = require("../models/services.model");
const User = require("../models/users.model");

// Buat Pemesanan (Admin Only)
exports.createOrder = async (req, res) => {
  try {
    const { serviceId, appointmentDate, providerId, buyerId } = req.body;

    // Cek apakah layanan ada
    const service = await Service.findById(serviceId);
    if (!service)
      return res.status(404).json({ message: "Layanan tidak ditemukan." });

    // Cek apakah penyedia layanan ada
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(400).json({ message: "Penyedia layanan tidak valid." });
    }

    const order = new Order({
      serviceId,
      providerId,
      buyerId,
      appointmentDate,
    });

    await order.save();
    res.status(201).json({ message: "Pemesanan berhasil dibuat!", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

// Ambil Semua Pemesanan (Admin Only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "providerId",
          foreignField: "_id",
          as: "dataProvider",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "buyerId",
          foreignField: "_id",
          as: "dataBuyer",
        },
      },
    ]);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Pemesanan Berdasarkan ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Pemesanan tidak ditemukan." });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Status Pemesanan (Admin & Provider)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ message: "Pemesanan tidak ditemukan." });

    order.status = status;
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
    if (!order)
      return res.status(404).json({ message: "Pemesanan tidak ditemukan." });

    res.json({ message: "Pemesanan berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteManyOrder = async (req, res) => {
  try {
    const order = await Order.deleteMany({ serviceId: req.params.id });
    if (!order)
      return res.status(404).json({ message: "Pemesanan dari layanan tidak ditemukan." });

    res.json({ message: "Pemesanan berhasil dihapus semua sesuai layanan!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
