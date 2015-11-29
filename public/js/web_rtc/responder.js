window.TinCan = window.TinCan || {};

function Responder(socket, peerConnection) {
  this.socket = socket;
  this.peerConnection = peerConnection;
}

Object.assign(Responder.prototype, {
  _processOffer: function (offer) {
    console.log("Received Offer:", offer);

    if (confirm("Do you wish to accept a call from " + offer.fromName + "?")) {
      console.log("Offer accepted");

      this._setRemoteDescription(offer.sessionDescription);

      new Promise(this._createAnswer.bind(this))
        .then(this._setLocalDescription.bind(this), noop)
        .then(this._sendAnswerToCaller.bind(this), noop);

    } else {
      console.log("Offer declined");
    }
  },

  _setRemoteDescription: function (remoteDescription) {
    this.peerConnection.setRemoteDescription(new SessionDescription(remoteDescription));
  },

  _createAnswer: function (accept, reject) {
    this.peerConnection.createAnswer(accept, reject);
  },

  _setLocalDescription: function (description) {
    this.peerConnection.setLocalDescription(description, noop, noop);
    return description;
  },

  _sendAnswerToCaller: function (description) {
    send(this.socket, "new answer", {
      sessionDescription: description
    });
    return description;
  },

  enable: function () {
    listenFor(this.socket, "new offer", this._processOffer.bind(this));
  },

  disable: function () {
    this.socket.removeAllListeners("new offer");
  }
});

window.TinCan.Responder = Responder;