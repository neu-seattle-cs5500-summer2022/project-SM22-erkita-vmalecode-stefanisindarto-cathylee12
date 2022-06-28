const express = require("express");
const flashcardController = require("../controllers/flashcard.js");

const flashcardRouter = express.Router();

flashcardRouter.post("/", flashcardController.createCard);
flashcardRouter.get("/:id", flashcardController.getCard);
flashcardRouter.get("/", flashcardController.getCards);
flashcardRouter.get("/:id/front", flashcardController.getFront);
flashcardRouter.get("/:id/back", flashcardController.getBack);
flashcardRouter.delete("/:id", flashcardController.deleteCard);
flashcardRouter.patch("/:id/front", flashcardController.updateFront);
flashcardRouter.patch("/:id/back", flashcardController.updateBack);
flashcardRouter.patch("/:id/recallability", flashcardController.updateRecallability);

module.exports = flashcardRouter;
