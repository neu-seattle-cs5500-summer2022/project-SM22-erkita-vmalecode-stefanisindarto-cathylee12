// import mongoose from "mongoose";
// import DeckSchema from "../models/deck.js";
const mongoose = require("mongoose");
const { modelName } = require("../models/deck.js");
const DeckSchema = require("../models/deck.js");

function createDeck(req, res) {
  const deck = req.body;
  const newDeck = new DeckSchema({
    name: deck.name,
    // userId: req.userId,
    lastReviewed: new Date().now,
    dateCreated: new Date(),
  });
  try {
    newDeck.save();
    res.status(201).json(newDeck);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

function getDeck(req, res) {
  res.send("get deck");
  //   const { id } = req.params;
  //   try {
  //     const foundDeck = await DeckSchema.findById(id);
  //     res.status(200).json(foundDeck);
  //   } catch (error) {
  //     res.status(404).json({ message: error.message });
  //   }
}

async function getDecks(req, res) {
  try {
    const decks = await DeckSchema.find();
    res.status(200).json(decks);
  } catch (error) {
    res.status(404).json({ message2: error.message });
  }
}

// export const updateDeckName = async (req, res) => {
//   const oldDeckName = req.params;
//   const newDeckName = req.body;
//   if (!mongoose.Types.ObjectId.isValid(_id)) {
//     return res.status(404).send("no deck with ID: " + _id);
//   }
//   DeckSchema.findOneAndUpdate(
//     { name: oldDeckName },
//     { name: newDeckName },
//     { upsert: true },
//     function (err, doc) {
//       if (err) return res.send(500, { error: err });
//       return res.json(updatedDeck);
//     }
//   );
// };

// export const deleteDeck= async (req, res) => {
//   const { id } = req.params;
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).send("no deck with ID: " + id);
//   }
//   await DeckSchema.findByIdAndRemove(id);
//   res.json({ message: "Deck deleted." });
// };

module.exports = { createDeck, getDeck, getDecks };
