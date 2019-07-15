import React, { Component } from 'react';
const io = require('socket.io-client');

export default class DeviceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: props.isEnabled,
      isAlert: props.isAlert,
      isAlarm: props.isAlarm,
      disableEnable: false,
      disableAlert: false,
      disableAlarm: false
    };

    this.id = props.id;
    this.devicename = props.devicename;
    this.devicepass = props.devicepass;
    this.parent = props.parent;
    this.socket = io.connect('socket.io/');
  }

  componentDidMount() {
    // this.socket.on("seq-num", (msg) => console.info(msg));
    this.socket.emit('join-room', {room: this.id.toString()});
    this.socket.on('test-client', (data) => console.info(data));
    this.socket.on('client-enable-change', (data) => this.setState({isEnabled: data.is_enabled, disableEnable: false}));
    this.socket.on('client-alert-change', (data) => this.setState({isAlert: data.is_alert, disableAlert: false}));
    this.socket.on('client-alarm-change', (data) => this.setState({isAlarm: data.is_alarm, disableAlarm: false}));
  }

  renderEnable() {
    if(this.state.isEnabled == false) {
      return <button onClick={this.handleEnable.bind(this)} className="btn btn-primary btn-blue mx-auto" disabled={this.state.disableEnable}>ENABLE</button>;
    } else {
      return <button onClick={this.handleEnable.bind(this)} className="btn btn-primary btn-dark mx-auto" disabled={this.state.disableEnable}>DISABLE</button>;
    }
  };

  handleEnable() {
    this.socket.emit('test-server');
    if(this.state.isEnabled == true) {
      this.setState({disableEnable: true});
      this.socket.emit('server-enable-change', {room: this.id.toString(), devicename: this.devicename, value: false});
    } else {
      this.setState({disableEnable: true});
      this.socket.emit('server-enable-change', {room: this.id.toString(), devicename: this.devicename, value: true});
    }
  };
  renderAlert() {
    if(this.state.isAlert == true) {
      return <h2 className="text-danger">INTRUDER ALERT</h2>;
    } else {
      return <h2 className="text-success">NORMAL</h2>;
    }
  };

  renderResetAlert() {
    if(this.state.isAlert == true) {
      return <button onClick={this.handleResetAlert.bind(this)} className="btn btn-primary btn-success mx-auto">RESET STATUS</button>
    }
  }

  handleResetAlert() {
    this.setState({disableAlert: true});
    this.socket.emit('server-alert-change', {room: this.id.toString(), devicename: this.devicename, value: false});
  }

  renderAlarm() {
    if(this.state.isAlarm == false) {
      return <button onClick={this.handleAlarm.bind(this)} className="btn btn-danger mx-auto" disabled={this.state.disableAlarm}>SET ALARM</button>;
    } else {
      return <button onClick={this.handleAlarm.bind(this)} className="btn btn-primary btn-dark mx-auto" disabled={this.state.disableAlarm}>TURN OFF ALARM</button>;
    }
  };

  handleAlarm() {
    if(this.state.isAlarm == true) {
      this.setState({disableAlarm: true});
      this.socket.emit('server-alarm-change', {room: this.id.toString(), devicename: this.devicename, value: false});
    } else {
      this.setState({disableAlarm: true});
      this.socket.emit('server-alarm-change', {room: this.id.toString(), devicename: this.devicename, value: true});
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-5 ml-4 mt-4">
          <div className="card">
            <div className="input-group card-body">
              <h2>DEVICE ID: {this.id}</h2>
            </div>
            <div className="input-group card-body">
              <h2>DEVICE NAME: {this.devicename}</h2>
            </div>
            <div className="input-group card-body">
              <h2>STATUS: </h2> {this.renderAlert()}
            </div>
            <div className="input-group card-body">
              {this.renderEnable()}
              {this.renderResetAlert()}
              {this.renderAlarm()}
            </div>
            <h1>{this.state.test}</h1>
          </div>
        </div>
      </div>
    );
  }
}
