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


function addNewVideoElement(container, mediaStream) {
  var videoElement = document.createElement("video");
  videoElement.setAttribute("class", "webcam");

  container.appendChild(videoElement);

  videoElement.src = window.URL.createObjectURL(mediaStream);
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.controls = true;
}

function onLoad() {
  var peerConnection = new PeerConnection({
    "iceServers": [{
      "url": "stun:stun.l.google.com:19302"
    }]
  });


  peerConnection.onaddstream = function (mediaObject) {
    var container = document.querySelector(".cameras");
    addNewVideoElement(container, mediaObject.stream);
  };

  var mediaCallbacks = {
    success: function (mediaStream) {
      peerConnection.onaddstream({stream: mediaStream});
      peerConnection.addStream(mediaStream);

      //peerConnection.onicecandidate = function () { console.log(arguments[0].candidate.candidate); };

      peerConnection.createOffer(function (offer) {
        var sessionDescription = new SessionDescription(offer);

        peerConnection.setLocalDescription(sessionDescription, function () {
          // send the offer to a server to be forwarded to the friend you're calling.
        }, console.log);
        console.log(sessionDescription);
        //signalingChannel.send(JSON.stringify({ sdp: sessionDescription }));
      }, console.log);
    },

    failure: function () {
      alert("Couldn't get the camera going. Blah.")
    }
  };

  var constraints = {
    audio: true,
    video: true
  };

  navigator.getUserMedia(constraints, mediaCallbacks.success, mediaCallbacks.failure);

  //
  //
  //var signalingChannel = createSignalingChannel();
  //var pc;
  //var configuration = ...;
  //
  //// run start(true) to initiate a call
  //function start(isCaller) {
  //  pc = new RTCPeerConnection(configuration);
  //
  //  // send any ice candidates to the other peer
  //  pc.onicecandidate = function (evt) {
  //    signalingChannel.send(JSON.stringify({ "candidate": evt.candidate }));
  //  };
  //
  //  // once remote stream arrives, show it in the remote video element
  //  pc.onaddstream = function (evt) {
  //    remoteView.src = URL.createObjectURL(evt.stream);
  //  };
  //
  //  // get the local stream, show it in the local video element and send it
  //  navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {
  //    selfView.src = URL.createObjectURL(stream);
  //    pc.addStream(stream);
  //
  //    if (isCaller)
  //      pc.createOffer(gotDescription);
  //    else
  //      pc.createAnswer(pc.remoteDescription, gotDescription);
  //
  //    function gotDescription(desc) {
  //      pc.setLocalDescription(desc);
  //      signalingChannel.send(JSON.stringify({ "sdp": desc }));
  //    }
  //  });
  //}
  //
  //signalingChannel.onmessage = function (evt) {
  //  if (!pc)
  //    start(false);
  //
  //  var signal = JSON.parse(evt.data);
  //  if (signal.sdp)
  //    pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
  //  else
  //    pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
  //};
};

window.onload = onLoad;