const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const addRequestId = require('express-request-id');

const config = require('config');

// routes

const PORT = config.get('PORT');

app.use(cors());
// app.use(addRequestId());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
}));

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/server', function (req, res) {
    console.log(req.session);
    req.session.user = req.session.user ? req.session.user + 1 : 1;
    res.send('Counter ' + req.session.user);
});

const apiRoutes = require('./routes/api');

app.use('/api', apiRoutes);

async function start() {
    await mongoose.connect(config.get('mongoUri'), {useNewUrlParser: true});

    app.listen(PORT, function () {
        console.log(`Example app listening on port ${PORT}!`);
    });
}

start();
