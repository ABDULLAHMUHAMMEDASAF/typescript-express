const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//! Get admins from DB
router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find().sort({ _id: -1 });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Admin listesi çekilemedi", error });
  }
});

//! Yeni admin kaydetme.
router.post("/register", async (req, res) => {
  try {
    const { name, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      role,
      password: hashedPassword,
    });

    await newAdmin.save();
    res
      .status(201)
      .json({ message: "Yeni kullanıcı başarılı bir şekilde oluşturuldu." });
  } catch (error) {
    res.status(500).json({
      message: "Yeni admin oluşturulurken bir hata meydana geldi.",
      error: error.message, // Burayı .message yaparsan frontend'de hatayı görürsün
    });
  }
});

module.exports = router;
