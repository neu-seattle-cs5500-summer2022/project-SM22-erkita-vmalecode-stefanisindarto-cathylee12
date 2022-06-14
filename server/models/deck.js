import mongoose from "mongoose";
import flashcard from "./flashcard";

const deckSchema = mongoose.Schema({
  name: { type: String, required: true },
  recallabilityPercentage: { type: Number, min: 0, max: 100 },
  lastReviewed: { type: Date, default: Date.now },
  dateCreated: { type: Date, default: new Date() },
  flashcards: [flashcard],
});

export default mongoose.model("DeckSchema", deckSchema);
