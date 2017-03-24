"use strict";

const express = require('express');
const app = express();


app.use(express.static('public'));

// start Express on port 8080
app.listen(80, () => {
    console.log('Server Started on http://localhost:8080');
    console.log('Press CTRL + C to stop server');
});
