import Reflux from 'reflux';
import Immutable from 'immutable';

import usernameStore from '../stores/username_store';
import actions from '../actions/actions';

export default Reflux.createStore({
  data: Immutable.Map({
    username: ''
  }),
  getInitialState() {
    return this.data;
  },
  listenables: [actions],
  init() {
    this.listenTo(usernameStore, this.updateUsername);
  },
  updateUsername(data) {
    this.data = this.data.set('username', data.get('username'));
  },
  onSendChatMessage(chatMessage) {
    actions.receiveChatMessage({
      chatMessage: chatMessage,
      username: this.data.get('username'),
      timeStamp: new Date().getTime()
    });
  }
});