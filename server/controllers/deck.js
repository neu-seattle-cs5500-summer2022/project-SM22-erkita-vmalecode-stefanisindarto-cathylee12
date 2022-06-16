import mongoose from "mongoose";
import DeckSchema from "../models/deck.js";

export const createDeck = async (req, res) => {
  const body = req.body;
  const newDeck = new DeckSchema({
    ...body,
    user: req.userId,
    lastReviewed: Date.now.toISOString(),
    dateCreated: new Date().toISOString(),
  });
  try {
    await newDeck.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getDeck = async (req, res) => {
  const { id } = req.params;
  try {
    const foundDeck = await DeckSchema.findById(id);
    res.status(200).json(foundDeck);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDecks = async (req, res) => {
  try {
    const decks = await DeckSchema.find();
    res.status(200).json(decks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateDeckName = async (req, res) => {
  const oldDeckName = req.params;
  const newDeckName = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("no deck with ID: " + _id);
  }
  DeckSchema.findOneAndUpdate(
    { name: oldDeckName },
    { name: newDeckName },
    { upsert: true },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.json(updatedDeck);
    }
  );
};
