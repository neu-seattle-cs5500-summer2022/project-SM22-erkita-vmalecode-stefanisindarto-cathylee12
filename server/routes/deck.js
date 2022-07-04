const express = require("express");
const deckController = require("../controllers/deck.js");
const { authentication } = require("../middleware/authentication.js");

const router = express.Router();

router.post("/", authentication, deckController.createDeck);
router.post("/:id", deckController.addFlashcard);
router.get("/", authentication, deckController.getDecks);
router.get("/:id/flashcards", deckController.getDeckFlashcards);
router.get("/:id", deckController.getDeck);
router.patch("/:id", deckController.updateDeckName);
router.delete("/:id", deckController.deleteDeck);

// to be implemented inplace of above after authentication
// router.post("/", authentication, deckController.createDeck);
// router.get("/", authentication, deckController.getDecks);
// router.get("/:id", authentication, deckController.getDeck);
// router.patch("/:id", authentication, deckController.updateDeckName);
// router.delete("/:id", authentication, deckController.deleteDeck);

module.exports = router;
