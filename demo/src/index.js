import React                    from 'react'
import {render}                 from 'react-dom'
import { FloatingActionButton,
        MuiThemeProvider }      from 'material-ui';
import injectTapEventPlugin    from 'react-tap-event-plugin';
import MicrophoneOn            from 'material-ui/svg-icons/av/mic';
import MicrophoneOff             from 'material-ui/svg-icons/av/stop';

import { ReactMic, startRecording, stopRecording } from '../../src';
require ('./styles.scss');
injectTapEventPlugin();

let Demo = React.createClass({
  render() {
    return <MuiThemeProvider>
      <div>
        <ReactMic
          backgroundColor="#FF4081"
          strokeColor="#000000" />
        <FloatingActionButton
          secondary={true}
          onTouchTap={startRecorder}>
          <MicrophoneOn />
        </FloatingActionButton>
        <FloatingActionButton
          secondary={true}
          onTouchTap={stopRecorder}>
          <MicrophoneOff />
        </FloatingActionButton>
      </div>
    </MuiThemeProvider>
  }
});

function startRecorder(){
  startRecording();
}

function stopRecorder(){
  stopRecording();
}

render(<Demo/>, document.querySelector('#demo'))
