import React from 'react';

import actions from '../actions/actions';

const UsernameForm = React.createClass({
  getInitialState() {
    return {
      username: "",
      error: false
    }
  },
  handleUsernameChange(evt) {
    this.setState({username: evt.target.value});
  },
  submitUsername(evt) {
    evt.preventDefault();
    var username = this.state.username.trim();
    if (!username) {
      this.setState({error: true});
      return;
    }
    this.setState({error: false});
    actions.setUsername(username);
  },
  render() {
    var alert = false;
    if (this.state.error) {
      alert = <div className="alert alert-danger">
        <span className="glyphicon glyphicon-exclamation-sign"></span>
        <span> Enter a username</span>
      </div>
    }
    return (
      <div className="row">
        <div className="col-md-4">
        </div>
        <div className="jumbotron col-md-4">
          <form className="form-inline" onSubmit={this.submitUsername}>
            {alert}
            <div className="input-group">
              <span className="input-group-addon">Username</span>
              <input type="text" className="form-control" onChange={this.handleUsernameChange}/>
            </div>
            <button type="submit" className="btn btn-success pull-right">Submit</button>
          </form>
        </div>
      </div>
    )
  }
});

export default UsernameForm;