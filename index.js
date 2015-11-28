var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/echo_chamber.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('chat message', function (message) {
    console.log("Message Received");
    console.log(message);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

