const express = require("express");
const deckController = require("../controllers/deck.js");
const { authentication } = require("../middleware/authentication.js");

const router = express.Router();

router.post("/", authentication, deckController.createDeck);
router.get("/", authentication, deckController.getDecks);
router.get("/:id", authentication, deckController.getDeck);
router.get("/public", authentication, deckController.getPublicDecks);
router.get("/:id/practice", authentication, deckController.practiceDeck);
router.get("/:id/practice/next", authentication, deckController.nextCard);
router.patch("/public/:id", authentication, deckController.updatePublicDeck);
router.patch("/:id", authentication, deckController.updateDeckName);
router.delete("/:id", authentication, deckController.deleteDeck);

module.exports = router;
