const express = require('express');
const router = express.Router();
const Model = require('../Models/meetModel');

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

//getallj
router.get('/', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});
// : denotes url 

router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });

})
//delete
router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//update
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});
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