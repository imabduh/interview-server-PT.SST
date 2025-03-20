const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  deleteManyOrder
} = require("../controllers/orders.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, authorize(["admin", "buyer"]), createOrder); // Admin Only
router.get("/", authenticate, getAllOrders); // Admin Only
router.get("/:id", authenticate, getOrderById);
router.put(
  "/:id/status",
  authenticate,
  authorize(["provider", "buyer"]),
  updateOrderStatus
); // Admin & Provider
router.delete("/:id", authenticate, authorize(["admin", "buyer"]), deleteOrder); // Admin Only
router.delete("/:id/many", authenticate, authorize(["admin"]), deleteManyOrder); // Admin Only

module.exports = router;
