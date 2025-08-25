const express = require('express');
const router = express.Router();
const Model = require('../models/UserModel');

// 👇 NAYA CODE START HOTA HAI YAHAN SE
const { HfInference } = require('@huggingface/inference');

// Hugging Face se API token lene ke baad yahan use karein
const hf = new HfInference(process.env.HF_TOKEN);
// 👆 NAYA CODE YAHAN KHATAM HOTA HAI

// --- AAPKA PURANA USER MANAGEMENT CODE ---

router.post('/add', (req, res) => {
    console.log(req.body);
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getbyemail/:email', (req, res) => {
    console.log(req.params.email);
    Model.findOne({ email: req.params.email })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// --- 👇 NAYA SUMMARIZATION KA ROUTE ---

router.post('/summarize', async (req, res) => {
    const { transcript } = req.body;
    console.log('Transcript received for summarization.');

    if (!transcript) {
        return res.status(400).json({ error: 'Transcript is required.' });
    }

    try {
        const result = await hf.summarization({
            model: 'sshleifer/distilbart-cnn-12-6',
            inputs: transcript,
            parameters: {
                min_length: 50,
                max_length: 150,
            }
        });

        const summary = result.summary_text;
        console.log('Summary generated successfully.');
        res.status(200).json({ summary: summary });

    } catch (error) {
        console.error('Error during summarization:', error);
        res.status(500).json({ error: 'Failed to generate summary.' });
    }
});


module.exports = router;