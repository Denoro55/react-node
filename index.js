const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const sockets = require('./sockets');
const config = require('config');
const PORT = process.env.PORT || config.get('PORT');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '50mb'}));
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
}));

// чтобы нашло фронтенд приложение index.html
const root = require('path').join(__dirname, 'client', 'build');
app.use(express.static(root));

app.use('/public', express.static(path.join(__dirname, 'public')));
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

console.log('------ ENVIRONMENT: ----------', process.env);

if (process.env.NODE_ENV !== 'development') {
    io.origins([`vast-depths-03209.herokuapp.com:*`]);
}

sockets(io);

async function start() {
    await mongoose.connect(config.get('mongoUri'), {useNewUrlParser: true, useFindAndModify: false});

    http.listen(PORT, function () {
        console.log(`Server is listening on port ${PORT}!`);
    });
}

start();
