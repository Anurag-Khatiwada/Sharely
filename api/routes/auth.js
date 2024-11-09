const router = require("express").Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Register request body:", req.body);

  try {
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      profilePicture: "",
      coverPicture: "",
      followers: [],
      following: [],
      isAdmin: true,
      desc: "",
      city: "",
      from: "",
      relationship: "",
    });

    const savedUser = await newUser.save();
    return res.status(200).json(savedUser);
  } catch (err) {
    console.error("Error in /register:", err); // Add this line
    return res.status(500).json({ message: err.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      localStorage.setItem("currentUser", json.stringify(user))
      return res.status(200).json(user);

    } else {
      return res.status(400).json({ message: "Invalid password" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
