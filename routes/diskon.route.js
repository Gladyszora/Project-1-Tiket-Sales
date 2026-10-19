const express = require("express")
const router = express.Router()

router.use(express.json())

const diskonController = require("../controllers/diskon.controller")

// Import middleware
const { authorize } = require("../middlewares/auth-validation")
const { IsUser, IsAdmin } = require("../middlewares/role-validation")

// Get all discounts
router.get("/", authorize, diskonController.getAllDiskon)

// Add new discount (Admin Only)
router.post("/", authorize, IsAdmin, diskonController.addDiskon)

// Update discount by ID (Admin Only)
router.put("/:id", authorize, IsAdmin, diskonController.updateDiskon)

// Delete discount by ID (Admin Only)
router.delete("/:id", authorize, IsAdmin, diskonController.deleteDiskon)

module.exports = router