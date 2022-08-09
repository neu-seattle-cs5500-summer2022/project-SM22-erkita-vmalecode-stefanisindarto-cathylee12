const mongoose = require("mongoose");
const DeckSchema = require("../models/deck.js");
const invalidNameMessage = "Valid name required";
const Flashcard = require("../models/flashcard.js");
const CardsArray = require("../models/cardsArray.js");
const intervalCalculator = require("./intervalCalculator.js");

const {
  getCards,
} = require("./flashcard.js");

const invalidTokenMessage = "Authentication not valid";

function onlyContainsWhiteSpace(req, res) {
  if (req.body.name && req.body.name.trim().length === 0) {
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

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function isObjectIdValid(res, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ message: "Deck with ID " + id + " not found" });
  }
}

function isDeckValid(res, id, deck) {
  if (deck == null) {
    return res.status(404).json({ message: "Deck with ID " + id + " not found" });
  }
}

function isUserValid(req, res, deck) {
  if (deck.userId !== req.userId) {
    return res.status(401).json({ message: invalidTokenMessage });
  }
}

async function createDeck(req, res) {
  if (isValidName(req, res)) {
    try {
      const newDeck = new DeckSchema({
        name: req.body.name,
        public: req.body.public,
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

async function getDeck(req, res) {
  const { id } = req.params;
  isObjectIdValid(res, id);
  const deck = await DeckSchema.findById(id);
  if (!deck) {
    return res.status(404).json({ message: "Deck with ID " + id + " not found" });
  }
  isUserValid(req, res, deck);
  res.status(200).json(deck);
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

async function getPublicDecks(req, res) {
  try {
    const decks = await DeckSchema.find({ public: true });
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
    isObjectIdValid(res, id);
    try {
      const deck = await DeckSchema.findById(id);
      isDeckValid(res, id, deck);
      isUserValid(req, res, deck);
      deck.name = req.body.name;
      await deck.save();
      res.status(200).json(deck);
    } catch (error) {
      res.status(404).json({ message: "Deck with ID " + id + " not found" });
    }
  }
  res.status(404).json({ message: invalidNameMessage });
}

async function updatePublicDeck(req, res) {
  const { id } = req.params;
  try {
    const deck = await DeckSchema.findById(id);
    deck.public = req.body.public;
    await deck.save();
    res.status(200).json(deck);
  } catch (error) {
    res.status(404).json({ message: "Deck with ID " + id + " not found" });
  }
}

async function deleteDeck(req, res) {
  const { id } = req.params;
  isObjectIdValid(res, id);
  const deck = await DeckSchema.findById(id);
  isDeckValid(res, id, deck);
  // Check authorization
  isUserValid(req, res, deck);
  try {
    await CardsArray.findOneAndDelete({ deckId: id });
    const cards = deck.cards;
    cards.forEach(async (card) => await Flashcard.findByIdAndDelete(card._id));
    await DeckSchema.findByIdAndRemove(id);
    res.status(200).json({ message: "Deck deleted", deckID: id });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
}

async function practiceDeck(req, res) {
  const { id } = req.params;
  isObjectIdValid(res, id);
  const deck = await DeckSchema.findById(id);
  isDeckValid(res, id, deck);
  isUserValid(req, res, deck);
  if (!deck.cards.length) {
    return res.status(405).json({ message: "Cards empty." });
  }
  try {
    let cardsArray = await CardsArray.findOne({ deckId: id });
    const shuffledArray = shuffleArray(deck.cards);
    if (!cardsArray) {
      cardsArray = new CardsArray({ deckId: id, cards: shuffledArray });
    } else {
      cardsArray.cards = shuffledArray;
    }
    await cardsArray.save();
    let cards = cardsArray.cards;
    let card = await Flashcard.findById(cards[0]);
    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ messeage: "Something went wrong" });
  }
}

async function nextCard(req, res) {
  const { id } = req.params;
  isObjectIdValid(res, id);
  const deck = await DeckSchema.findById(id);
  isDeckValid(res, id, deck);
  isUserValid(req, res, deck);
  const cardsArray = await CardsArray.findOne({ deckId: id });
  if (!cardsArray) {
    return res.status(404).json({ message: "Go to /practice." });
  }
  if (!cardsArray.cards) {
    return res.status(404).json({ message: "Cards empty." });
  }
  try {
    let cards = cardsArray.cards;
    let card = await Flashcard.findById(cards[0]);
    let { nextInterval, nextRepetition, nextEfactor } = intervalCalculator(card);
    card.interval = nextInterval;
    card.repetition = nextRepetition;
    card.efactor = nextEfactor;
    await card.save();
    if (cards.length > nextInterval) {
      cards.splice(nextInterval + 1, 0, card);
    } else {
      cards.push(card);
    }
    cards.shift();
    await cardsArray.save();
    card = await Flashcard.findById(cards[0]);
    res.status(200).json(card);
  } catch (error) {
    res.status(400).json({ message: "Something went wrong." });
  }
}

module.exports = {
  createDeck,
  getDeck,
  getDeckFlashcards,
  getDecks,
  getPublicDecks,
  updateDeckName,
  updatePublicDeck,
  deleteDeck,
  practiceDeck,
  nextCard,
};
