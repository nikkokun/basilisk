import React, { Component } from 'react';
import DeviceCard from './device/DeviceCard';
import DeviceForm from './device/DeviceForm';

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: props.isAuthenticated,
      id: props.id,
      firstname: props.firstname,
      lastname: props.lastname,
      email: props.email,
      deviceCards: {}
    };
    this.parent = props.parent;
    this.deviceFormRef = React.createRef();

    fetch('/api/userDevices/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'ownerId': this.state.id,
      })
    })
      .then(response => response.json())
      .then((data) => {

        data.results.forEach((result) => {
          this.addCard(result.id,
            result.devicename,
            result.devicepass,
            result.is_alarm,
            result.is_alert,
            result.is_enabled);
        });

        this.setState({devices: data.results});
      });
  }

  addCard(deviceId, devicename, devicepass, isAlarm, isAlert, isEnabled) {
    let deviceCards = this.state.deviceCards;
    let reference = React.createRef();
    let deviceCard = <DeviceCard id={deviceId}
                                 devicename={devicename}
                                 devicepass={devicepass}
                                 isAlarm={isAlarm}
                                 isAlert={isAlert}
                                 isEnabled={isEnabled}
                                 parent={this}
                                 ref={reference}/>;
    deviceCards[devicename] = {'deviceCard': deviceCard, 'reference': reference};
    this.setState({deviceCards: deviceCards});
  }

  logout() {
    this.parent.logout();
  }

  renderLogout() {
    if (this.state.isAuthenticated = true && this.state.isAuthenticated != null) {
      return <button onClick={this.logout.bind(this)} className="btn btn-primary btn-dark ml-xl-5">LOGOUT</button>;
    }
  }

  createDevice(devicename, devicepass) {
    this.deviceFormRef.current.closeModal();

    fetch('/api/devices', {
      mode: 'cors',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'ownerId': this.state.id,
        'devicename': devicename,
        'devicepass': devicepass,
        'isEnabled': false,
        'isAlert': false,
        'isAlarm': false
      })
    })
      .then(response => response.json())
      .then((data) => {
        let devices = this.state.devices;
        data = data.results;
        this.addCard(
          data.id,
          data.devicename,
          data.devicepass,
          data.is_alarm,
          data.is_alert,
          data.is_enabled);

        devices.push(data);

        this.setState({ devices});
        this.deviceFormRef.current.closeModal();
      });
  }

  showDeviceForm() {
    this.deviceFormRef.current.openModal();
  }

  render() {
    let deviceCards = [];
    for (const key in this.state.deviceCards) {
      deviceCards.push(this.state.deviceCards[key].deviceCard);
    }
    return (
      <div>
        <div className="row ml-4">
          <button onClick={this.showDeviceForm.bind(this)} className="btn btn-primary">ADD DEVICE</button>
          {this.renderLogout()}
        </div>
        <DeviceForm ref={this.deviceFormRef} parent={this} visibility={false} />
        {deviceCards}
      </div>
    );
  }
}
