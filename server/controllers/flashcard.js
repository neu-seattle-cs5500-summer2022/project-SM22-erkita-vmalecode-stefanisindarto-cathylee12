const { default: mongoose } = require("mongoose");
const Deck = require("../models/deck.js");
const Flashcard = require("../models/flashcard.js");

const invalidTokenMessage = "Authentication not valid";
const invalidDeckMessage = "Deck not found";
const invalidIdMessage = "Not a valid object ID.";

function isObjectIdValid(res, deckId, cardId) {
  if (!mongoose.Types.ObjectId.isValid(deckId) ||
      !mongoose.Types.ObjectId.isValid(cardId)) {
    return res
      .status(404)
      .json({ message: invalidIdMessage });
  }
}

function isDeckValid(res, deck) {
  if (deck == null) {
    return res.status(404).json({ message: invalidDeckMessage });
  }
}

function isUserValid(req, res, deck) {
  if (deck.userId !== req.userId) {
    return res.status(401).json({ message: invalidTokenMessage });
  }
}

async function createCard(req, res) {
  const { deckId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(deckId)) {
    return res
      .status(404)
      .json({ message: invalidIdMessage });
  }
  const deck = await Deck.findById(req.params.deckId);
  const newCard = new Flashcard({
    deckId: req.params.deckId,
    front: req.body.front,
    back: req.body.back,
  });
  isDeckValid(res, deck);
  isUserValid(req, res, deck);
  try {
    await newCard.save();
    await Deck.updateOne(
      { _id: req.params.deckId },
      { $push: { cards : newCard } }
    );
    res.status(201).json(newCard);
    return newCard._id;
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
}

async function getCard(req, res) {
  const { deckId } = req.params;
  const { cardId } = req.params;
  isObjectIdValid(res, deckId, cardId);
  const deck = await Deck.findById(req.params.deckId);
  isDeckValid(res, deck);
  isUserValid(req, res, deck);
  try {
    const card = await Flashcard.findById(cardId);
    if (!card) {
      res.status(404).json({ message: "Card not found." });
    } else {
      res.status(200).json(card);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getCards(req, res) {
  const { deckId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(deckId)) {
    return res
      .status(404)
      .json({ message: invalidIdMessage });
  }
  const deck = await Deck.findById(deckId);
  isDeckValid(res, deck);
  isUserValid(req, res, deck);
  try {
    const deckId = req.params.deckId;
    const cards = await Flashcard.find({ deckId: deckId });
    res.status(200).json(cards);
    return cards;
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function getFront(req, res) {
  const { deckId } = req.params;
  const { cardId } = req.params;
  isObjectIdValid(res, deckId, cardId);
  const deck = await Deck.findById(deckId);
  isDeckValid(res, deck);
  isUserValid(req, res, deck);
  try {
    const card = await Flashcard.findById(cardId);
    res.status(200).json(card.front);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function getBack(req, res) {
  const { deckId } = req.params;
  const { cardId } = req.params;
  isObjectIdValid(res, deckId, cardId);
  const deck = await Deck.findById(deckId);
  isDeckValid(res, deck);
  isUserValid(req, res, deck);
  try {
    const card = await Flashcard.findById(cardId);
    res.status(200).json(card.back);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function getCardRecallability(req, res) {
  const { deckId } = req.params;
  const { cardId } = req.params;
  isObjectIdValid(res, deckId, cardId);
  const deck = await Deck.findById(deckId);
  isDeckValid(res, deck);
  isUserValid(req, res, deck);
  try {
    const card = await Flashcard.findById(cardId);
    res.status(200).json(card.recallability);
    return card.recallability;
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function deleteCard(req, res) {
  const { deckId } = req.params;
  const { cardId } = req.params;
  isObjectIdValid(res, deckId, cardId);
  const deck = await Deck.findById(req.params.deckId);
  isDeckValid(res, deck);
  isUserValid(req, res, deck);
  try {
    const card = await Flashcard.findByIdAndDelete(cardId);
    if (!card) {
      res.status(404).json({ message: "Card not found." });
    } else {
      await Deck.updateOne(
        { _id: req.params.deckId },
        { $pullAll: { cards: [ { _id: cardId } ] } }
      );
      res.status(200).json({ message: "Card deleted successfully",cardId: cardId });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function updateFront(req, res) {
  const { deckId } = req.params;
  const { cardId } = req.params;
  isObjectIdValid(res, deckId, cardId);
  const deck = await Deck.findById(deckId);
  isDeckValid(res, deck);
  isUserValid(req, res, deck);
  try {
    const card = await Flashcard.findById(cardId);
    card.front = req.body.front;
    await card.save();
    res.status(200).json(card);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function updateBack(req, res) {
  const { deckId } = req.params;
  const { cardId } = req.params;
  isObjectIdValid(res, deckId, cardId);
  const deck = await Deck.findById(deckId);
  isDeckValid(res, deck);
  isUserValid(req, res, deck);
  try {
    const card = await Flashcard.findById(cardId);
    card.back = req.body.back;
    await card.save();
    res.status(200).json(card);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function updateRecallability(req, res) {
  const { deckId } = req.params;
  const { cardId } = req.params;
  isObjectIdValid(res, deckId, cardId);
  const deck = await Deck.findById(deckId);
  isDeckValid(res, deck);
  isUserValid(req, res, deck);
  try {
    const card = await Flashcard.findById(cardId);
    card.recallability = req.body.recallability;
    await card.save();
    res.status(200).json(card);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

module.exports = {
  createCard,
  getCard,
  getCards,
  getCardRecallability,
  getFront,
  getBack,
  deleteCard,
  updateFront,
  updateBack,
  updateRecallability,
};
