const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const companyRouter = require("./routes/companyRouter");
const bcrypt = require('bcrypt');
const employeeRouter = require("./routes/employeeRouter");
require('dotenv').config();

const app = express()


// midlewares 
app.use(express.static("assets"));
app.use(session({
    secret: process.env.classified_session, // Clé secrète pour signer la session
    resave: false, // Ne réenregistre pas la session à chaque requête
    saveUninitialized: false // Ne sauvegarde pas les sessions vides
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(companyRouter);
app.use(employeeRouter);


app.listen(process.env.PORT, (err) => {
    console.log(err ? err : `Success! Connected to server on port ${process.env.PORT}`);});

try{mongoose.connect(process.env.BDD_URI);
console.log("connecté à la base de donnée");
}catch(error){
    console.log(error);
}

    
