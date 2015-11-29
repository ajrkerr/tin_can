function onLoad() {
  var username = getUsername();
  startWebRTC(username);
};

function startWebRTC(username) {
  // getUserMedia success callback
  var success = function (mediaStream) {
    peerConnection.onaddstream({stream: mediaStream});
    peerConnection.addStream(mediaStream);
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

  window.TinCan.caller = new Caller(socket, peerConnection, username);

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
  var username = prompt("What is your name?", "");

  while(username === "" || !username) {
    username = prompt("You have not entered a username, please provide one.", "");
  }

  return username;


  //return new Promise(function (resolve, reject) {
  //  var username = window.prompt("What's your name?", "");
  //
  //  if ("" === username || !username) {
  //    reject(Error("No username was entered"));
  //  } else {
  //    resolve(username);
  //  }
  //});
}

// Load tin_can!
window.onload = onLoad;