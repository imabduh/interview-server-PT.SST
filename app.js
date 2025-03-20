const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const serviceRoutes = require("./routes/services.routes");
const orderRoutes = require("./routes/orders.routes");

// Gunakan Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);

// Koneksi MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.info("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.listen(process.env.PORT || 3001, () => {
  console.info("Server Running");
});

module.exports = app;
