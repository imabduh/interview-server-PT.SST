const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "provider"], required: true }, // Role-based Access
  phone: { type: String },
  address: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
