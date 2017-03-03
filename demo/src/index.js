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
      blobObject: null
    }
  }

  startRecorder= () => {
    this.setState({
      record: true
    });
  }

  saveRecorder= () => {
    this.setState({
      record: false
    });
  }

  onStop= (blobObject) => {
    this.setState({
      blobURL : blobObject.blobURL
    })
  }

  render() {
    return(
      <MuiThemeProvider>
        <div>
          <ReactMic
            record={this.state.record}
            backgroundColor="#FF4081"
            onStop={this.onStop}
            strokeColor="#000000" />
          <FloatingActionButton
            secondary={true}
            onTouchTap={this.startRecorder}>
            <MicrophoneOn />
          </FloatingActionButton>
          <FloatingActionButton
            secondary={true}
            onTouchTap={this.saveRecorder}>
            Save
          </FloatingActionButton>
          <audio ref="audioSource" controls="controls" src={this.state.blobURL}></audio>
        </div>
    </MuiThemeProvider>
    );
  }
}

render(<Demo/>, document.querySelector('#demo'))
