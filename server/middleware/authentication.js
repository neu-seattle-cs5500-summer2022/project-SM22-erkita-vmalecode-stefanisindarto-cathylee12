const dotenv = require('dotenv').config();
const jwt = requiore("jsonwebtoken");

/*
The authentication is a middleware function to authenticate users to have access and 
permission to access and update decks and flashcards.
*/
const authentication = async (req, res, next) => {

    try{
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodedData;
        const SECRET = process.env.SECRET;

        if(token && isCustomAuth){
            decodedData = jwt.verify(token,SECRET);
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next();
    } catch(error) {
        console.log(error);
    }
};

module.export = authentication;
