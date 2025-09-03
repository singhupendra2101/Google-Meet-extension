const express = require("express");
const router = express.Router();
const Model = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Password hashing ke liye zaroori
require("dotenv").config();

// Hugging Face waala code (aap ise baad mein use kar sakte hain)
const { HfInference } = require("@huggingface/inference");
const verifyToken = require("../middlewares/auth");
const hf = new HfInference(process.env.HF_TOKEN);


// --- NAYA AUR SECURE SIGNUP LOGIC ---
router.post("/add", async (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields." });
  }
  
  try {
    // Step 1: Check karein ki user pehle se hai ya nahi
    const existingUser = await Model.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Step 2: Password ko hash (encrypt) karein
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 3: Naya user banayein aur save karein
    const newUser = new Model({
      name,
      email,
      password: hashedPassword, // Hashed password save hoga
    });
    await newUser.save();

    // Step 4: Sirf success message bhejein, koi token nahi
    res.status(201).json({ 
        message: "Account created successfully. Please log in." 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});


// --- NAYA AUR SECURE LOGIN LOGIC ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password." });
  }

  try {
    // Step 1: User ko email se dhoondhein
    const user = await Model.findOne({ email });
    console.log(user);
    
    if (!user) {
      // User nahi mila
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 2: Database ke hashed password se compare karein
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Password match nahi hua
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 3: Password match hone par JWT token banayein
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


// --- BAAKI KE ROUTES (UNCHANGED) ---

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

router.get("/getuser", verifyToken, (req, res) => {
  console.log(req.user);
  
  Model.findById(req.user._id)
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

// Note: Aapka "/getbyemail/:email" route upar ke "getbyid" jaisa hi hai,
// par use naye authentication flow mein zaroorat nahi hai.
// Agar aapko fir bhi chahiye to aap use rakh sakte hain.
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