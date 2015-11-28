// Get cross browser awesome going
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;


var PeerConnection =
  window.RTCPeerConnection ||
  window.mozRTCPeerConnection ||
  window.webkitRTCPeerConnection ||
  window.msRTCPeerConnection;

var SessionDescription =
  window.RTCSessionDescription ||
  window.mozRTCSessionDescription ||
  window.webkitRTCSessionDescription ||
  window.msRTCSessionDescription;


var socket = io();

var send = function (socket, event_type, message) {
  var payload = JSON.stringify(message);
  console.log("Sending::", event_type, '::', payload);
  socket.emit(event_type, payload);
};

var listenFor = function (socket, event_type, callback) {
  socket.on(event_type, function (event) {
    var message = JSON.parse(event);
    console.log("Received::", event_type, "::", message);
    callback(message);
  });
};

function addNewVideoElement(container, mediaStream) {
  var videoElement = document.createElement("video");
  videoElement.setAttribute("class", "webcam");

  container.appendChild(videoElement);

  videoElement.src = window.URL.createObjectURL(mediaStream);
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.controls = true;
}

function buildPeerConnection(socket, config) {
  var peerConnection = new PeerConnection(config);

  peerConnection.onicecandidate = function (event) {
    if(event.candidate) {
      send(socket, "new ice candidate", { candidate: event.candidate });
    }
  };

  listenFor(socket, "new ice candidate", function (message) {
    var candidate = message.candidate;
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  });

  peerConnection.onaddstream = function (mediaObject) {
    console.log("Adding a new media stream");
    var container = document.querySelector(".cameras");
    addNewVideoElement(container, mediaObject.stream);
  };

  return peerConnection;
}

var peerConfig = { "iceServers": [{ "url": "stun:159.203.29.172:3478" }]};
var peerConnection = buildPeerConnection(socket, peerConfig);

var noop = function () {
  console.trace();
  console.log(arguments);
};

window.TinCan = {};

window.TinCan.caller = (function (socket, peerConnection) {
  function setLocalDescription(description) {
    peerConnection.setLocalDescription(description, noop, noop);
  }

  function sendDescriptionToResponder(description) {
    send(socket, "new offer", {sessionDescription: description});
  }

  function sendOffer() {
    disable();
    enable();
    peerConnection.createOffer(function (offer) {
      var sessionDescription = new SessionDescription(offer);
      setLocalDescription(sessionDescription);
      sendDescriptionToResponder(sessionDescription);
    }, noop, {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    });
  }

  function acceptAnswer(answer) {
    var answerDescription = answer.sessionDescription;
    peerConnection.setRemoteDescription(new SessionDescription(answerDescription));
  }

  function enable() {
    listenFor(socket, "new answer", acceptAnswer);
  }

  function disable() {
    socket.removeAllListeners("new answer");
  }

  return {
    sendOffer: sendOffer,
    enable: enable,
    disbale: disable
  };
})(socket, peerConnection);


window.TinCan.responder = (function (socket, peerConnection) {
  function processOffer(offer) {
    var offerDescription = offer.sessionDescription;

    console.log("Received Offer:", offerDescription);
    if(confirm("Do you wish to accept this offer?")) {
      console.log("Offer accepted");
      peerConnection.setRemoteDescription(new SessionDescription(offerDescription));
      sendAnswer(offerDescription);
    } else {
      console.log("Offer declined");
    }
  }

  function setLocalDescription(description) {
    peerConnection.setLocalDescription(description, noop, noop);
  }

  function sendAnswerToCaller(description) {
    send(socket, "new answer", {sessionDescription: description});
  }

  function sendAnswer() {
    peerConnection.createAnswer(function (answerDescription) {
      setLocalDescription(answerDescription);
      sendAnswerToCaller(answerDescription);
    }, noop);
  }


  function enable() {
    listenFor(socket, "new offer", processOffer);
  }

  function disable() {
    socket.removeAllListeners("new offer");
  }

  return {
    enable: enable,
    disbale: disable
  };
})(socket, peerConnection);



function onLoad() {
  var success = function (mediaStream) {
    peerConnection.onaddstream({stream: mediaStream});
    peerConnection.addStream(mediaStream);
  };

  var failure = function () {
    console.log("Couldn't get the camera going. Blah.");
  };

  var constraints = {
    audio: true,
    video: true
  };

  navigator.getUserMedia(constraints, success, failure);
};

window.onload = onLoad;