import { Schema, model, Types } from 'mongoose';

const meetSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String },
    code: { type: String },
    summary: { type: String },
    description: { type: String },
    start: { type: Date },
    end: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default model('meetnotes', meetSchema);