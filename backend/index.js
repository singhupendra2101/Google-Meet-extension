require('dotenv').config();
const express = require('express');
const UserRouter = require('./routers/userRouter');
const meetRouter = require('./routers/meetrouter');

const app = express();
const port = 5000;

// middlewares
app.use(express.json());
app.use('/user' , UserRouter);
app.use('/meet', meetRouter);

// routes
app.get('/user', (req, res) => {
    res.send('response from express')
});

app.get('/add', (req, res) => {
    res.send('response from add')
});

app.get('/update', (req, res) => {
    res.send('response from update')
});

app.get('/delete', (req, res) => {
    res.send('response from delete')
});

// starting the server
app.listen(port, () => {
    console.log('Server has started');
});