// tw.track('socket.io');
// tw.track('javascript');
const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const server = http.createServer(app);
const io = socketio(server);

const Twitter = require('twitter');
require('dotenv').config();

const port = process.env.PORT || 3001;
const { API_KEY, API_SECRET_KEY, ACC_TOKEN, ACC_TOKEN_SECRET } = process.env;

const t = new Twitter({
  consumer_key: API_KEY,
  consumer_secret: API_SECRET_KEY,
  access_token_key: ACC_TOKEN,
  access_token_secret: ACC_TOKEN_SECRET,
});

app.use(bodyParser.json());
app.use(cors({origin: 'https://localhost:3001'}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  t.stream('statuses/filter', { track: 'java' }, (stream) => {
    stream.on('data', ({ text }) => {
      socket.emit('tweet', { tweet: text });
    });

    stream.on('error', function (error) {
      throw error;
    });
  });
});

server.listen(port, function () {
  console.log('listening on *:3000');
});
