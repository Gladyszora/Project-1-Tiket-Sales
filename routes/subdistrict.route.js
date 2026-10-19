const express = require("express");

const {
    getAllSubdistrict,
    getSubdistrictById,
    addSubdistrict,
    updateSubdistrict,
    deleteSubdistrict
} = require("../controllers/subdistrict.controller");

const router = express.Router();

router.get("/", getAllSubdistrict);

router.get("/:id", getSubdistrictById);

router.post("/", addSubdistrict);

router.put("/:id", updateSubdistrict);

router.delete("/:id", deleteSubdistrict);

module.exports = router;