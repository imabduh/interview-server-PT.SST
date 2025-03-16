const express = require("express");
const { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder } = require("../controllers/orders.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, authorize(["admin"]), createOrder); // Admin Only
router.get("/", authenticate, authorize(["admin"]), getAllOrders); // Admin Only
router.get("/:id", authenticate, getOrderById);
router.put("/:id/status", authenticate, updateOrderStatus); // Admin & Provider
router.delete("/:id", authenticate, authorize(["admin"]), deleteOrder); // Admin Only

module.exports = router;
