const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

const socketSrc = require('./tasks/socket');

const session = require('express-session')({
    secret: 'num word puzzle game',
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //   maxAge: 1000 * 60 * 10
    // },
});
const sharedsession = require('express-socket.io-session');

const port = process.env.PORT || 8081;
const baseUrl = 'localhost';

app.use(express.static(__dirname + '/public'));

app.use(session);
io.use(sharedsession(session));

app.get('/', (req, res) => {
    req.session.ship_exists = false;
    res.sendFile(__dirname + '/index.html');
});

let number;
let connections = [];

socketSrc.useSocket(io).then(() => {
    server.listen(port, baseUrl, () => {
        console.log(`Listening on ${server.address().port}`);
    });
    number = setInterval(() => {
        socketSrc.onTimeInteval(io);
    }, 30 * 60 * 1000);// 

    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);


    server.on('connection', connection => {
        connections.push(connection);
        connection.on('close', () => connections = connections.filter(curr => curr !== connection));
    });

});

function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    clearInterval(number);
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}