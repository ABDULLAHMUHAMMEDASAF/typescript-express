const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // 1. İstek yapanın cebine (Header) bakıyoruz: "Bilekliğin var mı?"
  const token = req.header("Authorization");

  // 2. Eğer bileklik hiç yoksa içeri alma
  if (!token) {
    return res.status(401).json({ message: "Giriş engellendi, token bulunamadı!" });
  }

  try {
    // 3. Bileklik varsa, mühür gerçek mi diye kontrol et (JWT_SECRET ile)
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified; // Bileklikteki bilgileri (id, role) isteğin içine koy
    
    next(); // "Tamam, bileklik gerçek, bir sonraki aşamaya geçebilirsin" (Kapıyı açar)
  } catch (error) {
    res.status(400).json({ message: "Geçersiz token!" });
  }
};

module.exports = verifyToken;
