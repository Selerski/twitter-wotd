const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');
const server = http.createServer(app);
const io = socketio(server);

const Twitter = require('twitter');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

const { API_KEY, API_SECRET_KEY, ACC_TOKEN, ACC_TOKEN_SECRET } = process.env;

const t = new Twitter({
  consumer_key: API_KEY,
  consumer_secret: API_SECRET_KEY,
  access_token_key: ACC_TOKEN,
  access_token_secret: ACC_TOKEN_SECRET,
});

app.use(cors());
var clients = {};
t.stream('statuses/filter', { track: 'coronavirus' }, (stream) => {
  io.on('connection', (socket) => {
    clients[socket.id] = socket;
    stream.on('data', (tweet) => {
      socket.emit('tweet', { tweet: tweet.text, language: tweet.lang });
    });
    stream.on('error', (error) => console.log('No data', error));
    socket.on('disconnect', () => {
      
      delete clients[socket.id];
    });
  });
});

app.use(express.static(path.join(__dirname, '/public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

server.listen(PORT, function () {
  console.log(`Server listening on ${PORT}`);
});
