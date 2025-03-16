const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, required: true },
  customerName: { type: String, required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Penyedia layanan yang ditugaskan
  status: { type: String, enum: ["Menunggu Konfirmasi", "Sedang Diproses", "Selesai"], default: "Menunggu Konfirmasi" },
  appointmentDate: { type: Date, required: true },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
