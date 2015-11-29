import Reflux from 'reflux';
import Immutable from 'immutable';

import actions from '../actions/actions';

export default Reflux.createStore({
  data: Immutable.Map({
    chatMessages: Immutable.List()
  }),
  getInitialState() {
    return this.data;
  },
  listenables: [actions],
  onReceiveChatMessage(chatMessage) {
    this.data = this.data.updateIn(['chatMessages'], list => list.push(chatMessage));
    this.trigger(this.data);
  }
});