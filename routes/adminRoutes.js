const express = require("express");
const router = express.Router();

//! test
router.get("/details", (req, res) => {
  res.json({
    page: "Admin - Page",
    detail: "Bu sayfada admin bilgileri vardır",
  });
});

module.exports = router;
