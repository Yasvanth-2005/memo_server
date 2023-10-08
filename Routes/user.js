const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const userTokenCheck = require("../middleware/UserCheck");

router.get("/", userTokenCheck, (req, res) => {
  res.status(200).json(req.user);
});

router.post("/signup", async (req, res) => {
  const { username, email, password, image } = req.body;
  try {
    const existingUser = await User.findOne({ username: username });

    //checking for existing user
    if (existingUser) {
      return res
        .status(401)
        .json({ message: "User with same username or email Already exists" });
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 12);

    //creating user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      image,
    });

    await newUser.save();

    const token = jwt.sign({ user: newUser }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });
    res.status(200).json({ token, user: newUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    //checking if the user not exists
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(403).send({ message: "User not found" });
    }

    //checking password
    const checkPassword = await bcrypt.compare(password, existingUser.password);
    if (!checkPassword) {
      return res.status(403).send({ message: "Invalid password" });
    }

    //generating token
    const token = jwt.sign({ user: existingUser }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });
    res.status(200).send({ token, user: existingUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});

module.exports = router;
