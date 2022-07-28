const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const flashcardSchema = mongoose.Schema({
  deckId: { type: ObjectId },
  front: {
    type: String,
    required: true,
  },
  back: {
    type: String,
    required: true,
  },
  recallability: {
    type: String,
    enum: ["again", "hard", "good", "easy"],
    default: "again",
  },
  interval: {
    type: Number,
    default: 0,
  },
  repetition: {
    type: Number,
    default: 0
  },
  efactor: {
    type: Number,
    default: 2.5,
  },
});

module.exports = mongoose.model("Flashcard", flashcardSchema);
