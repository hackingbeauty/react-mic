import React, {Component}       from 'react'
import {render}                 from 'react-dom'
import { FloatingActionButton,
        MuiThemeProvider }      from 'material-ui';
import injectTapEventPlugin    from 'react-tap-event-plugin';
import MicrophoneOn            from 'material-ui/svg-icons/av/mic';
import MicrophoneOff             from 'material-ui/svg-icons/av/stop';

import { ReactMic, startRecording, stopRecording, saveRecording } from '../../src';
require ('./styles.scss');
injectTapEventPlugin();

export default class Demo extends Component {
  constructor(props){
    super(props);
    this.state = {
      blobURL: ''
    }
  }

  startRecorder= () => {
    startRecording();
  }

  stopRecorder= () => {
    stopRecording();
  }

  saveRecorder= () => {
    const savedRecordingBlob = saveRecording();
    console.log('the saved recording is (it is a blob): ', savedRecordingBlob);
    this.setState({
      blobURL: savedRecordingBlob
    })
  }

  getBlob() {
    let blobURL = getBlobURL();
    console.log('getBlobURL yields ',blobURL);
  }

  render() {
    return(
      <MuiThemeProvider>
        <div>
          <ReactMic
            backgroundColor="#FF4081"
            strokeColor="#000000" />
          <FloatingActionButton
            secondary={true}
            onTouchTap={this.startRecorder}>
            <MicrophoneOn />
          </FloatingActionButton>
          <FloatingActionButton
            secondary={true}
            onTouchTap={this.stopRecorder}>
            <MicrophoneOff />
          </FloatingActionButton>
          <FloatingActionButton
            secondary={true}
            onTouchTap={this.saveRecorder}>
            Save
          </FloatingActionButton>
          <div>
            <audio ref="audioSource" controls="controls" src={this.state.blobURL}>
            </audio>
          </div>
        </div>
    </MuiThemeProvider>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'))
