import React, { Component } from 'react';
import { ScaleLoader } from 'react-spinners';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      modalIsOpen: false,
      transformFileName: 'transformed' + this.props.filename,
      transformType: 'stretch',
      isTransforming: false
    };
    this.userId = this.props.userId;
    this.filename = this.props.filename;
    this.url = this.props.url;
    this.parent = this.props.parent;
  }

  getAudios() {
    fetch('/api/get_audios/1', { mode: 'cors' })
      .then(response => response.json())
      .then((data) => {
        this.setState({files: data});
      });
  }

  componentDidMount() {
    this.getAudios();
  }

  handleFilename(event) {
    this.setState({transformFileName: event.target.value});
  }

  handleTransformType(event) {
    console.log(event.target.value);
    this.setState({transformType: event.target.value});
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  makeTransform(){
    this.setState({isTransforming: true});
    console.log(this.state.transformType);
    fetch('http://localhost:8000/transform', {
      mode: 'cors',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'url': 'http://res.cloudinary.com/dafphfi62/video/upload/v1550366615/yq32kwbbcsq6zbgrfyfy.flac',
        'transforms': [{"type": this.state.transformType}]
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        let transformUrl = data.url;
        fetch('/api/new_audio', {
          mode: 'cors',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'filename': this.state.transformFileName,
            'url': transformUrl,
            'user_id': 1
          })
        })
          .then(response => response.json())
          .then((data) => {
            this.parent.getAudios();
            this.setState({modalIsOpen: false, isTransforming: false});
          })
          .catch((err) => {
            console.error('err', err);
            this.setState({modalIsOpen: false, isTransforming: false});
          });
      })
      .catch((err) => {
        console.error('err', err);
        this.setState({modalIsOpen: false, isTransforming: false});
      });
  }

  afterOpenModal() {

  }

  render() {
    return (
      <div className={'d-inline-block mx-5 my-5'}>
        <div className={'row'}>
          <div className={'text-center'}>
            <span className={'badge badge-dark'}>{this.filename}</span>
            <div className={'block my-2'}>
              <a href={this.url}>
                <img className={'img-thumbnail'}
                     src={'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Simple_Music.svg/2000px-Simple_Music.svg.png'}
                     width={"150"}
                     height={"150"}
                />
              </a>
            </div>
            <div className={'block'}>
              <button className={'btn btn-primary btn-dark'} onClick={this.openModal.bind(this)}>Transform</button>
            </div>
          </div>
        </div>

        <Modal
        isOpen={this.state.modalIsOpen}
        style={customStyles}
        contentLabel="Transform"
        shouldCloseOnOverlayClick={false}
        >
          <div>
            <input className='form-control text-lg' onChange={this.handleFilename.bind(this)} placeholder={'filename'}/>
            <select onChange={this.handleTransformType.bind(this)}
                    value={this.state.transformType}
                    className="form-control select_option mx-2">
              <option value={'stretch'}>Stretch</option>
              <option value={'pitch_shift'}>Pitch Shift</option>
              <option value={'percussive'}>Percussive</option>
              <option value={'harmonic'}>Harmonic</option>
              <option value={'dj'}>Dj</option>
            </select>
            <button className={'btn btn-primary btn-dark mx-3'} onClick={this.makeTransform.bind(this)}>Transform</button>
          </div>
          <ScaleLoader
            sizeUnit={'px'}
            height={50}
            width={15}
            margin={'10px'}
            radius={5}
            color={'#23272B'}
            loading={this.state.isTransforming}
          />
        </Modal>
      </div>
    );
  }
}
