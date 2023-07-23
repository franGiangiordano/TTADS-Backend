const express = require('express');
const path = require('path'); 

const app = express();

// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.use('/api/', require('./routes'));

module.exports = app;