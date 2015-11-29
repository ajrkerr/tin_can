// Cross browser WebRTC variables
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

var IceCandidate =
  window.RTCIceCandidate ||
  window.mozRTCIceCandidate ||
  window.webkitRTCIceCandidate ||
  window.msRTCIceCandidate;

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
    peerConnection.addIceCandidate(new IceCandidate(candidate));
  });

  peerConnection.onaddstream = function (mediaObject) {
    console.log("Adding a new media stream");
    var container = document.querySelector(".cameras");
    addNewVideoElement(container, mediaObject.stream);
  };

  return peerConnection;
}

window.noop = function () {
  console.trace();
  console.log(arguments);
};

window.TinCan = {};