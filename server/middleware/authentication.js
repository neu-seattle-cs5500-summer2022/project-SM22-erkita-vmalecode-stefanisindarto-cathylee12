const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

/*
The authentication is a middleware function to authenticate users to have access and 
permission to access and update decks and flashcards.
*/
async function authentication(req, res, next) {
  try {
    const token = req.headers.authorization;
    const isCustomAuth = true;
    let decodedData;
    const SECRET = process.env.SECRET;

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, SECRET);
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = { authentication };
