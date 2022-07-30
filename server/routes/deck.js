const express = require("express");
const deckController = require("../controllers/deck.js");
const { authentication } = require("../middleware/authentication.js");

const router = express.Router();

//router.post("/push-card",authentication, deckController.pushFlashcard);
//router.post("/remove-card",authentication,deckController.removeFlashcard);
router.delete("/:id", authentication, deckController.deleteDeck);
router.post("/", authentication, deckController.createDeck);
router.get("/", authentication, deckController.getDecks);
router.get("/public", authentication, deckController.getPublicDecks);
router.get("/:id/practice", authentication, deckController.practiceDeck);
router.get("/:id/practice/next", authentication, deckController.nextCard);
router.patch("/:id", authentication, deckController.updatePublicDeck);
// // router.post("/:id", authentication, deckController.addFlashcard);
// router.get("/:id/cards", authentication, deckController.getDeckFlashcards);
router.get("/:id", authentication, deckController.getDeck);
// // router.get("/study/:id", deckController.getStudyDeck);
// router.patch("/:id", authentication, deckController.updateDeckName);

module.exports = router;
