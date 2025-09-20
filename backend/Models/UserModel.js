import { model, Schema } from '../connection.js';

const userSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default model('users', userSchema)
// module.exports = model('users', mySchema);     // name - users