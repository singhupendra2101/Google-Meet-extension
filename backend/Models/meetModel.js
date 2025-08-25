const { model, Schema } = require('../connection');

const mySchema = new Schema({
    name: String,
    code: { type: String, required: true },
    summary: String,
    description: String,
    start:{ type: Date, required: true },
    end:{ type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});
module.exports = model('meetnotes', mySchema);     // name - meet