import Reflux from 'reflux';
import Immutable from 'immutable';

import usernameStore from '../stores/username_store';
import actions from '../actions/actions';

import io from 'socket.io-client';

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
    this.socket = io(location.hostname + ":" + 3030);

    this.socket.on('chat message', function (payload) {
      var chatMessage = JSON.parse(payload);
      actions.receiveChatMessage(chatMessage);
    });
  },
  updateUsername(data) {
    this.data = this.data.set('username', data.get('username'));
  },
  onSendChatMessage(chatMessage) {
    var payload = JSON.stringify({
      chatMessage: chatMessage,
      username: this.data.get('username'),
      timeStamp: new Date().getTime()
    });

    this.socket.emit('chat message', payload);
  }
});