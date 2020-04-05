// const app = require('express')();
// var io = require('socket.io')(app);
// var cfg = require('./config.json');
// var tw = require('node-tweet-stream')(cfg);

// tw.track('socket.io');
// tw.track('javascript');

const app = require('express')();
const path = require('path');
const http = require('http').createServer(app);
const Twitter = require('node-tweet-stream')();
Twitter.track('kardashian');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

tw.on('tweet', function (tweet) {
  io.emit('tweet', tweet);
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
