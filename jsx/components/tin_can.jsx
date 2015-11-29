import React from 'react';
import Reflux from 'reflux';
import UsernameForm from './username_form';

import usernameStore from '../stores/username_store';

const TinCan = React.createClass({
  mixins: [Reflux.connect(usernameStore, "usernameStore")],
  render() {
    var username = this.state.usernameStore.get('username');
    var usernameForm = false;
    if(username) {
      usernameForm = <h3>Hello {username}!</h3>;
    } else {
      usernameForm = <UsernameForm />;
    }
    return (
      <div className="container-fluid">
        {usernameForm}
      </div>
    )
  }
});

export default TinCan;