// Requires
const express = require('express');
const path = require('path');
const fs = require('fs');
const dbJson = require('./db/db.json');

const PORT = process.env.PORT || 8080;

// Sets up the Express App
const app = express();

// Express uses
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Require the Routes.js files in order to communicate when to generate api routes and html files
require("./Routes")(app);

// Starts the server to begin listening
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});