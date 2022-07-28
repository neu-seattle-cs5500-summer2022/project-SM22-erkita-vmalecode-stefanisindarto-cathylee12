const mongoose = require("mongoose");
const { ObjectId } = require("bson");

const cardsArraySchema = mongoose.Schema({
  deckID: { type: ObjectId },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard'}]
})

module.exports = mongoose.model("CardsArray", cardsArraySchema);
