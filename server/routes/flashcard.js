const express = require("express");
const flashcardController = require("../controllers/flashcard.js");
const { authentication } = require("../middleware/authentication.js");

const flashcardRouter = express.Router();

flashcardRouter.post("/:deckId/cards", authentication, flashcardController.createCard);
flashcardRouter.get("/:deckId/cards/:cardId", authentication, flashcardController.getCard);
flashcardRouter.get("/:deckId/cards", authentication, flashcardController.getCards);
flashcardRouter.get("/:deckId/cards/:cardId/front", authentication, flashcardController.getFront);
flashcardRouter.get("/:deckId/cards/:cardId/back", authentication, flashcardController.getBack);
flashcardRouter.get("/:deckId/cards/:cardId/recallability", authentication, flashcardController.getCardRecallability);
flashcardRouter.delete("/:deckId/cards/:cardId", authentication, flashcardController.deleteCard);
flashcardRouter.patch("/:deckId/cards/:cardId/front", authentication, flashcardController.updateFront);
flashcardRouter.patch("/:deckId/cards/:cardId/back", authentication, flashcardController.updateBack);
flashcardRouter.patch("/:deckId/cards/:cardId/recallability", authentication, flashcardController.updateRecallability);

module.exports = flashcardRouter;
