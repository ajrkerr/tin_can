import Reflux from 'reflux';
import Immutable from 'immutable';

import actions from '../actions/actions';

export default Reflux.createStore({
  listenables: [actions],
  onCallUser(username) {
    console.log("Calling a user...")
  }
});