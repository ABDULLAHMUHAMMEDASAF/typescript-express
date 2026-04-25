const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");

//! Get admins from DB
router.get("/", verifyToken, async (req, res) => {
  try {
    const admins = await Admin.find().sort({ _id: -1 });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Admin listesi çekilemedi", error });
  }
});

//! Yeni admin kaydetme.
router.post("/register", verifyToken, async (req, res) => {
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

//! Delete admin from DB
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Admin silindi" });
  } catch (error) {
    res.status(500).json({ message: "Admin silinemedi." });
  }
});

//! User login
router.post("/login",  async (req, res) => {
  try {
    const { name, password } = req.body;

    const admin = await Admin.findOne({ name });
    if (!admin) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Şifre hatalı!" });
    }

    // GÜVENLİ TOKEN ÜRETİMİ
    // Eğer .env okunamazsa bile çökmemesi için alternatif bir anahtar koyduk
    const secret = process.env.JWT_SECRET || "yedek_gizli_anahtar";

    const token = jwt.sign(
      { id: admin._id, role: admin.role || "admin" }, // role yoksa hata vermesin diye varsayılan ekledik
      secret,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      success: true,
      token: token,
      name: admin.name,
    });
  } catch (error) {
    console.error("LOGIN HATASI:", error); // Terminalde hatayı kırmızı yazdırır
    return res.status(500).json({
      message: "Sunucu tarafında bir hata oluştu",
      error: error.message,
    });
  }
});

module.exports = router;
