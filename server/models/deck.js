// import flashcard from "./flashcard";
const mongoose = require("mongoose");

const deckSchema = mongoose.Schema({
  userId: { type: String },
  name: { type: String },
  recallabilityPercentage: { type: Number, min: 0, max: 100, default: 0 },
  lastReviewed: { type: Date, default: Date.now },
  dateCreated: { type: Date, default: new Date() },
  //   flashcards: [flashcard],
});

// export default mongoose.model("DeckSchema", deckSchema);
module.exports = mongoose.model("DeckSchema", deckSchema);
