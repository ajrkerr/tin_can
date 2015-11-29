import React from 'react';
import Reflux from 'reflux';

import chatMessageStore from '../stores/chat_message_store';

const ChatMessageList = React.createClass({
  mixins: [Reflux.connect(chatMessageStore, "chatMessageStore")],
  getInitialState() {
    return {}
  },
  render() {
    var chatMessages = this.state.chatMessageStore.get('chatMessages');
    var chatMessageRows = chatMessages.map((chatMessage, i) => <tr key={i}>
      <td>{chatMessage.username}: {chatMessage.chatMessage}</td>
    </tr>).reverse();

    return (
      <div>
        <table className="table table-striped table-hover table-condensed">
          <tbody>
            {chatMessageRows}
          </tbody>
        </table>
      </div>
    )
  }
});

export default ChatMessageList;