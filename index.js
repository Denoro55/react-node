const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
// const addRequestId = require('express-request-id');
const sockets = require('./sockets');

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

const root = require('path').join(__dirname, 'client', 'build');
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
});

app.get('/server', function (req, res) {
    console.log(req.session);
    req.session.user = req.session.user ? req.session.user + 1 : 1;
    res.send('Counter ' + req.session.user);
});

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

sockets(io);

async function start() {
    await mongoose.connect(config.get('mongoUri'), {useNewUrlParser: true});

    http.listen(PORT, function () {
        console.log(`Example app listening on port ${PORT}!`);
    });
}

start();
