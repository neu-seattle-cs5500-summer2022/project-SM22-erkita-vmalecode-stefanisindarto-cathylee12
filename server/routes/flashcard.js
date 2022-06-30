const express = require("express");
const flashcardController = require("../controllers/flashcard.js");

const flashcardRouter = express.Router();

flashcardRouter.post("/:deckId/cards", flashcardController.createCard);
flashcardRouter.get("/:deckId/cards/:id", flashcardController.getCard);
flashcardRouter.get("/:deckId/cards", flashcardController.getCards);
flashcardRouter.get("/:deckId/cards/:id/front", flashcardController.getFront);
flashcardRouter.get("/:deckId/cards/:id/back", flashcardController.getBack);
flashcardRouter.delete("/:deckId/cards/:id", flashcardController.deleteCard);
flashcardRouter.patch("/:deckId/cards/:id/front", flashcardController.updateFront);
flashcardRouter.patch("/:deckId/cards/:id/back", flashcardController.updateBack);
flashcardRouter.patch("/:deckId/cards/:id/recallability", flashcardController.updateRecallability);

module.exports = flashcardRouter;
