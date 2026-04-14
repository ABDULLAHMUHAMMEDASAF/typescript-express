const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin.js");

//! Get admins from DB
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find().sort({ _id: -1 });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Admin listesi çekilemedi", error });
  }
});

module.exports = router;
