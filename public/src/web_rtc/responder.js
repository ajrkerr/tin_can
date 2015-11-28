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