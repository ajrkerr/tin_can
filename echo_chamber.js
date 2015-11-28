var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/echo_chamber.html');
});

function echoBroadcast(io, socket, event, sendToBroadcaster) {
  console.log("Binding: ", event);

  socket.on(event, function (message) {
    console.log("Received: ", event, "::", message);

    if(sendToBroadcaster) {
      io.emit(event, message);
    } else {
      socket.broadcast.emit(event, message);
    }

  });
}

io.on('connection', function(socket){
  console.log('a user connected');

  echoBroadcast(io, socket, "chat message", true);
  echoBroadcast(io, socket, "new answer");
  echoBroadcast(io, socket, "new offer");
  echoBroadcast(io, socket, "new ice candidate");
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

