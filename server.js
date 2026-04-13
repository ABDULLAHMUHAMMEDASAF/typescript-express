require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT;
const app = express();
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_DB_URI)
  .then(() => console.log("Veri tabanı bağlantısı başarılı"))
  .catch((err) => console.log("Veritabanı bağlantı hatası", err));

app.use("/users", userRoutes);
//! Bu kısmı yeni ekledim. Tıpkı userRoutes daki gibi o koridordaki masaları teker teker yazacaktım. /settings /details gibi
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunu dinlmeye başladı...`);
});
