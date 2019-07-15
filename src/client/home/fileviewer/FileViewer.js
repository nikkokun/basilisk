import React, { Component } from 'react';
import { ScaleLoader } from 'react-spinners';
import Modal from 'react-modal';
import File from './File';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
    border                : '0px',
  }
};

export default class FileViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      files: [],
      fileObjects: [],
      filename: '',
      fileurl: '',
      progress: null,
      modalIsOpen: true
    };
    this.userId = this.props.userId;
  }

  getAudios() {
    fetch('/api/get_audios/1', { mode: 'cors' })
      .then(response => response.json())
      .then((data) => {
        let files = data.results;
        let fileObjects = [];
        console.log(files);
        for (var i in files) {
          const fileObject = <File userid={this.userId}
                                    filename={files[i].filename}
                                    url={files[i].url}
                                    parent={this} />;
          console.log(fileObject);
          fileObjects.push(fileObject);
        }
        this.setState({ files: files, fileObjects: fileObjects});
      });
  }
  componentDidMount() {
    this.getAudios();
  }

  render() {
    const fileObjects = this.state.fileObjects.map(fileObject => fileObject);
    console.log(this.state.fileObjects);
    return (
      <div className={'my-4'}>
        <h2>Files</h2>
        {fileObjects}
      </div>
    );
  }
}
