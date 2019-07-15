import React, { Component } from 'react';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isButtonDisabled: false
    }
    this.parent = this.props.parent;
  }

  authenticate() {
    this.setState({isButtonDisabled: true});
    fetch('/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'email': this.state.email,
        'password': this.state.password
      })
    })
      .then(response => response.json())
      .then((data) => {
        this.parent.login(data.results);
      });
  }

  updateEmail(event) {
    this.setState({email: event.target.value});
  }
  updatePassword(event) {
    this.setState({password: event.target.value});
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-8 mx-auto">
            <div className="text-center">
              <div className="input-group pb-4">
                <input className='form-control mx-4 text-lg' onChange={this.updateEmail.bind(this)} placeholder={'email'}/>
              </div>
              <div className="input-group pb-4">
                <input className='form-control mx-4 text-lg' onChange={this.updatePassword.bind(this)} type={"password"} placeholder={'password'}/>
              </div>
              <button onClick={this.authenticate.bind(this)} className="btn btn-primary btn-dark" disabled={this.state.isButtonDisabled}>
                LOGIN
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
