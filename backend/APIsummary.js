const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.get("/ai", async (req, res) => {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [
              { text: "Hello AI!" }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/test", (req, res) => {
  res.send("Express is working!");
});

app.listen(5000, () => console.log("Server running on port 5000"));
