const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");

app.use(express.json());

app.get("/characters", (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Backend Marvel : je passe dans ma route /characters" });
    console.log("Backend Marvel : vous passez dans la route /characters");
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
});
app.get("/comics", (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "Backend Marvel : je passe dans ma route /comics" });
    console.log("Backend Marvel : vous passez dans la route /comics");
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
});
app.get("*", (req, res) => {
  res.status(400).json({ message: "Backend Marvel : cette page n'existe pas" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Mon serveur a demarré sur le Port : ${PORT}`);
});
