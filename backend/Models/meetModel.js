import { model, Schema } from '../connection.js';

const meetSchema = new Schema({
    name: String,
    code: { type: String },
    summary: String,
    description: String,
    start: { type: Date },
    end: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

export default model('meetnotes', meetSchema);