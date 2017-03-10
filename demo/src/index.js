import React, {Component}      from 'react'
import { render }              from 'react-dom'
import { FloatingActionButton,
        MuiThemeProvider }     from 'material-ui';
import injectTapEventPlugin    from 'react-tap-event-plugin';
import MicrophoneOn            from 'material-ui/svg-icons/av/mic';
import MicrophoneOff           from 'material-ui/svg-icons/av/stop';

import { ReactMic, saveRecording } from '../../src';
require ('./styles.scss');
injectTapEventPlugin();

let blobURL;

export default class Demo extends Component {
  constructor(props){
    super(props);
    this.state = {
      record: false,
      blobObject: null,
      isRecording: false
    }
  }

  startRecording= () => {
    this.setState({
      record: true,
      isRecording: true
    });
  }

  stopRecording= () => {
    this.setState({
      record: false,
      isRecording: false
    });
  }

  onStop= (blobObject) => {
    this.setState({
      blobURL : blobObject.blobURL
    })
  }

  render() {
    const { isRecording } = this.state;

    return(
      <MuiThemeProvider>
        <div>
          <h1>ReactMic</h1>
          <ReactMic
            record={this.state.record}
            backgroundColor="#FF4081"
            onStop={this.onStop}
            strokeColor="#000000" />
            <div>
              <audio ref="audioSource" controls="controls" src={this.state.blobURL}></audio>
            </div>
            <br />
            <br />
            <FloatingActionButton
              className="btn"
              secondary={true}
              disabled={isRecording}
              onTouchTap={this.startRecording}>
              <MicrophoneOn />
            </FloatingActionButton>
            <FloatingActionButton
              className="btn"
              secondary={true}
              disabled={!isRecording}
              onTouchTap={this.stopRecording}>
              <MicrophoneOff />
            </FloatingActionButton>
        </div>
    </MuiThemeProvider>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'))
