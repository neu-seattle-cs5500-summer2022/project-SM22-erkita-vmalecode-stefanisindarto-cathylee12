const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const deckRoutes = require("./routes/deck.js");
const cardRoutes = require("./routes/flashcard.js");
const userRouter = require("./routes/user.js");
const dotenv = require("dotenv");
var http = require("http");

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api/decks", deckRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api", userRouter);

app.get("/", (req, res) => {
  res.send("Test: App running succesfully");
});

const mongoEndpoint = process.env.MONGOENDPOINT;
const PORT = process.env.PORT || 8000;

/*
mongoose
  .connect(mongoEndpoint)
  .then(() =>
    app.listen(constants.PORT, () =>
      console.log(`Server Running on Port ${constants.PORT}`)
    )
  )
  .catch((error) => console.log(error.message));
  */

mongoose.Promise = global.Promise;

mongoose
  .connect(mongoEndpoint)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log(error));

// var server = http.createServer(app);
// server.listen(1337, function () {
//   console.log("Node server running on http://localhost:1337");
// });

module.exports = app;
