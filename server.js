require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Merhaba backend");
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunu dinlmeye başladı...`);
});
