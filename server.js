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

socketSrc.useSocket(io).then(() => {
  server.listen(port, baseUrl, () => {
    console.log(`Listening on ${server.address().port}`);
  });
});