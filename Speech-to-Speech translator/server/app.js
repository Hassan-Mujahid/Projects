const express = require("express");
const cors = require("cors");
const fs = require("fs");
const translate = require("google-translate-api-x");

const app = express();

require("dotenv").config();
app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  try {
    const { text, srcLang = "auto", targetLanguage } = req.body; // Default srcLang to auto-detect

    // Perform the translation using google-translate-api-x
    const result = await translate(text, { from: srcLang, to: targetLanguage });

    // Check if the translation has any spelling or grammar corrections
    let correctedText = result.text;
    if (result.from.text.autoCorrected) {
      correctedText = result.from.text.value; // Use the corrected version if available
    }

    // Send the corrected translated text as the response
    res.json({ translatedText: correctedText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Translation failed");
  }
});

module.exports = app;
