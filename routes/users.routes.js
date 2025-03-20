const express = require("express");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const { deleteUser, updateUser, getUserById, getAllUsers } = require("../controllers/users.controller");

const router = express.Router();

router.get("/", authenticate, getAllUsers);
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate,  updateUser); // Admin Only
router.delete("/:id", authenticate, deleteUser); // Admin Only

module.exports = router;
