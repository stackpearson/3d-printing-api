const express = require('express');
const app = express();

//routes
app.get('/', (req, res) => {
    res.send('node api now running')
})

app.listen(3000, ()=> {
    console.log('node api now running on http://localhost:3000/')
})