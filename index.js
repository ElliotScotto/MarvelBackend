//import packages
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const formidable = require("formidable");
const mongoose = require("mongoose");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
//import fonctions
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
//
//import des models
const User = require("./models/User");
//
mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect("mongodb://localhost/ELLIOT-MARVEL-APP");
//
const ELLIOT_APIKEY = process.env.ELLIOT_APIKEY;
const MARVEL_REACTEUR = process.env.MARVEL_REACTEUR;
//
//Get a list of comics
app.get(`/comics`, async (req, res) => {
  try {
    const title = req.query.title || "";
    const response = await axios.get(
      `${MARVEL_REACTEUR}/comics?apiKey=${ELLIOT_APIKEY}`,
      {
        params: {
          title: req.query.title,
          skip: (req.query.page - 1) * 100, //pagination
        },
      }
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
app.get(`/comics/:characterId`, async (req, res) => {
  try {
    const characterId = req.params.characterId;
    const response = await axios.get(
      `${MARVEL_REACTEUR}/comics/${characterId}?apiKey=${apiKey}`
    );
    console.log(response);
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
      `${MARVEL_REACTEUR}/characters?apiKey=${ELLIOT_APIKEY}`,
      {
        params: {
          name: req.query.name,
          skip: (req.query.page - 1) * 100, //pagination
        },
      }
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
//SignIn
app.post("/signin", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    const isUsernameExist = await User.findOne({ username });
    if (user) {
      res.json({ message: "Cet email est déjà utilisé." });
    }
    if (isUsernameExist) {
      res.json({ message: "Ce nom d'utilisateur existe déjà." });
    } else if (password.length < 8) {
      res.json({
        message: "Votre mot de passe doit comporter au moins 8 caractères",
      });
    } else {
      if (email && password && username) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(password + salt).toString(encBase64);
        const user = new User({
          email: email,
          username: username,
          token: token,
          salt: salt,
          hash: hash,
        });
        await user.save();
        res.json({
          _id: user._id,
          token: user.token,
          username: user.username,
          email: user.email,
        });
      } else {
        res.json({ error: "Tous les champs doivent être remplis" });
      }
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});
//
//
//Join
app.post("/join", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      if (SHA256(password + user.salt).toString(encBase64) === user.hash) {
        res.json({
          _id: user._id,
          token: user.token,
          username: user.username,
        });
      } else {
        res.json({ message: "Mot de passe invalide." });
      }
    } else {
      res.json({
        message: "Vous n`êtes pas inscrit",
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});
//
//
//Favorites
app.post("/favorites", async (req, res) => {
  try {
    const response = await axios.get(
      `${MARVEL_REACTEUR}/characters?apiKey=${ELLIOT_APIKEY}`
    );
    res.status(200).json(response.data);
    console.log("Backend Marvel : vous passez dans la route /favorites");
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});
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
