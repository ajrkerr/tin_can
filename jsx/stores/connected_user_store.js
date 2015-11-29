import Reflux from 'reflux';
import Immutable from 'immutable';

import actions from '../actions/actions';

export default Reflux.createStore({
  data: Immutable.Map({
    usernames: Immutable.Set()
  }),
  getInitialState() {
    return this.data;
  },
  listenables: [actions],
  onUserConnected(username) {
    this.data = this.data.updateIn(['usernames'], list => list.add(username));
    this.trigger(this.data);
  },
  onUserDisconnected(username) {
    this.data = this.data.updateIn(['usernames'], list => list.delete(username));
    this.trigger(this.data);
  }
});