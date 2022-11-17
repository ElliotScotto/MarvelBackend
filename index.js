//import packages
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
//
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//
// mongoose.connect("mongodb://localhost:27017/ELLIOT-MARVEL-APP");
mongoose.connect("mongodb://localhost/ELLIOT-MARVEL-APP");
//
const ELLIOT_APIKEY = process.env.ELLIOT_APIKEY;
const MARVEL_REACTEUR = process.env.MARVEL_REACTEUR;
//
//Get a list of comics
app.get(`/comics`, async (req, res) => {
  try {
    const title = req.query.title || "";
    const response = await axios.get(
      `${MARVEL_REACTEUR}/comics?apiKey=${ELLIOT_APIKEY}&title=${title}`
    );
    res.status(200).json(response.data);
    console.log("Backend Marvel : vous passez dans la route /comics");
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
});
//
//
//Get a list of comics containing a specific character
app.get(`/comics/:characterId`, (req, res) => {
  try {
    res.status(200).json({
      message: "Backend Marvel : je passe dans ma route /comics/:characterId",
    });
    console.log(
      "Backend Marvel : vous passez dans la route /comics/:characterId"
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
});
//
//
//Get a list of characters
app.get(`/characters`, async (req, res) => {
  try {
    const limit = req.query.limit || 100;
    const skip = req.query.skip || 0;
    const name = req.query.name || "";

    const response = await axios.get(
      `${MARVEL_REACTEUR}/characters?apiKey=${ELLIOT_APIKEY}&name=${name}&limit=${limit}`
    );
    res.status(200).json(response.data);
    console.log("Backend Marvel : vous passez dans la route /characters");
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});
//
//
//Get a the infos of a specific character
app.get("/character/:characterId", async (req, res) => {
  try {
    const characterId = req.params.characterId;
    // console.log(characterId);
    const response = await axios.get(
      `${MARVEL_REACTEUR}/character/${characterId}?apiKey=${ELLIOT_APIKEY}`
    );
    console.log(response);
    res.status(200).json(response.data);
    console.log(
      "Backend Marvel : vous passez dans la route /character/:characterId"
    );
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});
//
//
//
//
app.get("/", (req, res) => {
  try {
    res.status(200).json({
      message: "Backend Marvel : je passe dans la route /",
    });
    console.log("Backend Marvel : vous passez dans la route /");
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
});
app.all("*", (req, res) => {
  res.status(400).json({ message: "Backend Marvel : cette page n'existe pas" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Mon serveur a demarré sur le Port : ${PORT}`);
});
