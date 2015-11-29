import Reflux from 'reflux';
import Immutable from 'immutable';

import actions from '../actions/actions';

export default Reflux.createStore({
  data: Immutable.Map({
    username: ''
  }),
  getInitialState() {
    return this.data;
  },
  listenables: [actions],
  onSetUsername(username) {
    this.data = this.data.set('username', username);
    this.trigger(this.data);
  }
});