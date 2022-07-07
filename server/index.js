const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const deckRoutes = require("./routes/deck.js");
const cardRoutes = require("./routes/flashcard.js");
const userRouter = require("./routes/user.js");
const dotenv = require("dotenv");
const path = require('path');
var http = require("http");

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api/decks", deckRoutes);
// app.use("/api/cards", cardRoutes);
app.use("/api", userRouter);



const mongoEndpoint = process.env.MONGOENDPOINT;
const PORT = process.env.PORT || 8000;

mongoose.Promise = global.Promise;


mongoose
  .connect(mongoEndpoint)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log(error));

// serve the frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('Environment must be set to production!'))
}
module.exports = app;
