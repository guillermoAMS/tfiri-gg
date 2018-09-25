import React, { Component } from 'react';
import './App.css';

import Toolbar from './components/Toolbar';
import ImageView from './components/ImageView';
import LabelList from './components/LabelList';

class App extends Component {

  state = {selectedFile: null}

  handleUploadedImg = (imgPath) => {
    this.setState({selectedFile: imgPath})
  }

  render() {
    return (
      <div className="App">
        <Toolbar uploadedImg={this.handleUploadedImg}/>
        {
          this.state.selectedFile && <ImageView key={this.state.selectedFile} uploadedImg={this.state.selectedFile}/>
        }
        <LabelList/>
      </div>
    );
  }
}

export default App;
