const dotenv = require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/user.js");
const emailValidator = require("email-validator");

/*
 Login function checks if the user exists in the databse and if so,
 checks if the password input match what is stored in database.
 If successful, send the results which are the existing user detail and the user's token.
 */
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const existingUser = await UserSchema.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
}

function isInvalidEmail(email) {
  return !emailValidator.validate(email);
}

function isInvalidPassword(password) {
  return password == null || password.length === 0 || password.length < 6;
}

/*
 Signup function checks if the user exists in the databse and if so,
 returns error message.
 Otherwise, it checks if the password and confirm password input match.
 If everything match, create a hashed password before storing the user details in database.
 Lastly, returns the user detail along with the user's token.
 */
const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const existingUser = await UserSchema.findOne({ email });

    if (existingUser) {
      return res.status(404).json({ message: "User already exists." });
    }

    if (isInvalidEmail(email)) {
      return res.status(401).json({ message: "Valid email required." });
    }

    if (isInvalidPassword(password.toString())) {
      return res
        .status(401)
        .json({ message: "Valid password of at least 6 characters required." });
    }

    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await UserSchema.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      { email: result.email, id: result.id },
      process.env.SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({ result, token });
  } catch (error) {
    console.log("Server Error: ", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = { login, signup };
