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