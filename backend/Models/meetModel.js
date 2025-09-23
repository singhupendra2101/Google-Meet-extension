import { Schema, model, Types } from 'mongoose';

const meetSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    transcript: { type: String },
    meetUrl: { type: String },
    summary: { type: String },
    startTime: { type: String },
    endTime: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default model('meetnotes', meetSchema);