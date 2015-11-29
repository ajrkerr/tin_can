import React from 'react';
import Reflux from 'reflux';

import videoStreamStore from '../stores/video_stream_store';

const VideoStreamList = React.createClass({
  mixins: [Reflux.connect(videoStreamStore, "videoStreamStore")],
  getInitialState() {
    return {}
  },
  render() {
    var videoStreams = this.state.videoStreamStore.get('remoteStreams');
    var videoStreamList = videoStreams.map((remoteStream, i) =>
      <li key={i}>
        <video className="webcam" autoplay="true" muted="true" controls="true" src={remoteStream.stream} />
      </li>
    );

    return (
      <div>
        <h4>Active Calls</h4>
        <ul>
          {videoStreamList}
        </ul>
      </div>
    )
  }
});

export default VideoStreamList;