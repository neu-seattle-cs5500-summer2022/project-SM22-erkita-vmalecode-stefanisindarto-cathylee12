import mongoose from "mongoose";

const flashcardSchema = mongoose.Schema({
  front: {
    type: String,
    required: true 
  },
  back: {
    type: String,
    required: true 
  },
  recallability: {
    type: String,
    enum: ["again", "hard", "good", "easy"],
    default: "again",
  },
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

export default Flashcard;
