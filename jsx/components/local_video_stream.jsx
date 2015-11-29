import React from 'react';
import Reflux from 'reflux';

import videoStreamStore from '../stores/video_stream_store';

const VideoStreamList = React.createClass({
  mixins: [Reflux.connect(videoStreamStore, "videoStreamStore")],
  getInitialState() {
    return {}
  },
  render() {
    var localStream = this.state.videoStreamStore.get('localStream');

    return (
      <div>
        <h4>Your Face</h4>
        <video className="webcam" autoPlay muted controls src={window.URL.createObjectURL(localStream)} />
      </div>
    )
  }
});

export default VideoStreamList;