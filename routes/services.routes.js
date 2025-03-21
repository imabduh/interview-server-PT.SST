const express = require("express");
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/services.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authenticate, authorize(["admin", "provider"]), createService); // Admin Only
router.get("/", authenticate, getAllServices);
router.get("/:id", authenticate, getServiceById);
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "provider"]),
  updateService
); // Admin Only
router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "provider"]),
  deleteService
); // Admin Only

module.exports = router;
