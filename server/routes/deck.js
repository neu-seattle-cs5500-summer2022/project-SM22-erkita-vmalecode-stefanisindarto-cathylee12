// // import authentication from "../middleware/authentication.js";
const express = require("express");
const deckController = require("../controllers/deck.js");

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("works");
//   res.status(200);
// });
router.post("/", deckController.createDeck);
// router.post("/", authentication, deckController.createDeck);
router.get("/", deckController.getDecks);
// router.get("/", deckController.getDeck);
// router.patch("/:id", authentication, deckController.updateDeckName);
// router.delete("/:id", authentication, deckController.deleteDeck);
// router.delete("/", authentication, deckController.deleteDeck);

module.exports = router;
