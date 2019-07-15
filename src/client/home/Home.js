import React, { Component } from 'react';
import User from './user/User'
import Login from './login/Login'

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: sessionStorage.getItem('basilisk_is_authenticated'),
      id: sessionStorage.getItem('basilisk_user_id'),
      firstname: sessionStorage.getItem('basilisk_user_firstname'),
      lastname: sessionStorage.getItem('basilisk_user_lastname'),
      email: sessionStorage.getItem('basilisk_user_email')
    };

    this.loginReference = React.createRef();
    this.userReference = React.createRef();

  }

  login(results) {
    const info = results[0];
    this.setState({
      isAuthenticated: true,
      id: info.id,
      firstname: info.firstname,
      lastname: info.lastname,
      email: info.email
    });
    sessionStorage.setItem('basilisk_is_authenticated', true);
    sessionStorage.setItem('basilisk_user_id', info.id);
    sessionStorage.setItem('basilisk_user_firstname', info.firstname);
    sessionStorage.setItem('basilisk_user_lastname', info.lastname);
    sessionStorage.setItem('basilisk_user_email', info.email);
    // this.loginReference.current.setState({ isButtonDisabled: false });
  }

  authenticate() {
    if (this.state.isAuthenticated = true && this.state.isAuthenticated != null) {
      return <User ref={this.userReference}
                   parent={this}
                   isAuthenticated={this.state.isAuthenticated}
                   id={this.state.id}
                   firstname={this.state.firstname}
                   lastname={this.state.lastname}
                   email={this.state.email}
      />;
    }
    else {
      return <Login ref={this.loginReference} parent={this} />;
    }
  }

  logout() {
    sessionStorage.clear();
    this.setState({
      isAuthenticated: false,
      id: null,
      firstname: null,
      lastname: null,
      email: null
    });
    window.location.reload();
  }

  render() {
    return(
      <div>
        <div className="jumbotron-fluid">
          <h1 className="display-3 ml-4">Basilisk</h1>
        </div>
        <div>
          {this.authenticate()}
        </div>
      </div>
    );
  }
}
