const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

/*
The authentication is a middleware function to authenticate users to have access and 
permission to access and update decks and flashcards.
*/
async function authentication(req, res, next) {
  try {
    console.log(req.headers.authorization);
    const token = req.headers.authorization.split(" ")[1];
    console.log({ token });
    const isCustomAuth = token.length < 500;

    let decodedData;
    const SECRET = process.env.SECRET;

    if (token && isCustomAuth) {
      console.log(SECRET + "\n");
      decodedData = jwt.verify(token, SECRET);
      console.log(decodedData?.id);
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
// async function authentication(req, res, next) {
//   try {
//     const token = req.headers.authorization.split(" ")[1];

//     if (token) {
//       let decryptedData = jwt.verify(token, "secret");
//       req.userId = decryptedData?.id;
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// }

module.exports = { authentication };
