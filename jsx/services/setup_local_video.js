import Reflux from 'reflux';
import Immutable from 'immutable';

import actions from '../actions/actions';

// Cross browser WebRTC variables
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

export default Reflux.createStore({
  listenables: [actions],
  onEnableLocalVideo() {
    var failure = function () {
      alert("We could not access your camera.");
      console.log(arguments);
      throw "Could not access camera";
    };

    var success = function (stream) {
      actions.setupLocalVideoStream(stream)
    };

    var mediaConstraints = {
      audio: true,
      video: true
    };

    navigator.getUserMedia(
      mediaConstraints,
      success,
      failure
    );
  }
});