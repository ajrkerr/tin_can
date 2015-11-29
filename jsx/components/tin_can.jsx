import React from 'react';
import Reflux from 'reflux';
import UsernameForm from './username_form';
import ChatInput from './chat_input';
import ChatMessageList from './chat_message_list';
import LocalVideoStream from './local_video_stream';
import VideoStreamList from './video_stream_list';
import ConnectedUserList from './connected_user_list';

import usernameStore from '../stores/username_store';
import echoServerAdapter from '../adapters/echo_server_adapter';
import setupCall from '../services/setup_call';

const TinCan = React.createClass({
  mixins: [Reflux.connect(usernameStore, "usernameStore")],
  render() {
    var username = this.state.usernameStore.get('username');
    var pageContents = false;
    if (username) {
      pageContents = <div>
        <h3>Hello {username}!</h3>
        <div className="row">
          <div className="col-sm-6">
            <LocalVideoStream />
            <VideoStreamList />
          </div>
          <div className="col-sm-6">
            <ChatInput />
            <ChatMessageList />
            <ConnectedUserList />
          </div>
        </div>
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