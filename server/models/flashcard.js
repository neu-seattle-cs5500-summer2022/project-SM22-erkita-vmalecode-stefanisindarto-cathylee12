import mongoose from "mongoose";

const flashcardSchema = mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  recallability: {
    type: String,
    enum: ["again", "hard", "good", "easy"],
    default: "again",
  },
});

export default mongoose.model("FlashcardSchema", flashcardSchema);
