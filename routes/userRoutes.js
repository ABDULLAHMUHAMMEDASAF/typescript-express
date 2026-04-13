const express = require("express");
const router = express.Router();
const User = require("../models/User.js");

//! Get users from DB
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Veriler çekilemedi", error });
  }
});

//! Yeni kullanıcı ekle
router.post("/", async (req, res) => {
  try {
    const newUser = new User({ name: req.body.name });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Hata meydana geldi." });
  }
});

//! Kullanıcı silme
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Kullanıcı silindi" });
  } catch (error) {
    res.status(500).json({ message: "Kullanıcı silinemedi." });
  }
});

//! Kuallanıcı bilgilerini güncelle
router.put("/:id", async (req, res) => {
  try {

  } catch {

  }
});

//! Test amaçlı bir router
router.get("/hakkimda", async (req, res) => {
  res.json("Merhaba hakkımda sayfası");
});

module.exports = router;
