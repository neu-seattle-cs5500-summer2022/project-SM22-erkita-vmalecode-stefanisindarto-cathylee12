import express from "express";
import * as flashcardControllers from "../controllers/flashcard.js";

const flashcardRouter = express.Router();

flashcardRouter.post("/", flashcardControllers.createCard);
flashcardRouter.get("/", flashcardControllers.getCards);

export default flashcardRouter;
