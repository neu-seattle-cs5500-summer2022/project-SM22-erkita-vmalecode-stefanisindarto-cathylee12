const mongoose = require("mongoose");
const DeckSchema = require("../models/deck.js");
const invalidNameMessage = "Valid name required";
const Flashcard = require("../models/flashcard.js");

const {
  createCard,
  getCards,
  getCardRecallability,
} = require("./flashcard.js");

function onlyContainsWhiteSpace(req, res) {
  if (req.body.name.trim().length === 0) {
    return true;
  }
  return false;
}

function onlyContainsSpecialCharacters(req, res) {
  let specialCharRegex = /^[^a-zA-Z0-9]+$/;
  if (specialCharRegex.test(req.body.name)) {
    return true;
  }
  return false;
}

function isValidName(req, res) {
  if (
    !onlyContainsWhiteSpace(req, res) &&
    !onlyContainsSpecialCharacters(req, res)
  ) {
    return true;
  }
  return false;
}

async function createDeck(req, res) {
  if (isValidName(req, res)) {
    try {
      const newDeck = new DeckSchema({
        name: req.body.name,
        userId: req.userId,
        lastReviewed: new Date().now,
        dateCreated: new Date(),
      });
      await newDeck.save();
      res.status(201).json(newDeck);
    } catch (error) {
      res.status(409).json({ message: "Name cannot be empty" });
    }
  } else {
    res.status(404).json({ message: invalidNameMessage });
  }
}

async function addFlashcard(req, res) {
  createCard(req, res);
}
async function pushFlashcard(req,res) {
  console.log('[controllers/deck/pushFlashCard]',req.body);
  try {
    const newCard = {
      front: req.body.front,
      back: req.body.back,
    };
    await DeckSchema.findOneAndUpdate({_id:req.body.deckID},{
      $push: {
        cards: newCard
      }
    });
    res.status(200).json(newCard);

  } catch (error) {
    res.status(500).json({ message: "error creating card"});
    console.log(error);
  }
  
}
async function getDeck(req, res) {
  const { id } = req.params;
  try {
    const foundDeck = await DeckSchema.findById(id);
    res.status(200).json(foundDeck);
  } catch (error) {
    res.status(404).json({ message: "Deck with ID " + id + " not found" });
  }
}

async function getDecks(req, res) {
  try {
    const userId = req.userId;
    const decks = await DeckSchema.find({ userId: userId });
    res.status(200).json(decks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

async function getDeckFlashcards(req, res) {
  return getCards(req, res);
}

async function updateDeckName(req, res) {
  if (isValidName(req, res)) {
    const { id } = req.params;
    try {
      const deck = await DeckSchema.findById(id);
      deck.name = req.body.name;
      await deck.save();
      res.status(200).json(deck);
    } catch (error) {
      res.status(404).json({ message: "Deck with ID " + id + " not found" });
    }
  }
  res.status(404).json({ message: invalidNameMessage });
}

async function deleteDeck(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ message: "Could not delete deck with invalid ID: " + id });
  }
  await DeckSchema.findByIdAndRemove(id);
  res.json({ message: "Deck deleted" });
}

module.exports = {
  createDeck,
  addFlashcard,
  getDeck,
  getDeckFlashcards,
  getDecks,
  updateDeckName,
  deleteDeck,
  pushFlashcard,
};
