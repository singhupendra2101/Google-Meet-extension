const mongoose = require('mongoose');

const url = 'mongodb+srv://upendra21:upup2121@cluster0.pcjr6ho.mongodb.net/up2101?retryWrites=true&w=majority&appName=Cluster0'
// asynchronous function - return promise object 
mongoose.connect(url) 
.then((result) => {
   console.log('Database connected'); 
}) 
.catch((err) => {
    console.log(err);
})

// console.log('Another statement');

module.exports = mongoose;




