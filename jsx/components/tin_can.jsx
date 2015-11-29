import React from 'react';
import Reflux from 'reflux';
import UsernameForm from './username_form';
import ChatInput from './chat_input';
import ChatMessageList from './chat_message_list';

import usernameStore from '../stores/username_store';
import echoServerAdapter from '../adapters/echo_server_adapter';

const TinCan = React.createClass({
  mixins: [Reflux.connect(usernameStore, "usernameStore")],
  render() {
    var username = this.state.usernameStore.get('username');
    var pageContents = false;
    if (username) {
      pageContents = <div>
        <h3>Hello {username}!</h3>
        <ChatInput />
        <ChatMessageList />
      </div>;
    } else {
      pageContents = <UsernameForm />;
    }
    return (
      <div className="container-fluid">
        {pageContents}
      </div>
    )
  }
});

export default TinCan;