import express from "express";
import * as flashcardControllers from "../controllers/flashcard.js";

const flashcardRouter = express.Router();

flashcardRouter.post("/", flashcardControllers.createCard);
flashcardRouter.get("/:id", flashcardControllers.getCard);
flashcardRouter.get("/", flashcardControllers.getCards);
flashcardRouter.get("/:id/front", flashcardControllers.getFront);
flashcardRouter.get("/:id/back", flashcardControllers.getBack);
flashcardRouter.delete("/:id", flashcardControllers.deleteCard);
flashcardRouter.patch("/:id/front", flashcardControllers.updateFront);
flashcardRouter.patch("/:id/back", flashcardControllers.updateBack);
flashcardRouter.patch("/:id/recallability", flashcardControllers.updateRecallability);

export default flashcardRouter;
