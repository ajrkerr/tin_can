import React from 'react';
import Reflux from 'reflux';

import connectedUserStore from '../stores/connected_user_store';
import actions from '../actions/actions';

const ConnectedUserList = React.createClass({
  mixins: [Reflux.connect(connectedUserStore, "connectedUserStore")],
  getInitialState() {
    return {}
  },
  callUser(username) {
    actions.callUser(username);
  },
  render() {
    var users = this.state.connectedUserStore.get('usernames');
    var userRows = users.map((username, i) =>
      <li key={i}>
        {username} -
          <a className="btn-call btn btn-info btn-xs" onClick={this.callUser.bind(this, username)} >
            Call <span className="glyphicon glyphicon-earphone"></span>
          </a>
      </li>
    );

    return (
      <div>
        <ul>
          {userRows}
        </ul>
      </div>
    )
  }
});

export default ConnectedUserList;