var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Immutable = require('immutable');

function echoBroadcast(io, socket, event, sendToBroadcaster) {
  console.log("Binding: ", event);

  socket.on(event, function (message) {
    console.log("Received: ", event, "::", arguments);

    if(sendToBroadcaster) {
      io.emit(event, message);
    } else {
      socket.broadcast.emit(event, message);
    }
  });
}

// This is definitely not a thread safe way to handle this
var usernames = Immutable.Set();

io.on('connection', function(socket) {
  console.log('a user connected');
  var currentUser;

  usernames.forEach(function (username) {
    console.log("Sending", username)
    socket.emit("user connected", username);
  });

  echoBroadcast(io, socket, "chat message", true);
  echoBroadcast(io, socket, "new answer");
  echoBroadcast(io, socket, "new offer");
  echoBroadcast(io, socket, "new ice candidate");
  echoBroadcast(io, socket, "connected user");

  socket.on("connect user", function (newUsername) {
    console.log("Received: connected user::", arguments);
    socket.broadcast.emit("user connected", newUsername);
    currentUser = newUsername;
    usernames = usernames.add(currentUser);
  });

  socket.on("disconnect", function (message) {
    console.log("Received: ", "disconnect", "::", arguments, currentUser);
    socket.broadcast.emit("user disconnected", currentUser);
    usernames = usernames.delete(currentUser);
  });
});

io.on('disconnect', function(socket) {
  console.log("Disconnection!")
});

http.listen(3030, function(){
  console.log('listening on *:3030');
});

