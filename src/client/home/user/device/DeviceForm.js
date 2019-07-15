import React, { Component } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class DeviceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      devicename: '',
      devicepass: '',
      isButtonDisabled: false,
    };
    this.parent = this.props.parent;
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false, isButtonDisabled: false});
  }

  handleDeviceNameChange(event) {
    this.setState({devicename: event.target.value});
  }
  handleDevicePassChange(event) {
    this.setState({devicepass: event.target.value});
  }

  createDevice() {
    this.setState({isButtonDisabled: true})
    this.parent.createDevice(this.state.devicename, this.state.devicepass);
  }

  render() {
    const { startDate } = this.state;
    let styles = this.state.visibility
      ? { display: "block" }
      : { display: "none" };
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Add Device"
        >

          <div className="row">
            <div className="text-center">
              <div className="input-group card-body">
                <input className='form-control mx-2 text-lg' onChange={this.handleDeviceNameChange.bind(this)} placeholder="devicename"/>
                <input className='form-control mx-2 text-lg' onChange={this.handleDevicePassChange.bind(this)} placeholder="devicepass" type="password"/>
              </div>
              <button onClick={this.closeModal.bind(this)} disabled={this.state.isButtonDisabled} className="btn btn-primary btn-danger mx-2">CANCEL</button>
              <button onClick={this.createDevice.bind(this)} disabled={this.state.isButtonDisabled} className="btn btn-primary mx-2">ADD DEVICE</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
