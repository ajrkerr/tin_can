function Caller(socket, peerConnection, fromName) {
  this.socket = socket;
  this.peerConnection = peerConnection;
  this.fromName = fromName;

  this.offerAttributes = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };
}

Object.assign(Caller.prototype, {
  enable: function() {
    listenFor(this.socket, "new answer", this._acceptAnswer.bind(this));
  },

  disable: function() {
    this.socket.removeAllListeners("new answer");
  },

  sendOffer: function() {
    this.disable();
    this.enable();

    new Promise(this._createOffer.bind(this))
      .then(this._setLocalDescription.bind(this), noop)
      .then(this._sendDescriptionToResponder.bind(this), noop);
  },

  _createOffer: function(resolve, reject) {
    this.peerConnection.createOffer(resolve, reject, this.offerAttributes);
  },

  _setLocalDescription: function (description) {
    this.peerConnection.setLocalDescription(description, noop, noop);
    return description;
  },

  _sendDescriptionToResponder: function (description) {
    send(this.socket, "new offer", {
      sessionDescription: description,
      fromName: this.fromName
    });
    return description;
  },

  _acceptAnswer: function(answer) {
    var answerDescription = answer.sessionDescription;
    this.peerConnection.setRemoteDescription(new SessionDescription(answerDescription));
  },
});

window.TinCan = window.TinCan || {};
window.TinCan.Caller = Caller;