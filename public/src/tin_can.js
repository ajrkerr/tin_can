function onLoad() {
  getUsername().then(function (response) {
    startWebRTC(response);
  }, function (error) {
    console.error(error);
  });
};

function startWebRTC(username) {
  // getUserMedia success callback
  var success = function (mediaStream) {
    peerConnection.onaddstream({stream: mediaStream});
    peerConnection.addStream(mediaStream);
    peerConnection.peerIdentity.name = username;
    console.log("Logged in as:", peerConnection.peerIdentity.name);
  };

  // getUserMedia failure callback
  var failure = function () {
    console.log("Couldn't get the camera going. Blah.");
  };

  // getUserMedia constraints
  var constraints = {
    audio: true,
    video: true
  };

  // Try to access user media devices
  navigator.getUserMedia(constraints, success, failure);

  // Listen for incoming connections
  TinCan.responder.enable();

  // Send out a call when the 'call' button is clicked
  document.querySelector(".call").addEventListener("click", function (event) {
    event.preventDefault();
    TinCan.caller.sendOffer();
  });
}

// Gets the user's name and returns it as a promise
function getUsername() {
  return new Promise(function (resolve, reject) {
    var username = window.prompt("What's your name?", "");
    if ("" === username || !username) {
      reject(Error("No username was entered"));
    } else {
      resolve(username);
    }
  });
}

// Load tin_can!
window.onload = onLoad;