const mongoose = require("mongoose");
const DeckSchema = require("../models/deck.js");
const invalidNameMessage = "Valid name required";
const Flashcard = require("../models/flashcard.js");
const CardsArray = require("../models/cardsArray.js");
const intervalCalculator = require("./intervalCalculator.js");

const {
  createCard,
  getCards,
  getCardRecallability,
} = require("./flashcard.js");

const authFailMessage = "Authentication not valid.";

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

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
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

async function removeFlashcard(req,res) {
  try {
    // Verify authorization:
    let deck = await DeckSchema.findById(req.body.deckID);
    if (deck.userId !== req.userId) {
      res.status(403);
      return
    }
    console.log('[deckController/removeFlashcard]',req.body);
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cards' }];
    await DeckSchema.findOneAndUpdate({_id:req.body.deckID}, {
      $pull: { cards: {_id: req.body.cardID} }
    }).exec();
    deck = await DeckSchema.findById(req.body.deckID);

    console.log('[deckController/removeFlashcard] remove: deck cards: ',deck.cards);
    
    res.status(200).json(req.body);

  } catch (error) {
    res.status(500).json({ message: "error deleting card"});
    console.log(error);
  }
}
async function pushFlashcard(req,res) {
  
  try {
    // Verify Authorization
    const deck = await DeckSchema.findById(req.body.deckID)
    console.log(deck)
    if (deck.userId !== req.userId) {
      res.status(403);
      return
    }
    const newCard = {
      front: req.body.front,
      back: req.body.back,
      deckId: req.body.deckID
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
  const deck = await DeckSchema.findById(id);
  // Check authorization
  if (deck.userId !== req.userId) {
    return res.status(403);
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ message: "Could not delete deck with invalid ID: " + id });
  }
  await DeckSchema.findByIdAndRemove(id);
  res.json({ message: "Deck deleted",deckID:id });
}

async function practiceDeck(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ message: "Deck with ID " + id + " not found" });
  }
  const deck = await DeckSchema.findById(id);
  if (!deck) return res.status(404).json({ message: "Deck with ID " + id + " not found" });
  if (deck.userId !== req.userId) {
    return res.status(403).json({ message: authFailMessage });
  }
  if (!deck.cards.length) {
    return res.status(405).json({ message: "Cards empty." });
  }
  try {
    let cardsArray = await CardsArray.findOne({ deckID: id });
    const shuffledArray = shuffleArray(deck.cards);
    if (!cardsArray) {
      cardsArray = new CardsArray({ deckID: id, cards: shuffledArray });
    } else {
      cardsArray.cards = shuffledArray;
    }
    await cardsArray.save();
    let cards = cardsArray.cards;
    let card = await Flashcard.findById(cards[0]);
    res.json(card);
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
  } catch (error) {
    res.status(400).json({ messeage: "Something went wrong" });
  }
}

async function nextCard(req, res) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ message: "Deck with ID " + id + " not found" });
  }
  const deck = await DeckSchema.findById(id);
  if (!deck) return res.status(404).json({ message: "Deck with ID " + id + " not found" });
  if (deck.userId !== req.userId) {
    return res.status(403).json({ message: authFailMessage });
  }
  const cardsArray = await CardsArray.findOne({ deckID: id });
  if (!cardsArray) {
    return res.status(404).json({ message: "Go to /practice." });
  }
  if (!cardsArray.cards) {
    return res.status(404).json({ message: "Cards empty." });
  }
  try {
    let cards = cardsArray.cards;
    let card = await Flashcard.findById(cards[0]);
    res.json(card);
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
  } catch (error) {
    res.status(400).json({ message: "Something went wrong." });
  }
}

module.exports = {
  createDeck,
  getDeck,
  getDeckFlashcards,
  getDecks,
  updateDeckName,
  deleteDeck,
  pushFlashcard,
  removeFlashcard,
  practiceDeck,
  nextCard,
};
