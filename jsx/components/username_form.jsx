import React from 'react';

const UsernameForm = React.createClass({
  render() {
    return (
      <div className="row">
        <div className="col-md-4">
        </div>
        <div className="jumbotron col-md-4">
          <form className="form-inline">
            <div className="input-group">
              <span className="input-group-addon">Username</span>
              <input type="text" className="form-control"/>
            </div>
            <button type="submit" className="btn btn-success pull-right">Submit</button>
          </form>
        </div>
      </div>
    )
  }
});

export default UsernameForm;