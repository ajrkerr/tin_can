import Reflux from 'reflux';
import Immutable from 'immutable';

import actions from '../actions/actions';
import setupLocalVideo from '../services/setup_local_video';

export default Reflux.createStore({
  data: Immutable.Map({
    localStream: '',
    remoteStreams: Immutable.List()
  }),
  getInitialState() {
    return this.data;
  },
  init() {
    if(!this.data.get('localStream')) {
      actions.enableLocalVideo();
    }
  },
  listenables: [actions],
  onSetupLocalVideoStream(videoStream) {
    this.data = this.data.set('localStream', videoStream);
    this.trigger(this.data);
  },
  onAddRemoteVideoStream(videoStream) {
    this.data = this.data.updateIn('remoteStreams', (list) => list.push(videoStream));
    this.trigger(this.data);
  }
});