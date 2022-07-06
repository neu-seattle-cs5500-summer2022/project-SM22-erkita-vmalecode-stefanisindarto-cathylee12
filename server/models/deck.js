const mongoose = require("mongoose");
const { Flashcard } = require("./flashcard.js");

const deckSchema = mongoose.Schema({
  userId: { type: String },
  name: { type: String, required: true },
  recallabilityPercentage: { type: Number, min: 0, max: 100, default: 0 },
  lastReviewed: { type: Date, default: Date.now },
  dateCreated: { type: Date, default: new Date() },
  cards: [{ 
    front: String,
    back: String
  }],
  
});

module.exports = mongoose.model("DeckSchema", deckSchema);
