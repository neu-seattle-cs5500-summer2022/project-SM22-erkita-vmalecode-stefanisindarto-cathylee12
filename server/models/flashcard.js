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
});

module.exports = mongoose.model("Flashcard", flashcardSchema);
