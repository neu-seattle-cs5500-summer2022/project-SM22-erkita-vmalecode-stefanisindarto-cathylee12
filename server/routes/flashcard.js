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

// flashcardRouter.post("/", authentication, flashcardController.createCard);
// flashcardRouter.get("/:id", authentication, flashcardController.getCard);
// flashcardRouter.get("/", authentication, flashcardController.getCards);
// flashcardRouter.get("/:id/front", authentication, flashcardController.getFront);
// flashcardRouter.get("/:id/back", authentication, flashcardController.getBack);
// flashcardRouter.delete("/:id", authentication, flashcardController.deleteCard);
// flashcardRouter.patch("/:id/front", authentication, flashcardController.updateFront);
// flashcardRouter.patch("/:id/back", authentication, flashcardController.updateBack);
// flashcardRouter.patch("/:id/recallability", authentication, flashcardController.updateRecallability);

module.exports = flashcardRouter;
