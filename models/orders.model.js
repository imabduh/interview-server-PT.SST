const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Menunggu Konfirmasi", "Sedang Diproses", "Selesai", "Dibatalkan"],
      default: "Menunggu Konfirmasi",
    },
    appointmentDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
