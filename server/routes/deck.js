import express from "express";
import * as deckController from "../controllers/deck.js";
import authentication from "../middleware/authentication.js";

const router = express.Router();

router.post("/decks", authentication, deckController.createDeck);
router.get("/decks", deckController.getDecks);
router.get("/deck/:id", deckController.getDeck);
router.patch("/decks/:id", authentication, deckController.updateDeckName);
router.delete("/decks/:id", authentication, deckController.deleteDeck);
router.delete("/decks", authentication, deckController.deleteDeck);

export default router;
