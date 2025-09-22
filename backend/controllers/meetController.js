const Meet = require('../Models/meetModel');

// Placeholder for a real summarization service
async function summarizeTranscript(transcript) {
    // In a real application, you would call an external AI API here.
    // For now, we'll just take the first few captions as a "summary".
    console.log("Summarizing transcript...");
    const summaryText = transcript.slice(0, 3).map(c => c.text).join(' ');
    return summaryText || "No summary could be generated.";
}

const uploadMeetCaptions = async (req, res) => {
    try {
        const { transcript, meetUrl } = req.body;
        const userId = req.user.id; // From the 'auth' middleware

        if (!transcript || transcript.length === 0) {
            return res.status(400).json({ message: 'Transcript is required.' });
        }

        // Generate summary
        const summary = await summarizeTranscript(transcript);

        const newMeet = new Meet({
            user: userId,
            meetUrl: meetUrl || 'Google Meet',
            transcript: transcript,
            summary: summary,
        });

        await newMeet.save();
        res.status(201).json({ message: 'Meeting saved successfully.', meet: newMeet });

    } catch (error) {
        console.error('Error saving meeting:', error);
        res.status(500).json({ message: 'Server error while saving meeting.' });
    }
};

const getUserMeetings = async (req, res) => {
    try {
        const userId = req.user.id;
        const meetings = await Meet.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Server error while fetching meetings.' });
    }
};

module.exports = { uploadMeetCaptions, getUserMeetings };