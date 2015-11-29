import React from 'react';
import cx from 'classnames';

import actions from '../actions/actions';

const ChatInput = React.createClass({
  getInitialState() {
    return {
      chatMessage: "",
      error: false
    }
  },
  handleChatMessage(evt) {
    this.setState({chatMessage: evt.target.value});
  },
  submitChatMessage(evt) {
    evt.preventDefault();
    var chatMessage = this.state.chatMessage.trim();
    if (!chatMessage) {
      this.setState({error: true});
      return;
    }
    actions.sendChatMessage(chatMessage);
    this.replaceState(this.getInitialState());
  },
  render() {
    return (
      <div>
        <form className="form-inline" onSubmit={this.submitChatMessage}>
          <div className={cx("input-group", this.state.error ? "has-error" : "")}>
            <input type="text" value={this.state.chatMessage} className="form-control" onChange={this.handleChatMessage}/>
          </div>
          <button type="submit" className="btn btn-success">Send</button>
        </form>
      </div>
    )
  }
});

export default ChatInput;