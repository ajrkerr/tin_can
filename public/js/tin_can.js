function onLoad() {
  var username = getUsername();

  var socket = io();

  var peerConfig = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }]};
  var peerConnection = buildPeerConnection(socket, peerConfig);

  startChat(socket, username);
  startLocalMedia(peerConnection);
  startWebRTC(socket, peerConnection, username);
}

function startChat(socket, username) {
  var form = document.getElementById("message-form");
  var messagesElement = document.getElementById('messages');
  var messageInput = document.getElementById('new-message');

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if(messageInput.value != '') {
      send(socket, 'chat message', {
        username: username,
        message: messageInput.value
      });

      messageInput.value = '';
    }
  });

  listenFor(socket, "chat message", function (payload) {
    var username = payload.username;
    var message = payload.message;

    var newElement = document.createElement("li");
    newElement.textContent = username + ": " + message;

    messagesElement.appendChild(newElement);
  });
}

function startLocalMedia(peerConnection) {
  var addStream = function (mediaStream) {
    console.log("Adding local stream")
    peerConnection.onaddstream({stream: mediaStream});
    peerConnection.addStream(mediaStream);
    return mediaStream;
  };

  var reportFailure = function () {
    alert("We could not access your camera.");
    console.log(arguments);
    throw "Could not access camera";
  };

  var mediaConstraints = {
    audio: true,
    video: true
  };

  var promise = new Promise(function (success, failure) {
    return navigator.getUserMedia(mediaConstraints, success, failure);
  });

  return promise.then(addStream, reportFailure);
}

function startWebRTC(socket, peerConnection, username) {
  var caller = new Caller(socket, peerConnection, username);
  var responder = new Responder(socket, peerConnection);

  responder.enable();

  // Send out a call when the 'call' button is clicked
  document
    .querySelector(".call")
    .addEventListener("click", function (event) {
      event.preventDefault();
      caller.sendOffer();
    });
}

function getUsername() {
  var username = prompt("What is your name?", "");
  while(username === "" || !username) {
    username = prompt("You have not entered a username, please provide one.", "");
  }
  return username;
}

window.onload = onLoad;