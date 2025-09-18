const express = require("express");
const router = express.Router();
const Model = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// 1. Import Google's OAuth 2.0 client library
const { OAuth2Client } = require('google-auth-library');
// IMPORTANT: Make sure your Google Client ID is in your .env file
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// --- NEW GOOGLE SIGN-IN ROUTE ---
router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Google token is missing." });
  }

  try {
    // 2. Verify the token received from the frontend with Google's servers
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    // 3. Check if the user already exists in your database
    let user = await Model.findOne({ email: email });

    // 4. If user doesn't exist, create a new user account
    if (!user) {
      // For users signing up with Google, we can create a secure, random password
      // as they will not be using it to log in directly.
      const randomPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      
      user = new Model({
        name,
        email,
        password: hashedPassword, // Store the hashed random password
        // You can also add the profile picture if your schema supports it
        // profilePicture: picture, 
      });
      await user.save();
    }

    // 5. Create a JWT token for the user session (same as regular login)
    const jwtPayload = { 
        _id: user._id, 
        name: user.name, 
        email: user.email 
    };

    jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // Token expires in 1 day
      (err, jwtToken) => {
        if (err) throw err;
        res.status(200).json({ token: jwtToken, name: user.name, email: user.email });
      }
    );

  } catch (err) {
    console.error("Google authentication error:", err);
    res.status(500).json({ message: "Google authentication failed. Please try again." });
  }
});


// --- EXISTING SECURE SIGNUP LOGIC ---
router.post("/add", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields." });
  }
  
  try {
    const existingUser = await Model.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new Model({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ 
        message: "Account created successfully. Please log in." 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});


// --- EXISTING SECURE LOGIN LOGIC ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    const user = await Model.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { 
        _id: user._id, 
        name: user.name, 
        email: user.email 
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, name: user.name, email: user.email });
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


// --- ALL OTHER EXISTING ROUTES (UNCHANGED) ---

router.get("/getall", (req, res) => {
  Model.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/getbyid/:id", (req, res) => {
  Model.findById(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/delete/:id", (req, res) => {
  Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/update/:id", (req, res) => {
  Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/getbyemail/:email", (req, res) => {
  console.log(req.params.email);
  Model.findOne({ email: req.params.email })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;
